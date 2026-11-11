export const XIAO_HONG_SHU_LINK =
  "https://www.xiaohongshu.com/user/profile/67b605b3000000000a03f08d";
export const TWITTER_HANDLE = "simon_wong";
export const TWITTER_LINK = `https://x.com/${TWITTER_HANDLE}`;
export const GITHUB_LINK = "https://github.com/simonwong";
export const PERSONAL_SITE_LINK = "https://simonw.dev/";
export const MOONUNDER_LINK = "https://moonunder.app/";
export const REPOSITORY_LINK = "https://github.com/simonwong/redbook-text2img";

/**
 * 作者的其他作品，关于页列表和结构化数据共用。
 * name 是产品名，进结构化数据；linkText 是关于页的锚文本，带上品类词，让搜索引擎看懂链接指向什么。
 */
export const OTHER_WORKS = [
  {
    description: "iOS App，听着雨声专注或入睡",
    linkText: "Rainside 听雨白噪音",
    name: "Rainside 听雨",
    url: "https://rainside.moonunder.app/",
  },
  {
    description: "macOS 原生语音转文字 App",
    linkText: "Speaker 语音转文字",
    name: "Speaker",
    url: "https://speaker.moonunder.app/",
  },
  {
    description: "日常在线小工具集合",
    linkText: "VectoBox 在线工具站",
    name: "VectoBox",
    url: "https://vectobox.com/",
  },
] as const;
