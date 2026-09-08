import { afterEach, expect, it, vi } from "vitest";
import { fetchRemoteImage } from "./remote-image";

const fetcher = vi.fn();
vi.stubGlobal("fetch", fetcher);
afterEach(() => fetcher.mockReset());

it("直连使用 CORS 且不带 Referer，成功返回图片 Blob", async () => {
  fetcher.mockResolvedValue(
    new Response(new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]), {
      headers: { "content-type": "image/png" },
    })
  );
  expect((await fetchRemoteImage("https://images.example/a")).type).toBe(
    "image/png"
  );
  expect(fetcher).toHaveBeenCalledWith(
    "https://images.example/a",
    expect.objectContaining({ mode: "cors", referrerPolicy: "no-referrer" })
  );
  expect(fetcher).toHaveBeenCalledTimes(1);
});
it.each([
  new TypeError("Failed to fetch"),
  new Response("missing", { status: 404 }),
  new Response("html"),
])("直连失败一律代理，不猜测 CORS 或 HTTP 原因", async (failure) => {
  if (failure instanceof Error) {
    fetcher.mockRejectedValueOnce(failure);
  } else {
    fetcher.mockResolvedValueOnce(failure);
  }
  fetcher.mockResolvedValueOnce(
    new Response('{"chunk":"AQID"}\n{"done":true,"type":"image/png"}\n')
  );
  const blob = await fetchRemoteImage("https://images.example/a");
  expect(new Uint8Array(await blob.arrayBuffer())).toEqual(
    new Uint8Array([1, 2, 3])
  );
  expect(fetcher.mock.calls[1][0]).toBe(
    "/api/image-proxy?url=https%3A%2F%2Fimages.example%2Fa"
  );
});
it.each([
  "NOT_IMAGE",
  "TOO_LARGE",
  "FETCH_DENIED",
  "INVALID_ADDRESS",
  "TIMEOUT",
])("只使用代理错误码 %s", async (code) => {
  fetcher.mockRejectedValueOnce(new TypeError("unknown"));
  fetcher.mockResolvedValueOnce(
    Response.json({ error: code }, { status: 400 })
  );
  await expect(fetchRemoteImage("https://images.example/a")).rejects.toThrow(
    code
  );
});
it("流开始后超限不返回部分图片", async () => {
  fetcher.mockRejectedValueOnce(new TypeError("unknown"));
  fetcher.mockResolvedValueOnce(
    new Response('{"chunk":"AQID"}\n{"error":"TOO_LARGE"}\n')
  );
  await expect(fetchRemoteImage("https://images.example/a")).rejects.toThrow(
    "TOO_LARGE"
  );
});
it("缺少完成标记的截断流不能入库", async () => {
  fetcher.mockRejectedValueOnce(new TypeError("unknown"));
  fetcher.mockResolvedValueOnce(new Response('{"chunk":"AQID"}\n'));
  await expect(fetchRemoteImage("https://images.example/a")).rejects.toThrow(
    "FETCH_DENIED"
  );
});

it.each([
  ["<svg xmlns='http://www.w3.org/2000/svg'/>", "image/svg+xml"],
  ["<html>not pixels</html>", "image/png"],
])("直连伪图片不可入库 %s", async (body, type) => {
  fetcher.mockResolvedValueOnce(
    new Response(body, { headers: { "content-type": type } })
  );
  fetcher.mockResolvedValueOnce(
    Response.json({ error: "NOT_IMAGE" }, { status: 415 })
  );
  await expect(fetchRemoteImage("https://images.example/a")).rejects.toThrow(
    "NOT_IMAGE"
  );
});

it.each([
  "not json\n",
  "null\n",
  '{"chunk":"AQID"}\n{"done":true,"type":"image/png"}\n{"chunk":"BA=="}\n',
  '{"done":true,"type":"image/png"}\n',
])("无效协议流不能入库 %s", async (body) => {
  fetcher.mockRejectedValueOnce(new TypeError("network"));
  fetcher.mockResolvedValueOnce(new Response(body));
  await expect(fetchRemoteImage("https://images.example/a")).rejects.toThrow(
    "FETCH_DENIED"
  );
});

it("同源拒绝码传到客户端", async () => {
  fetcher.mockRejectedValueOnce(new TypeError("network"));
  fetcher.mockResolvedValueOnce(
    Response.json({ error: "FORBIDDEN_ORIGIN" }, { status: 403 })
  );
  await expect(fetchRemoteImage("https://images.example/a")).rejects.toThrow(
    "FORBIDDEN_ORIGIN"
  );
});
