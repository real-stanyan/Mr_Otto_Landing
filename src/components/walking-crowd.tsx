"use client";

/* eslint-disable @next/next/no-img-element -- sprites are swapped imperatively by GSAP */

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import sprites from "@/lib/sprites.json";

gsap.registerPlugin(useGSAP);

type Frame = { src: string; width: number; height: number };
type Direction = "left" | "right";

const FRAMES: Record<Direction, Frame[]> = sprites as Record<Direction, Frame[]>;
const ALL_FRAMES = [...FRAMES.left, ...FRAMES.right];

/** How far past each edge a walker spawns and despawns. */
const MARGIN = 200;
const POOL_MAX = 24;

const rand = gsap.utils.random;
const clamp = gsap.utils.clamp;
const mapRange = gsap.utils.mapRange;

/**
 * Roughly one walker per 105px of *visible* strip — tight enough that the near
 * and far lanes overlap and read as a crowd. The pool has to cover the
 * off-screen margins too, otherwise a narrow screen ends up with most of its
 * crowd parked outside the viewport.
 */
const densityFor = (width: number) => clamp(7, POOL_MAX, Math.round((width + MARGIN * 2) / 105));

export function WalkingCrowd({ className = "" }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(9);
  const reduced = usePrefersReducedMotion();

  // Preload every sprite so a mid-walk swap never flashes an empty frame.
  useEffect(() => {
    ALL_FRAMES.forEach((frame) => {
      const img = new Image();
      img.src = frame.src;
    });
  }, []);

  // Crowd density follows the strip's width; ResizeObserver delivers an initial
  // measurement as soon as the browser gets a rendering opportunity.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setCount(densityFor(entry.contentRect.width)));
    observer.observe(el);
    // ResizeObserver only fires when the tab gets a rendering opportunity — a
    // backgrounded tab would stay stuck on the SSR count. A timer still runs.
    const settle = setTimeout(() => setCount(densityFor(el.clientWidth)), 0);
    return () => {
      clearTimeout(settle);
      observer.disconnect();
    };
  }, []);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const walkers = gsap.utils.toArray<HTMLElement>("[data-walker]", el);

      // Reduced motion keeps the crowd and drops the movement.
      if (reduced) {
        walkers.forEach((walker, i) => {
          dressWalker(walker, i % 2 ? "right" : "left", (i % 5) / 4);
          gsap.set(walker, { x: (el.clientWidth / (walkers.length + 1)) * (i + 1) - 40 });
        });
        return;
      }

      // Tweens created inside callbacks fire after useGSAP has run, so they are
      // not in its context — track the current pair per walker and kill them by
      // hand on cleanup. Keyed by walker so a walker that has crossed the strip
      // a thousand times still holds exactly two tweens.
      const live = new Map<HTMLElement, gsap.core.Tween[]>();
      let disposed = false;

      function walk(walker: HTMLElement, spawnAt: number | null) {
        if (disposed) return;

        const direction: Direction = Math.random() < 0.5 ? "left" : "right";
        const depth = rand(0, 1); // 0 = nearest the viewer, 1 = furthest back
        const { scale } = dressWalker(walker, direction, depth);

        const enter = -MARGIN;
        const exit = el!.clientWidth + MARGIN;
        const from = direction === "right" ? enter : exit;
        const to = direction === "right" ? exit : enter;
        // The first generation is dealt out across the strip instead of all
        // marching in from one edge.
        const start = spawnAt ?? from;
        const remaining = Math.max(Math.abs(to - start), 1);

        // Walkers further back move slower, which reads as distance.
        const speed = rand(64, 104) * mapRange(0, 1, 1, 0.55, depth);
        const stepsPerSecond = (speed / 30) * scale;

        const body = walker.querySelector<HTMLElement>("[data-body]")!;
        gsap.killTweensOf(body);

        const bob = gsap.fromTo(
          body,
          { yPercent: 0, rotate: -1.1 },
          {
            yPercent: -3.5,
            rotate: 1.1,
            duration: 1 / (2 * stepsPerSecond),
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          },
        );

        const cross = gsap.fromTo(
          walker,
          { x: start },
          {
            x: to,
            duration: remaining / speed,
            ease: "none",
            onComplete: () => walk(walker, null),
          },
        );

        live.set(walker, [bob, cross]);
      }

      // Deal the first generation out evenly across the strip (plus a little
      // jitter) so the crowd looks lived-in on the first paint rather than
      // trickling in from the edges.
      const span = el.clientWidth + MARGIN * 2;
      const jitter = span / (walkers.length * 2.5);
      gsap.utils.shuffle(walkers.slice()).forEach((walker, i) => {
        const slot = -MARGIN + (span * (i + 0.5)) / walkers.length;
        walk(walker, slot + rand(-jitter, jitter));
      });

      // Hovering a walker stops it mid-stride; it picks the walk back up on
      // leave. Pointer devices only — a tap should not strand someone.
      const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

      const tweensFor = (walker: HTMLElement) => [
        ...gsap.getTweensOf(walker),
        ...gsap.getTweensOf(walker.querySelector("[data-body]")!),
      ];

      const walkerFrom = (event: Event) =>
        (event.target as HTMLElement).closest<HTMLElement>("[data-walker]");

      const onEnter = (event: Event) => {
        const walker = walkerFrom(event);
        if (!walker) return;
        gsap.to(tweensFor(walker), { timeScale: 0, duration: 0.35, ease: "power2.out" });
        gsap.to(walker.querySelector("[data-body]")!, {
          yPercent: -14,
          duration: 0.34,
          ease: "back.out(2.4)",
          overwrite: "auto",
        });
      };

      const onLeave = (event: Event) => {
        const walker = walkerFrom(event);
        if (!walker) return;
        gsap.to(walker.querySelector("[data-body]")!, {
          yPercent: 0,
          duration: 0.26,
          ease: "power2.out",
          overwrite: "auto",
          onComplete: () => {
            if (disposed) return;
            gsap.to(tweensFor(walker), { timeScale: 1, duration: 0.4, ease: "power2.out" });
          },
        });
      };

      if (canHover) {
        el.addEventListener("pointerenter", onEnter, true);
        el.addEventListener("pointerleave", onLeave, true);
      }

      return () => {
        disposed = true;
        live.forEach((tweens) => tweens.forEach((tween) => tween.kill()));
        live.clear();
        walkers.forEach((walker) => gsap.killTweensOf(walker));
        el.removeEventListener("pointerenter", onEnter, true);
        el.removeEventListener("pointerleave", onLeave, true);
      };
    },
    { scope: root, dependencies: [count, reduced], revertOnUpdate: true },
  );

  return (
    <div
      ref={root}
      className={`crowd pointer-events-none relative w-full overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          data-walker
          className="pointer-events-auto absolute bottom-0 left-0 will-change-transform"
          style={{ transformOrigin: "bottom center" }}
        >
          <span className="absolute inset-x-0 bottom-[2px] mx-auto block h-[3px] w-[62%] rounded-full bg-ink/20 blur-[1px]" />
          <span data-body className="block">
            <img
              data-sprite
              alt=""
              draggable={false}
              className="sprite pixelated block h-(--sprite-h) w-auto select-none"
              src={FRAMES.right[i % FRAMES.right.length].src}
            />
          </span>
        </div>
      ))}
    </div>
  );
}

/** Give a walker a sprite, a depth lane, and the scale/opacity that go with it. */
function dressWalker(walker: HTMLElement, direction: Direction, depth: number) {
  const pool = FRAMES[direction];
  const frame = pool[Math.min(pool.length - 1, Math.floor(rand(0, pool.length)))];
  const img = walker.querySelector<HTMLImageElement>("[data-sprite]")!;
  if (!img.src.endsWith(frame.src)) img.src = frame.src;

  const scale = mapRange(0, 1, 1, 0.58, depth);
  gsap.set(walker, {
    scale,
    // 景深 = 缩放 + 抬高 + 速度 + 虚焦。素材本身不做半透明。
    y: -mapRange(0, 1, 0, 18, depth),
    zIndex: Math.round((1 - depth) * 100),
    // 平方曲线：近处那半批保持完全锐利，只有真正靠后的才糊起来。
    // blur 跟着元素自己的坐标系走，所以已经被 scale 缩过一道，不用再补偿。
    filter: depth < 0.25 ? "none" : `blur(${(depth * depth * 6).toFixed(2)}px)`,
  });
  return { scale };
}

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia(REDUCED_MOTION);
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false, // 服务端渲染时按"不减弱"算，客户端补水后立刻纠正
  );
}
