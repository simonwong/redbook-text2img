const padPage = (n: number) => String(n).padStart(2, "0");

interface CardWatermarkProps {
  /** 页码（封面或用户关闭页码时不传） */
  pageNumber?: { current: number; total: number };
  signature: string;
  /** 主题派生的颜色 token */
  style: React.CSSProperties;
}

/** 卡片底部水印：署名靠左、页码靠右（随 PNG 一同导出），两者皆空则不渲染 */
export const CardWatermark: React.FC<CardWatermarkProps> = ({
  pageNumber,
  signature,
  style,
}) => {
  const pageLabel = pageNumber
    ? `${padPage(pageNumber.current)} / ${padPage(pageNumber.total)}`
    : "";
  if (signature === "" && pageLabel === "") {
    return null;
  }
  return (
    <div
      style={{
        flexShrink: 0,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: "0.65em",
        letterSpacing: "0.04em",
        paddingTop: "0.8em",
        ...style,
      }}
    >
      <span>{signature}</span>
      <span>{pageLabel}</span>
    </div>
  );
};
