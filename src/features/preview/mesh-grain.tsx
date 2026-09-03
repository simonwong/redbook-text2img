/** mesh 材质上的颗粒层：内联 SVG 噪点，绝对定位铺满，不进入导出节点 */
export const MeshGrain = () => (
  <svg
    aria-hidden="true"
    className="ds-grain"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>背景颗粒</title>
    <filter id="preview-mesh-grain">
      <feTurbulence
        baseFrequency="0.85"
        numOctaves="2"
        stitchTiles="stitch"
        type="fractalNoise"
      />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect filter="url(#preview-mesh-grain)" height="100%" width="100%" />
  </svg>
);
