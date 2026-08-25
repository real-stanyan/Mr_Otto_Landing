import { downloads } from "@/lib/content";

/**
 * 两个安装口。`href` 为空的平台还没有产物，渲染成不可点的"即将开放"，
 * 但位置一直占着 —— 免得发布当天再来改版式。
 */
export function DownloadButtons() {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {downloads.items.map((item) => {
        const available = item.href.length > 0;
        const label = available ? `下载 for ${item.os}` : `${item.os} ${downloads.pending}`;

        const shape = available
          ? "pressable flex w-full items-center justify-center gap-3 rounded-full bg-[#0071e3] px-6 py-3 text-white transition-colors hover:bg-[#0077ed]"
          : "flex w-full items-center justify-center gap-3 rounded-full border border-[#d2d2d7] bg-transparent px-6 py-3 text-ink-soft";
        const inner = (
          <>
            <OsIcon name={item.icon} />
            <span className="flex flex-col items-start leading-tight">
              <span className="text-[15px] font-medium">{label}</span>
              <span className={`mt-1 font-mono text-[11px] tracking-[0.1em] ${available ? "text-white/70" : "text-ink-faint"}`}>
                {item.note}
              </span>
            </span>
          </>
        );

        return (
          <li key={item.os}>
            {available ? (
              <a href={item.href} className={shape}>
                {inner}
              </a>
            ) : (
              <span aria-disabled="true" className={`${shape} cursor-default`}>
                {inner}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function OsIcon({ name }: { name: string }) {
  const common = {
    width: 20,
    height: 20,
    viewBox: "0 0 16 16",
    fill: "currentColor",
    "aria-hidden": true,
  } as const;

  if (name === "windows") {
    return (
      <svg {...common} className="shrink-0">
        <path d="M0 2.25 6.5 1.36v6.14H0V2.25Zm7.5-1.02L16 0v7.5H7.5V1.23ZM0 8.5h6.5v6.14L0 13.75V8.5Zm7.5 0H16V16l-8.5-1.23V8.5Z" />
      </svg>
    );
  }

  return (
    <svg {...common} className="shrink-0">
      <path d="M11.18 8.42c-.02-1.63 1.33-2.41 1.39-2.45-.76-1.11-1.94-1.26-2.36-1.28-1.01-.1-1.96.59-2.47.59-.51 0-1.29-.58-2.12-.56-1.09.02-2.1.63-2.66 1.6-1.13 1.97-.29 4.89.82 6.49.54.78 1.19 1.66 2.04 1.63.82-.03 1.13-.53 2.12-.53s1.27.53 2.13.51c.88-.01 1.44-.8 1.98-1.58.62-.9.88-1.78.89-1.83-.02-.01-1.71-.66-1.73-2.59ZM9.6 3.62c.45-.55.76-1.31.67-2.07-.65.03-1.44.44-1.91.98-.42.48-.79 1.26-.69 2 .73.06 1.47-.37 1.93-.91Z" />
    </svg>
  );
}
