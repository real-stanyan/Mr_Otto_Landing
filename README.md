# Mr. Otto — Landing

[Mr. Otto](https://github.com/) 的落地页：Next.js 16 (App Router) + Tailwind v4 + GSAP。

签名效果是页面上来回走动的像素小人（仿 mirofish.ai）。

**整站只有一屏。** `html/body` 是 `overflow: hidden`，外壳锁 `100svh`，两个方向都没有滚动条。
所以文案有长度预算（标题两行 / 正文两句 / feature 一句），写长了会被裁掉而不是撑出滚动条。
版式跟着视口高度伸缩：logo、行距、标题字号都是 `vh` 参与的 `clamp()`；副标题要 `min-height: 700px` 才出现。

## 跑起来

```bash
npm install
npm run dev
```

## 结构

| 路径 | 作用 |
|---|---|
| `src/lib/content.ts` | 全站文案的唯一来源，改文案只动这一个文件 |
| `src/app/page.tsx` | 各区块的组装（server component） |
| `src/components/walking-crowd.tsx` | 走动小人，GSAP 驱动 |
| `src/app/globals.css` | 颜色令牌、缓动令牌、像素渲染、小人尺寸 |
| `src/components/download-buttons.tsx` | macOS / Windows 安装口 |
| `scripts/build-sprites.mjs` | 原始 PNG → 裁边 + 归一化 + 无损 webp |
| `scripts/build-icons.mjs` | app 图标 → 站点 favicon / OG 尺寸 |
| `src/lib/sprites.json` | 由上面脚本生成的素材清单，组件直接读 |

## 素材

`public/sprites/left/*.webp` 向左走，`public/sprites/right/*.webp` 向右走。
换素材时把新的 PNG 目录喂给脚本重跑，下游代码不用动：

```bash
npm run sprites -- /path/to/left /path/to/right
```

脚本会按透明边界裁剪（保证脚底对齐）、最近邻缩放到高 400px（页面最大显示 260px，仍在 1x 以内），
输出无损 webp，并重写 `src/lib/sprites.json`。

## 走动小人是怎么实现的

- 一个 walker = 一个绝对定位的 `<img>`，GSAP 只动 `transform`。
- 每走完一趟重新随机方向、景深、速度、素材；方向决定用 left 还是 right 那套图。
- 景深（0 = 最近，1 = 最远）同时决定缩放、垂直偏移、速度和虚焦（`blur(depth² × 6px)`，近处那半批完全锐利），
  形成视差 —— 素材本身不做半透明。
- 上下小幅 bob + 轻微旋转模拟步频，频率跟着速度走。
- 悬停（仅指针设备）会让那个小人停下来、轻轻一跳，移开继续走。
- `prefers-reduced-motion: reduce` 时人群照样在，只是不动。

## 安装口

`src/lib/content.ts` 的 `downloads.items`：`href` 为空 = 该平台还没有产物，按"即将开放"渲染；
填上安装包链接就自动变成可点的下载按钮，版式不用动。

```ts
{ os: "macOS", icon: "apple", note: "Apple Silicon / Intel · .dmg", href: "https://…/Mr.Otto.dmg" }
```

## 图标

站点图标来自 app 本体的 `~/Github/Mr_Otto/resources/icon.png`：

```bash
node scripts/build-icons.mjs [/path/to/icon.png]
```

输出 `src/app/icon.png`（favicon）、`src/app/apple-icon.png`、`public/icon-192.png`、`public/icon-512.png`。

## 待接的东西

- 「发布时通知我」目前是 `content.ts` 里的 `notify.href`，一条 `mailto:`。
  接 Supabase / Formspree 时换掉这个链接即可 —— 一屏放不下表单，别塞回来。
- `downloads.items[].href` 还是空的，安装包出来了填进去就上线。
