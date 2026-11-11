/** 每个内置主题的底色与强调色，只用于示意，不参与渲染 */
const swatches = [
  { accent: "#2c3f6e", background: "#eff2f7" },
  { accent: "#1d1d1f", background: "#fbfbfb" },
  { accent: "#2c5aad", background: "#edf2fa" },
  { accent: "#8fe3c8", background: "#1c2230" },
  { accent: "#b32259", background: "#fff0f3" },
  { accent: "#5a4636", background: "#f1ebdd" },
  { accent: "#ffd75e", background: "#2f333c" },
  { accent: "#92530c", background: "#fff0dc" },
];

/** 示意图：8 个主题的小卡片 */
export const HomeIntroThemeFigure = () => (
  <div aria-hidden="true" className="grid grid-cols-4 gap-2">
    {swatches.map(({ accent, background }) => (
      <div
        className="flex aspect-[3/4] w-10 flex-col rounded-[6px] p-1.5 shadow-[var(--ds-sh-tile)]"
        key={background}
        style={{ background }}
      >
        <div
          className="h-[4px] w-3/4 rounded-full"
          style={{ background: accent }}
        />
        <div className="mt-1.5 space-y-1 opacity-30">
          <div
            className="h-[3px] w-full rounded-full"
            style={{ background: accent }}
          />
          <div
            className="h-[3px] w-2/3 rounded-full"
            style={{ background: accent }}
          />
        </div>
      </div>
    ))}
  </div>
);
