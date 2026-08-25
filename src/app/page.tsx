import Dither from "@/components/dither-background";
import { DownloadButtons } from "@/components/download-buttons";
import { OttoOrbit } from "@/components/otto-orbit";
import { hero, models, notify } from "@/lib/content";

/**
 * 分屏一屏：左边深色 Dither 波纹 + 脑壳开瓢头像，右边白色背景 + 文案下载。
 * 整页锁死 100svh，两个方向都不许滚动。
 *
 * 移动端上下分屏（上头像下内容），桌面端左右分屏（左头像右内容）。
 * 右边白色区盖住底下的波纹，内部文字用 .theme-light 那套浅色 token。
 */
export default function Home() {
  return (
    <div className="relative flex h-[100svh] flex-col overflow-hidden bg-[#0a0a0b] text-ink">
      {/* 全屏 dither 波纹背景（深色），只有左边露出来 */}
      <div className="absolute inset-0" aria-hidden>
        <Dither />
      </div>

      <main className="relative z-10 flex h-full flex-col lg:flex-row">
        {/* 左：深色波纹 + 头像 */}
        <section className="flex h-[44%] shrink-0 flex-col items-center justify-center gap-3 lg:h-full lg:w-[50vw]">
          <OttoOrbit />
          <p className="font-mono text-[11px] tracking-[0.16em] text-ink-faint">
            {models.caption}
          </p>
        </section>

        {/* 右：白色背景盖住波纹 + 内容 */}
        <section className="theme-light flex h-[56%] items-center bg-white lg:h-full lg:w-[50vw]">
          <div className="w-full max-w-xl px-7 lg:px-14">
            <p className="flex items-center gap-2.5 font-mono text-[11px] tracking-[0.18em] text-ink-soft uppercase sm:text-[12px]">
              <span className="inline-block size-1.5 bg-brand" aria-hidden />
              {hero.eyebrow}
            </p>

            <h1 className="mt-[clamp(0.75rem,2.5vh,1.5rem)] text-[clamp(2rem,min(4.4vw,8.5vh),4rem)] leading-[0.98] font-semibold tracking-[-0.045em]">
              {hero.headline[0]}
              <br />
              <span className="text-ink-soft">{hero.headline[1]}</span>
            </h1>

            <p className="mt-[clamp(1rem,3vh,1.5rem)] hidden max-w-xl text-[15px] leading-[1.7] text-ink-soft [@media(min-height:640px)]:block sm:text-[16px]">
              {hero.subhead}
            </p>

            <div className="mt-[clamp(1.25rem,4vh,2rem)] flex flex-wrap items-center gap-x-7 gap-y-4">
              <DownloadButtons />
              <a
                href={notify.href}
                className="underline-grow text-[14px] text-ink-soft hover:text-ink"
              >
                {notify.label} →
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
