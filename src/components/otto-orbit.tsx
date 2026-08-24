import { models, site } from "@/lib/content";

/**
 * Otto 头像：像素水獭脸来自 public/otter_logo.png（1254×1254，带透明通道，
 * 参考图只用这张）。大模型 logo 沿椭圆轨道绕着它转（reactbits OrbitImages
 * 的 offset-path 思路，但这里是纯 CSS 动画 —— 不进主线程，首屏加载不掉帧）。
 *
 * 前后分层在 CSS 里做：logo 转到底部（近端）时 z-index 高于头像，盖在脸上面；
 * 转到顶部/两侧（远端）时 z-index 低于头像，被脸盖掉。
 *
 * logo 用原生 SVG（自带品牌色），不走 mask —— mask 会把色染成 currentColor。
 */

function OttoHead() {
  return (
    <div className="relative h-full w-full">
      <img
        src="/otter_logo.png"
        alt={site.name}
        draggable={false}
        className="pixelated block h-full w-full object-contain select-none"
      />
    </div>
  );
}

export function OttoOrbit() {
  const n = models.items.length;
  return (
    <div className="otto-stage" aria-label={models.caption}>
      {/* 轨道层微微歪一点，logo 再反向转正 —— 环是斜的，logo 是正的 */}
      <div className="orbit-ring" aria-hidden>
        {models.items.map((m, i) => (
          <span
            key={m.name}
            className="orbit-item"
            style={{ animationDelay: `calc(var(--orbit-dur) / ${n} * -${i})` }}
          >
            <img
              src={m.src}
              alt=""
              draggable={false}
              className={`orbit-logo${m.disc ? " orbit-logo--disc" : ""}`}
            />
          </span>
        ))}
      </div>

      <div className="otto-head">
        <OttoHead />
      </div>
    </div>
  );
}
