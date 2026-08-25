import Dither from "@/components/dither-background";
import { DownloadButtons } from "@/components/download-buttons";
import { OttoOrbit } from "@/components/otto-orbit";
import { hero, models, notify } from "@/lib/content";

/**
 * 极简一屏：整页锁死 100svh，Dither 波纹 shader 铺满当背景，
 * 头像在左、标题 + 下载按钮在右。没有 header、没有滚动条。
 *
 * 背景 canvas 是绝对定位垫底（z-0），内容层盖在上面（z-10），
 * 波纹的鼠标交互透过空白区域仍然生效。
 */
export default function Home() {
  return (
    <div className="relative flex h-[100svh] flex-col overflow-hidden bg-[#0a0a0b] text-ink">
      {/* 全屏 dither 波纹背景 */}
      <div className="absolute inset-0" aria-hidden>
        <Dither />
      </div>

      <main className="relative z-10 flex min-h-0 flex-1 items-center justify-center">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-y-10 px-6 lg:flex-row lg:justify-between lg:gap-x-14">
          {/* 左：脑壳开瓢的头像 */}
          <div className="flex shrink-0 flex-col items-center gap-3">
            <OttoOrbit />
            <p className="font-mono text-[11px] tracking-[0.16em] text-ink-faint">
              {models.caption}
            </p>
          </div>

          {/* 右：标题 + 下载 */}
          <div className="min-w-0 max-w-xl">
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
              <a
                href={notify.href}
                className="underline-grow text-[14px] text-ink-soft hover:text-ink"
              >
                {notify.label} →
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
