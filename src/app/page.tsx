import { DownloadButtons } from "@/components/download-buttons";
import { OttoOrbit } from "@/components/otto-orbit";
import { WalkingCrowd } from "@/components/walking-crowd";
import { hero, models, notify, site } from "@/lib/content";

/**
 * 整站就一屏：外壳锁死 100svh 且 overflow-hidden，中间那段吃掉剩余高度。
 * 内容宁可被裁也不许长出滚动条 —— 所以每一块都是 shrink-0，只有 <main> 会伸缩。
 *
 * Hero 分两栏：最左边是开瓢的 Otto 头（大模型 logo 绕着碗口转），右边是文案。
 * 窄屏退化成上下叠放，头居中。
 */
export default function Home() {
  return (
    <div className="grain relative flex h-[100svh] flex-col overflow-hidden">
      <SiteHeader />

      <main className="flex min-h-0 flex-1 flex-col justify-center overflow-hidden">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-y-6 px-6 lg:flex-row lg:items-center lg:gap-x-10">
          <div className="flex shrink-0 flex-col items-center gap-3">
            <OttoOrbit />
            <p className="font-mono text-[11px] tracking-[0.16em] text-ink-faint">
              {models.caption}
            </p>
          </div>

          <div className="min-w-0">
            <p className="flex items-center gap-2.5 font-mono text-[11px] tracking-[0.18em] text-ink-soft uppercase sm:text-[12px]">
              <span className="inline-block size-1.5 bg-brand" aria-hidden />
              {hero.eyebrow}
            </p>

            <h1 className="mt-[clamp(0.75rem,2.5vh,1.5rem)] text-[clamp(2.1rem,min(5.4vw,9vh),4.5rem)] leading-[0.98] font-semibold tracking-[-0.045em]">
              {hero.headline[0]}
              <br />
              <span className="text-ink-soft">{hero.headline[1]}</span>
            </h1>

            <p className="mt-[clamp(1rem,3vh,1.5rem)] hidden max-w-xl text-[15px] leading-[1.7] text-ink-soft [@media(min-height:640px)]:block sm:text-[16px]">
              {hero.subhead}
            </p>

            <div className="mt-[clamp(1.25rem,4vh,2rem)] flex flex-wrap items-center gap-x-7 gap-y-4">
              <DownloadButtons />
              <a href={notify.href} className="underline-grow text-[14px] text-ink-soft hover:text-ink">
                {notify.label} →
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* 街面：小人在这条地平线上来回走，线本身就是屏幕的下边界。 */}
      <div className="relative shrink-0">
        <p className="mx-auto max-w-6xl px-6 pb-2 font-mono text-[11px] tracking-[0.16em] text-ink-faint uppercase">
          {hero.crowdCaption}
        </p>
        <WalkingCrowd />
        <div className="h-px w-full bg-[var(--ground)]" />
      </div>
    </div>
  );
}

function SiteHeader() {
  return (
    <header className="shrink-0 border-b border-line">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6 sm:h-16">
        <span className="font-mono text-[13px] font-medium tracking-[0.22em]">{site.wordmark}</span>
        <span className="font-mono text-[11px] tracking-[0.18em] text-ink-faint uppercase">
          {site.tagline}
        </span>
      </div>
    </header>
  );
}
