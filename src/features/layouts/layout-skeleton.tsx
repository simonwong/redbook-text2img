/**
 * 水合前的占位：布局模式要读到视口宽度才能确定，这段时间用 CSS 断点画出同样的分栏，
 * 首屏不再是空白，水合后面板原位替换、不跳动。
 */
export const LayoutSkeleton = () => (
  <div aria-hidden="true" className="flex h-full min-h-0 gap-3">
    <div className="ds-panel h-full min-h-0 flex-1 md:min-w-[400px] md:max-w-[640px] md:basis-[400px]" />
    <div className="ds-frame hidden h-full min-h-0 min-w-0 flex-1 basis-[427px] md:flex">
      <div className="ds-pane" />
    </div>
  </div>
);
