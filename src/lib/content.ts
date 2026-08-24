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
  eyebrow: "私测中 · 安装包即将开放",
  headline: ["活给 Otto，", "人去打牌。"],
  subhead:
    "你去打牌，Otto 在你自己机器上干活：读文件、跑 bash、搜网页。每一步都记进日志，危险的那几步它不敢动，等你回来点头。",
  crowdCaption: "人去打牌，Otto 先生在干活。",
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
 * 安装口。href 为空 = 该平台还没有产物，按"即将开放"渲染；
 * 有了安装包把链接填进来就自动变成可点的下载按钮，版式不用动。
 */
export const downloads = {
  items: [
    {
      os: "macOS",
      icon: "apple",
      note: "Apple Silicon · .dmg",
      href: "https://github.com/real-stanyan/Mr-Otto/releases/download/v1.0.3/Mr.Otto-1.0.3-arm64.dmg",
    },
    {
      os: "Windows",
      icon: "windows",
      note: "Windows 10 及以上 · x64 · .exe",
      href: "https://github.com/real-stanyan/Mr-Otto/releases/download/v1.0.3/Mr.Otto-1.0.3-win-x64-setup.exe",
    },
  ],
  pending: "即将开放",
  /** 下载密码的 SHA-256（减速带：产物在公开 GitHub Release 上，直链可绕过）。
      换密码：printf '<新密码>' | shasum -a 256 */
  passwordHash: "02e475e7634ce7248bcb149ede47e21ff0e4babd8d9a24d9388ee837607edadf",
} as const;

/** 没有后端，先用一封预填好的邮件顶着。接上表单服务时换掉 href 即可。 */
export const notify = {
  label: "发布时通知我",
  href:
    "mailto:hi@mrotto.app?subject=" +
    encodeURIComponent("Mr. Otto 发布通知") +
    "&body=" +
    encodeURIComponent("想要的平台（macOS / Windows）："),
} as const;
