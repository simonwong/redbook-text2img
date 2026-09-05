import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { estimatePersistedSize, maxPersistedSize } from "./persist-size";

class MemoryStorage implements Storage {
  readonly #items = new Map<string, string>();

  get length(): number {
    return this.#items.size;
  }

  clear(): void {
    this.#items.clear();
  }

  getItem(key: string): string | null {
    return this.#items.get(key) ?? null;
  }

  key(index: number): string | null {
    return [...this.#items.keys()][index] ?? null;
  }

  removeItem(key: string): void {
    this.#items.delete(key);
  }

  setItem(key: string, value: string): void {
    this.#items.set(key, value);
  }
}

const storage = new MemoryStorage();
let stores: typeof import("./theme");

beforeAll(async () => {
  vi.stubGlobal("window", { localStorage: storage });
  stores = await import("./theme");
});

beforeEach(() => {
  storage.clear();
  stores.useContentThemeStore.setState({
    currentThemeId: "clean-light",
    customThemes: [],
    overrides: {},
    previousSelection: undefined,
  });
  stores.useWatermarkStore.setState({
    showPageNumber: true,
    signature: "",
  });
});

describe("content theme store", () => {
  it("只持久化主题标识和稀疏覆盖", () => {
    stores.useContentThemeStore
      .getState()
      .updateConfiguration({ density: "compact" });

    expect(JSON.parse(storage.getItem("redbook-content-theme") ?? "")).toEqual({
      state: {
        currentThemeId: "clean-light",
        customThemes: [],
        overrides: { density: "compact" },
      },
      version: 6,
    });
  });

  it("通过 store 持久化背景覆盖", () => {
    const themeStore = stores.useContentThemeStore.getState();
    themeStore.updateConfiguration({
      background: { color: "#111827", kind: "solid" },
    });

    expect(JSON.parse(storage.getItem("redbook-content-theme") ?? "")).toEqual({
      state: {
        currentThemeId: "clean-light",
        customThemes: [],
        overrides: {
          background: { color: "#111827", kind: "solid" },
        },
      },
      version: 6,
    });
  });

  it("通过 store 撤销主题切换", () => {
    const themeStore = stores.useContentThemeStore;
    themeStore.getState().updateConfiguration({ density: "compact" });
    themeStore.getState().selectPresetTheme("reading-mode");
    themeStore.getState().undoThemeSelection();

    expect({
      currentThemeId: themeStore.getState().currentThemeId,
      overrides: themeStore.getState().overrides,
      previousSelection: themeStore.getState().previousSelection,
    }).toEqual({
      currentThemeId: "clean-light",
      overrides: { density: "compact" },
      previousSelection: undefined,
    });
  });

  it("刷新时迁移 v2 稀疏状态", async () => {
    storage.setItem(
      "redbook-content-theme",
      JSON.stringify({
        state: {
          currentThemeId: "clean-light",
          overrides: {
            accentColor: "#e64f7a",
            density: "compact",
            headingAlignment: "left",
          },
        },
        version: 2,
      })
    );
    vi.resetModules();

    const reloadedStores = await import("./theme");
    const state = reloadedStores.useContentThemeStore.getState();

    expect({
      currentThemeId: state.currentThemeId,
      overrides: state.overrides,
    }).toEqual({
      currentThemeId: "clean-light",
      // 强调色重新成为配置字段，v2 里存过的合法色值直接生效
      overrides: {
        accentColor: "#e64f7a",
        bodyHeadingAlignment: "left",
        density: "compact",
      },
    });
  });

  it("刷新时迁移 v1 完整配置", async () => {
    storage.setItem(
      "redbook-content-theme",
      JSON.stringify({
        state: {
          configuration: {
            density: "compact",
            fontId: "auto",
            headingAlignment: "left",
            headingDecoration: "none",
          },
          currentThemeId: "reading-mode",
        },
        version: 1,
      })
    );
    vi.resetModules();

    const reloadedStores = await import("./theme");
    const state = reloadedStores.useContentThemeStore.getState();

    expect({
      currentThemeId: state.currentThemeId,
      overrides: state.overrides,
    }).toEqual({
      currentThemeId: "reading-mode",
      overrides: { density: "compact" },
    });
  });

  it("刷新时保留五档密度并迁移旧字体", async () => {
    storage.setItem(
      "redbook-content-theme",
      JSON.stringify({
        state: {
          currentThemeId: "clean-light",
          overrides: { density: "snug", fontId: "rounded" },
        },
        version: 4,
      })
    );
    vi.resetModules();

    const reloadedStores = await import("./theme");

    expect(reloadedStores.useContentThemeStore.getState().overrides).toEqual({
      density: "snug",
    });
  });

  it("刷新时把旧三档密度迁移为像素等价的新档", async () => {
    storage.setItem(
      "redbook-content-theme",
      JSON.stringify({
        state: {
          currentThemeId: "reading-mode",
          overrides: { density: "balanced" },
        },
        version: 6,
      })
    );
    vi.resetModules();

    const reloadedStores = await import("./theme");

    // reading-mode 默认密度即 normal，迁移后不残留覆盖
    expect(reloadedStores.useContentThemeStore.getState().overrides).toEqual(
      {}
    );
  });

  it("刷新时让 v5 等宽字体直接生效", async () => {
    storage.setItem(
      "redbook-content-theme",
      JSON.stringify({
        state: {
          currentThemeId: "clean-light",
          overrides: { fontId: "mono" },
        },
        version: 5,
      })
    );
    vi.resetModules();

    const reloadedStores = await import("./theme");

    expect(reloadedStores.useContentThemeStore.getState().overrides).toEqual({
      fontId: "mono",
    });
  });

  it("刷新时丢弃已移除的正文标题大小覆盖并保留其他字段", async () => {
    storage.setItem(
      "redbook-content-theme",
      JSON.stringify({
        state: {
          currentThemeId: "clean-light",
          overrides: { bodyHeadingSize: "large", density: "compact" },
        },
        version: 6,
      })
    );
    vi.resetModules();

    const reloadedStores = await import("./theme");

    expect(reloadedStores.useContentThemeStore.getState().overrides).toEqual({
      density: "compact",
    });
  });

  it("刷新时丢弃已移除的内容底板覆盖并保留其他字段", async () => {
    storage.setItem(
      "redbook-content-theme",
      JSON.stringify({
        state: {
          currentThemeId: "clean-light",
          overrides: { contentSurface: "notebook", density: "compact" },
        },
        version: 6,
      })
    );
    vi.resetModules();

    const reloadedStores = await import("./theme");

    expect(reloadedStores.useContentThemeStore.getState().overrides).toEqual({
      density: "compact",
    });
  });

  it("保存自定义主题后持久化并切换到它", () => {
    const themeStore = stores.useContentThemeStore;
    themeStore.getState().updateConfiguration({ density: "compact" });

    expect(themeStore.getState().saveCustomTheme("我的主题 1")).toEqual({
      ok: true,
    });

    const persisted = JSON.parse(
      storage.getItem("redbook-content-theme") ?? ""
    );
    expect(persisted.state.currentThemeId).toBe(
      persisted.state.customThemes[0].id
    );
    expect(persisted.state.customThemes[0]).toMatchObject({
      configuration: { density: "compact" },
      name: "我的主题 1",
    });
    expect(persisted.state.overrides).toEqual({});
  });

  it("刷新后仍然选中保存的自定义主题", async () => {
    const themeStore = stores.useContentThemeStore;
    themeStore.getState().updateConfiguration({ density: "compact" });
    themeStore.getState().saveCustomTheme("我的主题 1");
    vi.resetModules();

    const reloadedStores = await import("./theme");
    const state = reloadedStores.useContentThemeStore.getState();

    expect(state.customThemes).toHaveLength(1);
    expect(state.currentThemeId).toBe(state.customThemes[0].id);
    expect(state.overrides).toEqual({});
  });

  it("达到上限时拒绝保存", () => {
    const themeStore = stores.useContentThemeStore;
    for (let index = 0; index < 8; index += 1) {
      expect(themeStore.getState().saveCustomTheme(`主题 ${index}`)).toEqual({
        ok: true,
      });
    }

    expect(themeStore.getState().saveCustomTheme("第九个")).toEqual({
      ok: false,
      reason: "limit",
    });
    expect(themeStore.getState().customThemes).toHaveLength(8);
  });

  it("持久化体积超限时拒绝保存且不写入", () => {
    const themeStore = stores.useContentThemeStore;
    const dataUrl = `data:image/jpeg;base64,${"a".repeat(3_900_000)}`;
    themeStore.getState().updateConfiguration({
      background: { dataUrl, frost: "none", kind: "image", tone: "light" },
    });
    expect(themeStore.getState().saveCustomTheme("大图一")).toEqual({
      ok: true,
    });

    expect(themeStore.getState().saveCustomTheme("大图二")).toEqual({
      ok: false,
      reason: "quota",
    });
    expect(themeStore.getState().customThemes).toHaveLength(1);
  });

  it("更新与删除自定义主题", () => {
    const themeStore = stores.useContentThemeStore;
    themeStore.getState().saveCustomTheme("我的主题 1");
    const themeId = themeStore.getState().currentThemeId;

    themeStore.getState().updateConfiguration({ density: "spacious" });
    themeStore.getState().updateCustomTheme();

    expect(themeStore.getState().overrides).toEqual({});
    expect(themeStore.getState().customThemes[0].configuration).toMatchObject({
      density: "spacious",
    });

    themeStore.getState().deleteCustomTheme(themeId);

    expect({
      currentThemeId: themeStore.getState().currentThemeId,
      customThemes: themeStore.getState().customThemes,
    }).toEqual({ currentThemeId: "clean-light", customThemes: [] });
  });

  it("估算持久化体积只算持久化的三个字段", () => {
    const state = {
      currentThemeId: "clean-light",
      customThemes: [],
      overrides: {},
      previousSelection: {
        currentThemeId: "reading-mode",
        overrides: { density: "compact" as const },
      },
    };

    expect(estimatePersistedSize(state)).toBe(
      JSON.stringify({
        currentThemeId: "clean-light",
        customThemes: [],
        overrides: {},
      }).length
    );
    expect(estimatePersistedSize(state)).toBeLessThan(maxPersistedSize);
  });

  it("主题切换和重置不修改卡片标记", () => {
    const watermarkStore = stores.useWatermarkStore;
    watermarkStore.getState().setSignature("@simon");
    watermarkStore.getState().setShowPageNumber(false);

    stores.useContentThemeStore.getState().selectPresetTheme("reading-mode");
    stores.useContentThemeStore.getState().resetConfiguration();

    expect({
      showPageNumber: watermarkStore.getState().showPageNumber,
      signature: watermarkStore.getState().signature,
    }).toEqual({ showPageNumber: false, signature: "@simon" });
  });
});
