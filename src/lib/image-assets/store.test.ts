import { expect, it } from "vitest";
import { createMemoryImageStore } from "./store";

const shortIdPattern = /^[a-z0-9]{10}$/;

it("资产库可存入、读取、列出、删除 Blob，读取缺失资产返回 null", async () => {
  const store = createMemoryImageStore();
  const blob = new Blob(["pixels"], { type: "image/png" });
  const id = await store.put(blob);
  expect(id).toMatch(shortIdPattern);
  expect(await (await store.get(id))?.text()).toBe("pixels");
  expect((await store.get(id))?.type).toBe("image/png");
  expect(await store.list()).toEqual([id]);
  await store.delete(id);
  await store.delete(id);
  expect(await store.get(id)).toBeNull();
  expect(await store.list()).toEqual([]);
});
