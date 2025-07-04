'use client';

interface SEOOptimizedTextProps {
  className?: string;
}

export const SEOOptimizedText: React.FC<SEOOptimizedTextProps> = ({
  className,
}) => {
  return (
    <>
      {/* 隐藏的标题和描述，为SEO和屏幕阅读器提供页面上下文 */}
      <div className="sr-only">
        <h1>小红书图片生成器 - Markdown 转图片工具</h1>
        <p>
          将 Markdown
          文本快速转换为精美的小红书风格图片，支持多种样式，一键导出下载。
          免费在线工具，无需注册，支持实时预览和批量导出。
        </p>
      </div>
      <div className={`sr-only ${className || ''}`}>
        {/* 关键词丰富的内容，为SEO和屏幕阅读器提供更多上下文 */}
        <h2>功能特色</h2>
        <ul>
          <li>Markdown 文本转换为精美图片</li>
          <li>小红书风格的图片设计</li>
          <li>多种预设样式模板选择</li>
          <li>自定义字体大小和颜色</li>
          <li>支持实时预览编辑效果</li>
          <li>一键导出高质量 PNG 图片</li>
          <li>支持批量导出多张图片</li>
          <li>无需注册，完全免费使用</li>
        </ul>

        <h2>适用场景</h2>
        <ul>
          <li>小红书笔记配图制作</li>
          <li>社交媒体内容创作</li>
          <li>微信朋友圈图片分享</li>
          <li>微博图片文字设计</li>
          <li>Instagram 故事配图</li>
          <li>营销海报文字设计</li>
          <li>教程说明图片制作</li>
          <li>产品介绍图片生成</li>
        </ul>

        <h2>技术特点</h2>
        <ul>
          <li>基于 Next.js 15 开发</li>
          <li>支持完整 Markdown 语法</li>
          <li>响应式设计，适配移动端</li>
          <li>纯前端实现，数据安全</li>
          <li>快速加载，流畅体验</li>
          <li>现代化的用户界面设计</li>
        </ul>

        <h2>关键词</h2>
        <p>
          小红书图片生成器, Markdown转图片, 文字转图片工具, 社交媒体配图,
          小红书笔记制作, 图片文字设计, 在线图片制作工具, 免费图片生成器,
          内容创作工具, 营销图片制作, 朋友圈配图, 微博图片设计
        </p>
      </div>
    </>
  );
};
