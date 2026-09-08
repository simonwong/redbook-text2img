import { expect, type Page, test } from "@playwright/test";

async function open(page: Page) {
  await page.addInitScript(() =>
    localStorage.setItem(
      "redbook-markdown-content",
      JSON.stringify({
        state: { content: "第一行\n\n末尾", isChange: true },
        version: 0,
      })
    )
  );
  await page.goto("/");
  await expect(page.locator(".cm-content")).toBeVisible();
}
async function transfer(
  page: Page,
  transferKind: "paste" | "drop",
  isImage = true
) {
  const position = await page.locator(".cm-line").first().boundingBox();
  if (!position) {
    throw new Error("Missing editor line");
  }
  return page.locator(".cm-content").evaluate(
    async (element, { kind, image, x, y }) => {
      const data = new DataTransfer();
      let file: File;
      if (image) {
        const canvas = document.createElement("canvas");
        canvas.width = 32;
        canvas.height = 16;
        const context = canvas.getContext("2d");
        if (!context) {
          throw new Error("Canvas unavailable");
        }
        context.fillStyle = "red";
        context.fillRect(0, 0, 32, 16);
        const blob = await new Promise<Blob>((resolve) =>
          canvas.toBlob((value) => {
            if (value) {
              resolve(value);
            }
          })
        );
        file = new File([blob], "paste.png", { type: "image/png" });
      } else {
        file = new File(["文件文本"], "text.txt", { type: "text/plain" });
      }
      data.items.add(file);
      data.setData("text/plain", image ? "不应插入的文本" : "普通粘贴");
      const event =
        kind === "paste"
          ? new ClipboardEvent("paste", {
              bubbles: true,
              cancelable: true,
              clipboardData: data,
            })
          : new DragEvent("drop", {
              bubbles: true,
              cancelable: true,
              clientX: x,
              clientY: y,
              dataTransfer: data,
            });
      element.dispatchEvent(event);
      return event.defaultPrevented;
    },
    {
      image: isImage,
      kind: transferKind,
      x: position.x + 2,
      y: position.y + position.height / 2,
    }
  );
}

for (const kind of ["paste", "drop"] as const) {
  test(`${kind} 图片入库，阻止默认文本插入并一步撤销`, async ({ page }) => {
    await open(page);
    const editor = page.locator(".cm-content");
    await editor.click();
    await page.keyboard.press("ControlOrMeta+End");
    expect(await transfer(page, kind)).toBe(true);
    await expect(editor).toContainText("image:");
    await expect(editor).not.toContainText("不应插入的文本");
    if (kind === "drop") {
      expect((await editor.innerText()).indexOf("image:")).toBeLessThan(
        (await editor.innerText()).indexOf("第一行")
      );
    }
    await expect(page.locator(".img-preview img")).toBeVisible();
    await page.getByRole("button", { exact: true, name: "撤销" }).click();
    await expect(editor).not.toContainText("image:");
    await expect(editor).toContainText("第一行");
  });
}

test("非图片文件沿用默认文本粘贴与拖拽行为", async ({ page }) => {
  await open(page);
  await page.locator(".cm-content").click();
  await transfer(page, "paste", false);
  await expect(page.locator(".cm-content")).toContainText("普通粘贴");
  await transfer(page, "drop", false);
  await expect(page.locator(".cm-content")).toContainText("文件文本");
});

test("链接直连失败后代理导入，错误显示原因且不插入远程引用", async ({
  page,
}) => {
  await open(page);
  await page.route("https://images.example/**", (route) => route.abort());
  await page.route("**/api/image-proxy?*", (route) =>
    route.fulfill({ json: { error: "TOO_LARGE" }, status: 413 })
  );
  await page.getByRole("button", { exact: true, name: "插入图片" }).click();
  await page
    .getByLabel("图片链接", { exact: true })
    .fill("https://images.example/a.png");
  await page.getByRole("button", { exact: true, name: "导入链接" }).click();
  await expect(
    page.getByRole("alert").filter({ hasText: "图片过大" })
  ).toBeVisible();
  await expect(page.locator(".cm-content")).not.toContainText("https:");
  await expect(page.locator(".cm-content")).not.toContainText("image:");
});

for (const mode of ["direct", "proxy"] as const) {
  test(`${mode} 链接入库并预览，移动端复用同一弹层`, async ({ page }) => {
    if (mode === "proxy") {
      await page.setViewportSize({ height: 844, width: 390 });
    }
    await open(page);
    const base64 = await page.evaluate(() => {
      const canvas = document.createElement("canvas");
      canvas.width = 32;
      canvas.height = 16;
      const context = canvas.getContext("2d");
      if (!context) {
        throw new Error("Canvas unavailable");
      }
      context.fillStyle = "#ed2040";
      context.fillRect(0, 0, 32, 16);
      return canvas.toDataURL("image/png").split(",")[1];
    });
    let proxyRequests = 0;
    await page.route("https://images.example/**", (route) => {
      expect(route.request().headers()).not.toHaveProperty("referer");
      return mode === "proxy"
        ? route.abort()
        : route.fulfill({
            body: Buffer.from(base64, "base64"),
            contentType: "image/png",
          });
    });
    await page.route("**/api/image-proxy?*", (route) => {
      proxyRequests += 1;
      return route.fulfill({
        body: `${JSON.stringify({ chunk: base64 })}\n${JSON.stringify({ done: true, type: "image/png" })}\n`,
        contentType: "application/x-ndjson",
      });
    });
    await page.getByRole("button", { exact: true, name: "插入图片" }).click();
    await page
      .getByLabel("图片链接", { exact: true })
      .fill("https://images.example/a.png");
    await page.getByRole("button", { exact: true, name: "导入链接" }).click();
    await expect(page.locator(".cm-content")).toContainText("image:");
    await expect(page.locator(".cm-content")).not.toContainText("https:");
    expect(proxyRequests).toBe(mode === "proxy" ? 1 : 0);
    if (mode === "proxy") {
      await page.getByRole("button", { name: "预览图片" }).click();
    }
    await expect(page.locator(".img-preview img")).toBeVisible();
    expect(
      await page
        .locator(".img-preview img")
        .evaluate((img: HTMLImageElement) => img.naturalWidth)
    ).toBe(32);
  });
}

test("生产代理拒绝跨站调用与本机目标", async ({ request }) => {
  const denied = await request.get("/api/image-proxy?url=http://127.0.0.1/a", {
    headers: { "sec-fetch-site": "cross-site" },
  });
  expect(denied.status()).toBe(403);
  const invalid = await request.get("/api/image-proxy?url=http://127.0.0.1/a", {
    headers: { "sec-fetch-site": "same-origin" },
  });
  expect(invalid.status()).toBe(400);
  expect(await invalid.json()).toEqual({ error: "INVALID_ADDRESS" });
});

test("多文件部分失败仍插入成功项，列出失败文件且一步撤销", async ({ page }) => {
  await open(page);
  await page.locator(".cm-content").evaluate(async (element) => {
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 16;
    const blob = await new Promise<Blob>((resolve) =>
      canvas.toBlob((value) => {
        if (value) {
          resolve(value);
        }
      })
    );
    const data = new DataTransfer();
    data.items.add(new File([blob], "成功一.png", { type: "image/png" }));
    data.items.add(new File(["broken"], "损坏.png", { type: "image/png" }));
    data.items.add(new File([blob], "成功二.png", { type: "image/png" }));
    element.dispatchEvent(
      new ClipboardEvent("paste", {
        bubbles: true,
        cancelable: true,
        clipboardData: data,
      })
    );
  });
  await expect(
    page.getByRole("alert").filter({ hasText: "损坏.png" })
  ).toBeVisible();
  await expect(page.locator(".img-preview img")).toHaveCount(2);
  await page.getByRole("button", { exact: true, name: "撤销" }).click();
  await expect(page.locator(".cm-content")).not.toContainText("image:");
});

test("文件错误在弹层关闭后仍可见，横幅堆叠、可关闭且六秒消失", async ({
  page,
}) => {
  await open(page);
  await page.clock.install();
  await page.getByRole("button", { exact: true, name: "插入图片" }).click();
  await page.getByLabel("选择内容图片", { exact: true }).setInputFiles({
    buffer: Buffer.from("broken"),
    mimeType: "image/png",
    name: "损坏文件.png",
  });
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("alert").filter({ hasText: "损坏文件.png" })
  ).toBeVisible();
  await page.locator(".cm-content").evaluate((element) => {
    const data = new DataTransfer();
    data.items.add(new File(["broken"], "粘贴失败.png", { type: "image/png" }));
    element.dispatchEvent(
      new ClipboardEvent("paste", {
        bubbles: true,
        cancelable: true,
        clipboardData: data,
      })
    );
  });
  const first = page.getByRole("alert").filter({ hasText: "损坏文件.png" });
  const second = page.getByRole("alert").filter({ hasText: "粘贴失败.png" });
  await expect(second).toBeVisible();
  const a = await first.boundingBox();
  const b = await second.boundingBox();
  expect(a && b && b.y >= a.y + a.height).toBe(true);
  await first.getByRole("button", { name: "关闭提示" }).click();
  await expect(first).toHaveCount(0);
  await page.clock.fastForward(6000);
  await expect(second).toHaveCount(0);
});
