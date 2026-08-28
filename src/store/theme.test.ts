import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

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
    stores.useContentThemeStore.getState().setDensity("compact");

    expect(JSON.parse(storage.getItem("redbook-content-theme") ?? "")).toEqual({
      state: {
        currentThemeId: "clean-light",
        overrides: { density: "compact" },
      },
      version: 6,
    });
  });

  it("通过 store 持久化背景覆盖", () => {
    const themeStore = stores.useContentThemeStore.getState();
    themeStore.setBackground({ color: "#111827", kind: "solid" });

    expect(JSON.parse(storage.getItem("redbook-content-theme") ?? "")).toEqual({
      state: {
        currentThemeId: "clean-light",
        overrides: {
          background: { color: "#111827", kind: "solid" },
        },
      },
      version: 6,
    });
  });

  it("通过 store 撤销主题切换", () => {
    const themeStore = stores.useContentThemeStore;
    themeStore.getState().setDensity("compact");
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
      overrides: {
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

  it("刷新时把 v5 等宽字体迁移为无衬线", async () => {
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

    expect(reloadedStores.useContentThemeStore.getState().overrides).toEqual(
      {}
    );
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
