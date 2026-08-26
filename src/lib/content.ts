/**
 * 全站文案集中在这里，改文案不用碰版式。
 * 事实来源：~/Github/Mr_Otto 的 AGENTS.md / CONTEXT.md / docs/adr/*。
 *
 * 页面是死板的一屏（100vh，不滚动），所以每条文案都有长度预算：
 * 标题两行、正文两句、feature 一句。写长了会被裁掉而不是撑出滚动条。
 */

export const site = {
  name: "Mr. Otto",
  wordmark: "MR. OTTO",
  tagline: "桌面 GUI Agent",
  description:
    "Mr. Otto 是跑在你自己机器上的桌面 agent。读写文件、跑 bash、上网查资料，每一步先落盘、危险操作先问你。",
} as const;

export const hero = {
  eyebrow: "公测开放 · 两个平台都可以装",
  headline: ["活给 Otto，", "脑子随便换。"],
  subhead:
    "Otto 在你自己机器上干活：读文件、跑 bash、搜网页，每一步都记进日志，危险的那几步先等你回来点头。OpenAI、Claude、DeepSeek、Qwen……想用哪个模型，随你换。",
} as const;

/**
 * 脑壳开瓢：绕着 Otto 头顶转的大模型 logo。
 * 素材在 public/logos/（simpleicons / svgl 的单色 SVG），页面上用 mask
 * 染成墨色，所以换 logo 只要放一个新 SVG 进来再加一行。
 */
type ModelLogo = { name: string; src: string; disc?: boolean };

export const models: { caption: string; items: ModelLogo[] } = {
  caption: "脑壳开瓢，脑子随便换。",
  items: [
    { name: "OpenAI", src: "/logos/openai.svg", disc: true },
    { name: "Claude", src: "/logos/claude.svg" },
    { name: "Gemini", src: "/logos/googlegemini.svg" },
    { name: "DeepSeek", src: "/logos/deepseek.svg" },
    { name: "Qwen", src: "/logos/qwen.svg" },
    { name: "Meta", src: "/logos/meta.svg" },
    { name: "Mistral", src: "/logos/mistralai.svg" },
    { name: "Ollama", src: "/logos/ollama.svg", disc: true },
  ],
};

/**
 * 安装口。版本号是单一事实源：`version` 一改，两个下载链接和页脚版本行一起跟着走。
 * href 为空 = 该平台还没有产物，按"即将开放"渲染。
 */
const version = "1.0.8";
const releaseBase = `https://github.com/real-stanyan/Mr-Otto/releases`;

export const downloads = {
  version,
  /** 版本行点进去是这一版的 release notes。 */
  releaseUrl: `${releaseBase}/tag/v${version}`,
  releasedOn: "2026-08-26",
  items: [
    {
      os: "macOS",
      icon: "apple",
      note: "Apple Silicon · .dmg",
      href: `${releaseBase}/download/v${version}/Mr.Otto-${version}-arm64.dmg`,
    },
    {
      os: "Windows",
      icon: "windows",
      note: "Windows 10 及以上 · x64 · .exe",
      href: `${releaseBase}/download/v${version}/Mr.Otto-${version}-win-x64-setup.exe`,
    },
  ],
  pending: "即将开放",
} as const;

/** 没有后端，先用一封预填好的邮件顶着。接上表单服务时换掉 href 即可。 */
