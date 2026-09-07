import { EventEmitter } from "node:events";
import { Readable } from "node:stream";
import { afterEach, expect, it, vi } from "vitest";

const network = vi.hoisted(() => ({ lookup: vi.fn(), request: vi.fn() }));
vi.mock("node:dns/promises", () => ({ lookup: network.lookup }));
vi.mock("node:http", () => ({ request: network.request }));
vi.mock("node:https", () => ({ request: network.request }));

import { fetchImage } from "./fetch-image";

const png = Buffer.from("89504e470d0a1a0a", "hex");
function response(
  chunks: Buffer[],
  headers: Record<string, string> = { "content-type": "image/png" },
  statusCode = 200
) {
  return Object.assign(Readable.from(chunks), { headers, statusCode });
}
function setup(responses: ReturnType<typeof response>[]) {
  network.lookup.mockResolvedValue([{ address: "93.184.216.34", family: 4 }]);
  network.request.mockImplementation((_url, _options, callback) => {
    const request = new EventEmitter();
    Object.assign(request, {
      destroy: () => undefined,
      end: () => callback(responses.shift()),
    });
    return request;
  });
}
async function consume(source = "https://images.example/a") {
  const result = await fetchImage(
    source,
    "editor.example",
    new AbortController().signal
  );
  const chunks: Uint8Array[] = [];
  for await (const chunk of result.body) {
    chunks.push(chunk);
  }
  return { data: Buffer.concat(chunks), type: result.contentType };
}
afterEach(() => {
  vi.clearAllMocks();
  vi.useRealTimers();
});

it("流式读取图片并固定 DNS 结果建连，不发送 Referer", async () => {
  setup([response([png, Buffer.alloc(30)])]);
  expect(await consume()).toEqual({
    data: Buffer.concat([png, Buffer.alloc(30)]),
    type: "image/png",
  });
  const [[, options]] = network.request.mock.calls;
  expect(options.headers).not.toHaveProperty("referer");
  expect(options.headers).not.toHaveProperty("Referer");
  const resolved = vi.fn();
  options.lookup("images.example", {}, resolved);
  expect(resolved).toHaveBeenCalledWith(null, "93.184.216.34", 4);
});

it.each([
  ["image/png", "89504e470d0a1a0a", "image/png"],
  ["image/jpeg", "ffd8ff", "image/jpeg"],
  ["image/gif", "474946383961", "image/gif"],
  ["image/webp", "524946460000000057454250", "image/webp"],
  ["image/avif", "00000020667479706176696600000000", "image/avif"],
  ["image/bmp", "424d", "image/bmp"],
])("接受 %s 魔数", async (declared, hex, expected) => {
  setup([response([Buffer.from(hex, "hex")], { "content-type": declared })]);
  expect((await consume()).type).toBe(expected);
});

it.each([
  [response([png], { "content-type": "text/html" }), "NOT_IMAGE"],
  [response([Buffer.from("<html>oops</html>")]), "NOT_IMAGE"],
  [
    response([png], {
      "content-length": "4194305",
      "content-type": "image/png",
    }),
    "TOO_LARGE",
  ],
  [response([png], {}, 403), "FETCH_DENIED"],
])("拒绝错误响应", async (upstream, code) => {
  setup([upstream]);
  await expect(consume()).rejects.toThrow(code);
});

it("未知长度的流超过 4MB 中止", async () => {
  setup([
    response([
      Buffer.concat([png, Buffer.alloc(56)]),
      Buffer.alloc(4 * 1024 * 1024),
    ]),
  ]);
  await expect(consume()).rejects.toThrow("TOO_LARGE");
});

it("重定向每跳重新校验，拒绝公网跳到私网", async () => {
  setup([response([], { location: "http://10.0.0.1/a" }, 302)]);
  await expect(consume()).rejects.toThrow("INVALID_ADDRESS");
  expect(network.request).toHaveBeenCalledTimes(1);
});

it("相对重定向解析后成功，第四跳拒绝", async () => {
  setup([response([], { location: "/b" }, 302), response([png])]);
  expect((await consume()).type).toBe("image/png");
  expect(network.lookup).toHaveBeenCalledTimes(2);
  setup(Array.from({ length: 4 }, () => response([], { location: "/b" }, 302)));
  await expect(consume()).rejects.toThrow("FETCH_DENIED");
});

it("DNS 未完成也受 10 秒总超时限制", async () => {
  vi.useFakeTimers();
  network.lookup.mockImplementation(() => new Promise(() => undefined));
  const pending = expect(consume()).rejects.toThrow("TIMEOUT");
  await vi.advanceTimersByTimeAsync(10_000);
  await pending;
});

it("响应体停滞也受同一个 10 秒超时限制", async () => {
  vi.useFakeTimers();
  const stalled = Object.assign(
    new Readable({
      read() {
        /* controlled network stall */
      },
    }),
    { headers: { "content-type": "image/png" }, statusCode: 200 }
  );
  stalled.push(Buffer.concat([png, Buffer.alloc(56)]));
  setup([stalled]);
  const result = await fetchImage(
    "https://images.example/a",
    "editor.example",
    new AbortController().signal
  );
  await result.body.next();
  const pending = expect(result.body.next()).rejects.toThrow("TIMEOUT");
  await vi.advanceTimersByTimeAsync(10_000);
  await pending;
  expect(stalled.destroyed).toBe(true);
});
