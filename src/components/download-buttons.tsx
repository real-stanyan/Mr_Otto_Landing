"use client";

import { useEffect, useRef, useState } from "react";
import { downloads } from "@/lib/content";

type Size = "default" | "large";

/**
 * 两个安装口。`href` 为空的平台还没有产物，渲染成不可点的"即将开放"，
 * 但位置一直占着 —— 免得发布当天再来改版式。
 *
 * 下载前有一道密码门（减速带，不是保险箱）：客户端只存 SHA-256 哈希，
 * bundle 里翻不到明文；但产物本体在公开 GitHub Release 上，知道直链就能绕过。
 * 真要锁死得换私有分发渠道。
 */
export function DownloadButtons({ size = "default" }: { size?: Size }) {
  const large = size === "large";
  // 密码门当前拦着哪个下载。null = 关着
  const [gate, setGate] = useState<{ href: string; os: string } | null>(null);

  return (
    <>
      <ul className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {downloads.items.map((item) => {
          const available = item.href.length > 0;
          const label = available ? `下载 for ${item.os}` : `${item.os} ${downloads.pending}`;

          const inner = (
            <>
              <OsIcon name={item.icon} />
              <span className="flex flex-col items-start leading-tight">
                <span className={large ? "text-[16px] font-medium" : "text-[15px] font-medium"}>
                  {label}
                </span>
                <span className="mt-1 font-mono text-[11px] tracking-[0.1em] text-ink-faint">
                  {item.note}
                </span>
              </span>
            </>
          );

          const shape = `pressable flex items-center gap-3 border ${large ? "px-6 py-4" : "px-5 py-3.5"}`;

          return (
            <li key={item.os}>
              {available ? (
                <button
                  type="button"
                  onClick={() => setGate({ href: item.href, os: item.os })}
                  className={`${shape} border-ink bg-ink text-paper hover:opacity-90`}
                >
                  {inner}
                </button>
              ) : (
                <span
                  aria-disabled="true"
                  className={`${shape} cursor-default border-line text-ink-soft`}
                >
                  {inner}
                </span>
              )}
            </li>
          );
        })}
      </ul>
      {gate && <PasswordGate gate={gate} onClose={() => setGate(null)} />}
    </>
  );
}

async function sha256Hex(text: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function PasswordGate({ gate, onClose }: { gate: { href: string; os: string }; onClose: () => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  // 入场动画的 data-mounted 替身：hidden 态首渲染，下一帧翻真，transition 接管
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const submit = async () => {
    if (busy || value.length === 0) return;
    setBusy(true);
    const ok = (await sha256Hex(value)) === downloads.passwordHash;
    if (ok) {
      onClose();
      window.location.href = gate.href;
    } else {
      setError(true);
      setBusy(false);
      inputRef.current?.select();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`下载 ${gate.os} 安装包`}
      data-mounted={mounted}
      className="group fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-6
        transition-opacity duration-200 data-[mounted=false]:opacity-0"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[340px] border border-line bg-paper-raised p-6
          transition-[transform,opacity] duration-200 [transition-timing-function:var(--ease-out)]
          group-data-[mounted=false]:scale-[0.97] group-data-[mounted=false]:opacity-0
          motion-reduce:group-data-[mounted=false]:scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-[15px] font-medium text-ink">下载 {gate.os} 安装包</p>
        <p className="mt-1 text-[12.5px] text-ink-soft">内测阶段，输入下载密码继续。</p>
        <form
          className="mt-4 flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            void submit();
          }}
        >
          <input
            ref={inputRef}
            type="password"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setError(false);
            }}
            placeholder="下载密码"
            autoComplete="off"
            className="border border-line bg-paper px-3 py-2 text-[14px] text-ink placeholder:text-ink-faint"
          />
          {error && <p className="text-[12px] text-ink-soft">密码不对，再试一次。</p>}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="pressable flex-1 border border-line px-4 py-2 text-[13px] text-ink-soft hover:text-ink"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={busy || value.length === 0}
              className="pressable flex-1 border border-ink bg-ink px-4 py-2 text-[13px] text-paper hover:opacity-90 disabled:opacity-50"
            >
              下载
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function OsIcon({ name }: { name: string }) {
  const common = { width: 20, height: 20, viewBox: "0 0 16 16", fill: "currentColor", "aria-hidden": true } as const;

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
