import { afterEach, expect, it, vi } from "vitest";
import { ImageImportError } from "../../../lib/image-proxy/errors";

const upstream = vi.hoisted(() => vi.fn());
vi.mock("../../../lib/image-proxy/fetch-image", () => ({
  fetchImage: upstream,
}));

import { GET } from "./route";

function request(site = "same-origin", url = "https://images.example/a") {
  return new Request(
    `https://editor.example/api/image-proxy?url=${encodeURIComponent(url)}`,
    { headers: { "sec-fetch-site": site } }
  );
}
afterEach(() => vi.clearAllMocks());
it.each(["cross-site", "same-site", ""])("拒绝非同源调用 %s", async (site) => {
  expect((await GET(request(site))).status).toBe(403);
  expect(upstream).not.toHaveBeenCalled();
});
it.each([
  ["INVALID_ADDRESS", 400],
  ["NOT_IMAGE", 415],
  ["TOO_LARGE", 413],
  ["TIMEOUT", 504],
  ["FETCH_DENIED", 502],
] as const)("抓取错误 %s 映射到 %s", async (code, status) => {
  upstream.mockRejectedValue(new ImageImportError(code));
  const result = await GET(request());
  expect(result.status).toBe(status);
  expect(await result.json()).toMatchObject({ error: code });
});
it("none 来源允许，流传输图片块与完成标记", async () => {
  upstream.mockResolvedValue({
    body: (async function* () {
      yield await Promise.resolve(Buffer.from([1, 2, 3]));
    })(),
    contentType: "image/png",
  });
  const result = await GET(request("none"));
  expect(result.status).toBe(200);
  expect(await result.text()).toBe(
    '{"chunk":"AQID"}\n{"done":true,"type":"image/png"}\n'
  );
});
it("流开始后的超限也传递可识别错误，不发成功标记", async () => {
  upstream.mockResolvedValue({
    body: (async function* () {
      yield await Promise.resolve(Buffer.from([1]));
      throw new ImageImportError("TOO_LARGE");
    })(),
    contentType: "image/png",
  });
  expect(await (await GET(request())).text()).toBe(
    '{"chunk":"AQ=="}\n{"error":"TOO_LARGE"}\n'
  );
});

it("浏览器取消流时终止上游请求", async () => {
  let upstreamSignal: AbortSignal | undefined;
  upstream.mockImplementation((_source, _host, signal: AbortSignal) => {
    upstreamSignal = signal;
    return Promise.resolve({
      body: (async function* () {
        yield await Promise.resolve(Buffer.from([1]));
      })(),
      contentType: "image/png",
    });
  });
  const result = await GET(request());
  await result.body?.cancel();
  expect(upstreamSignal?.aborted).toBe(true);
});

it.each([
  [{ origin: "https://editor.example" }, 200],
  [{ referer: "https://editor.example/editor" }, 200],
  [
    { origin: "https://other.example", referer: "https://editor.example/" },
    403,
  ],
  [{ referer: "invalid" }, 403],
  [{}, 403],
])(
  "缺 Fetch Metadata 时按 Origin 或 Referer 校验 %j",
  async (headers, status) => {
    upstream.mockResolvedValue({
      body: (async function* () {
        yield await Promise.resolve(Buffer.from([1]));
      })(),
      contentType: "image/png",
    });
    const result = await GET(
      new Request(
        "https://editor.example/api/image-proxy?url=https://images.example/a",
        { headers: headers as HeadersInit }
      )
    );
    expect(result.status).toBe(status);
    if (status === 403) {
      expect(await result.json()).toEqual({ error: "FORBIDDEN_ORIGIN" });
    } else {
      await result.text();
    }
  }
);
