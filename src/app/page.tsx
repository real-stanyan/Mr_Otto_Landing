import Dither from "@/components/dither-background";
import { DownloadButtons } from "@/components/download-buttons";
import { OttoOrbit } from "@/components/otto-orbit";
import { hero, notify } from "@/lib/content";

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
        <section className="flex h-[44%] shrink-0 flex-col items-center justify-center gap-3 lg:h-full lg:w-[65vw]">
          <OttoOrbit />
        </section>

        {/* 右：白色背景盖住波纹 + Apple 官网式排版 */}
        <section
          className="theme-light flex h-[56%] items-center bg-white lg:h-full lg:w-[35vw]"
          style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif' }}
        >
          <div className="w-full max-w-md px-7 lg:px-12">

            <h1 className="mt-[clamp(0.75rem,2vh,1.5rem)] text-[clamp(2.25rem,min(4.6vw,9vh),3.5rem)] leading-[1.04] font-bold tracking-[-0.03em] text-[#1d1d1f]">
              {hero.headline[0]}
              <br />
              {hero.headline[1]}
            </h1>

            <p className="mt-[clamp(1.25rem,3.5vh,1.75rem)] hidden max-w-[34ch] text-[17px] leading-[1.65] text-[#6e6e73] [@media(min-height:640px)]:block">
              {hero.subhead}
            </p>

            <div className="mt-[clamp(1.75rem,5vh,2.5rem)]">
              <DownloadButtons />
            </div>

            <a
              href={notify.href}
              className="mt-[clamp(1.25rem,3.5vh,1.75rem)] inline-block text-[15px] text-[#0071e3] hover:underline"
            >
              {notify.label} →
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
