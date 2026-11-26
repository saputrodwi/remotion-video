import React from "react";
import {interpolate, random, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {loadFont as loadFredoka} from "@remotion/google-fonts/Fredoka";
import {loadFont as loadBaloo} from "@remotion/google-fonts/Baloo2";
import {cueAbs} from "./plan";

export const W = 1080;
export const H = 1920;
export const C = {
  navy: "#0B1026",
  indigo: "#2A1E5C",
  cream: "#FFF8E7",
  yellow: "#FFD93D",
  coral: "#FF6B6B",
  teal: "#06D6A0",
  earth: "#4EA8DE",
};

// REMOTION_OFFLINE_FONTS=1 -> pakai font terpasang di sistem (render offline tanpa Google Fonts).
const OFFLINE = process.env.REMOTION_OFFLINE_FONTS === "1";
const fr = OFFLINE ? null : loadFredoka("normal", {weights: ["400", "500", "600"], subsets: ["latin"]});
const bl = OFFLINE ? null : loadBaloo("normal", {weights: ["600", "700", "800"], subsets: ["latin"]});
export const fredoka = fr ? fr.fontFamily : "Fredoka";
export const baloo = bl ? bl.fontFamily : "'Baloo 2'";
export const fontsReady = () =>
  fr && bl
    ? Promise.race([
        Promise.all([fr.waitUntilDone(), bl.waitUntilDone()]),
        new Promise((r) => setTimeout(r, 15000)),
      ]).catch(() => undefined)
    : Promise.resolve();

export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const bob = (f: number, amp = 8, period = 84, ph = 0) =>
  Math.sin((f / period) * Math.PI * 2 + ph) * amp;
export const wig = (f: number, deg = 2, period = 60, ph = 0) => bob(f, deg, period, ph);
export const ease = (x: number) => 1 - Math.pow(1 - clamp01(x), 3);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** spring pop: scale 0.8 -> 1 (overshoot), opacity min 0.5 so frame 0 sudah berkomposisi. */
export const popAt = (f: number, fps: number, delay = 0, damping = 11) => {
  const p = spring({frame: f - delay, fps, config: {damping, stiffness: 150, mass: 0.8}});
  return {p, scale: 0.8 + 0.2 * p, opacity: 0.82 + 0.18 * clamp01(p * 1.4)};
};

/** Hook cue lokal: frame (relatif adegan) saat kata yang cocok diucapkan. */
export const useCue = (start: number) => (re: RegExp, fallbackLocal = 0) =>
  cueAbs(re, start, start + fallbackLocal) - start;

export const Pop: React.FC<{
  delay?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
  hidden?: boolean;
}> = ({delay = 0, style, children, hidden}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {scale, opacity} = popAt(f, fps, delay);
  return (
    <div style={{transform: `scale(${scale})`, opacity: hidden ? 0 : opacity, ...style}}>{children}</div>
  );
};

/** Posisi absolut: kotak tengah horizontal pada y tertentu. */
export const RowAt: React.FC<{top: number; style?: React.CSSProperties; children: React.ReactNode}> = ({
  top,
  style,
  children,
}) => (
  <div style={{position: "absolute", left: 0, right: 0, top, display: "flex", justifyContent: "center", ...style}}>
    {children}
  </div>
);

export const Title: React.FC<{
  text: string;
  top?: number;
  size?: number;
  accent?: string[];
  delay?: number;
  opacity?: number;
}> = ({text, top = 240, size = 110, accent = [], delay = 0, opacity = 1}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const words = text.split(" ");
  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        width: W - 140,
        top,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        columnGap: 24,
        opacity,
        fontFamily: baloo,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.04,
        textAlign: "center",
        color: C.cream,
        textShadow: "0 6px 0 rgba(0,0,0,0.28)",
      }}
    >
      {words.map((w, i) => {
        const {scale, opacity: o} = popAt(f, fps, delay + i * 5);
        const isAccent = accent.includes(w.replace(/[?!.,]/g, ""));
        return (
          <span key={i} style={{display: "inline-block", transform: `scale(${scale})`, opacity: o, color: isAccent ? C.yellow : C.cream}}>
            {w}
          </span>
        );
      })}
    </div>
  );
};

export const Badge: React.FC<{
  text: string;
  bg?: string;
  fg?: string;
  size?: number;
  blink?: boolean;
  delay?: number;
  rot?: number;
}> = ({text, bg = C.yellow, fg = C.navy, size = 48, blink, delay = 0, rot = 0}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {scale, opacity} = popAt(f, fps, delay, 9);
  const blinkO = blink ? 0.55 + 0.45 * (0.5 + 0.5 * Math.sin(f / 4)) : 1;
  return (
    <div
      style={{
        display: "inline-block",
        transform: `scale(${scale}) rotate(${rot}deg)`,
        opacity: opacity * blinkO,
        background: bg,
        color: fg,
        fontFamily: fredoka,
        fontWeight: 600,
        fontSize: size,
        letterSpacing: 2,
        padding: "12px 40px",
        borderRadius: 999,
        boxShadow: `0 0 36px ${bg}88, 0 6px 0 rgba(0,0,0,0.25)`,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};

export const Stamp: React.FC<{
  text: string;
  at: number;
  color?: string;
  size?: number;
  rot?: number;
  x?: number;
  y?: number;
}> = ({text, at, color = C.coral, size = 120, rot = -10, x = 540, y = 800}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f - at;
  if (t < 0) return null;
  const p = spring({frame: t, fps, config: {damping: 7, stiffness: 240, mass: 0.7}});
  const scale = lerp(2.6, 1, p);
  const land = 6;
  const sh = t >= land && t < land + 4 ? (((t - land) % 2 ? 1 : -1) * 12 * (1 - (t - land) / 4)) : 0;
  const shy = t >= land && t < land + 4 ? (((t - land) % 2 ? -1 : 1) * 6 * (1 - (t - land) / 4)) : 0;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%,-50%) translate(${sh}px,${shy}px) rotate(${rot}deg) scale(${scale})`,
        opacity: clamp01(t / 3),
        border: `10px solid ${color}`,
        borderRadius: 22,
        padding: "4px 36px",
        color,
        fontFamily: baloo,
        fontWeight: 800,
        fontSize: size,
        letterSpacing: 6,
        background: "rgba(11,16,38,0.35)",
        boxShadow: `0 0 40px ${color}66`,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};

export const Confetti: React.FC<{at: number; count?: number; x?: number; y?: number}> = ({
  at,
  count = 44,
  x = 540,
  y = 760,
}) => {
  const f = useCurrentFrame();
  const t = f - at;
  if (t < 0 || t > 80) return null;
  const cols = [C.yellow, C.coral, C.teal, C.earth, C.cream];
  return (
    <div style={{position: "absolute", inset: 0, pointerEvents: "none"}}>
      {Array.from({length: count}).map((_, i) => {
        const a = random(`ca${i}`) * Math.PI * 2;
        const sp = 10 + random(`cs${i}`) * 22;
        const px = x + Math.cos(a) * sp * t * 0.9;
        const py = y + Math.sin(a) * sp * t * 0.9 - 40 * t * 0 + 0.55 * t * t;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: px,
              top: py,
              width: 16,
              height: 28,
              background: cols[i % cols.length],
              opacity: 1 - t / 80,
              transform: `rotate(${t * (6 + (i % 7) * 3)}deg)`,
              borderRadius: 4,
            }}
          />
        );
      })}
    </div>
  );
};

/* ---------- SVG art ---------- */

export const Earth: React.FC<{size: number; spin?: number}> = ({size, spin = 0}) => {
  const s = ((spin % 200) + 200) % 200;
  const land = (
    <>
      <path d="M20 60 q20-25 45-10 t25 30 q-10 25-35 22 t-35-42z" />
      <path d="M110 120 q25-18 45 0 t10 35 q-30 12-50-8z" />
      <path d="M128 48 q15-12 30-2 t5 20 q-20 6-35-18z" />
      <path d="M60 150 q10-10 22-2 t-4 16 q-16 4-18-14z" />
    </>
  );
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={{overflow: "visible"}}>
      <defs>
        <radialGradient id="eg" cx="0.35" cy="0.3" r="0.9">
          <stop offset="0" stopColor="#9BD4F5" />
          <stop offset="0.55" stopColor={C.earth} />
          <stop offset="1" stopColor="#1F5F94" />
        </radialGradient>
        <radialGradient id="es" cx="0.35" cy="0.3" r="0.8">
          <stop offset="0.6" stopColor="rgba(11,16,38,0)" />
          <stop offset="1" stopColor="rgba(11,16,38,0.55)" />
        </radialGradient>
        <clipPath id="ec">
          <circle cx="100" cy="100" r="96" />
        </clipPath>
      </defs>
      <circle cx="100" cy="100" r="112" fill="rgba(78,168,222,0.18)" />
      <circle cx="100" cy="100" r="104" fill="rgba(78,168,222,0.22)" />
      <circle cx="100" cy="100" r="96" fill="url(#eg)" />
      <g clipPath="url(#ec)" fill="#34C98A">
        {[-200, 0, 200].map((o) => (
          <g key={o} transform={`translate(${o - s},0)`}>
            {land}
          </g>
        ))}
        <ellipse cx="60" cy="40" rx="30" ry="6" fill="rgba(255,255,255,0.35)" />
        <ellipse cx="140" cy="92" rx="26" ry="5" fill="rgba(255,255,255,0.3)" />
      </g>
      <circle cx="100" cy="100" r="96" fill="url(#es)" />
    </svg>
  );
};

export const Moon: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 200 200" style={{overflow: "visible"}}>
    <defs>
      <radialGradient id="mg" cx="0.35" cy="0.3" r="0.9">
        <stop offset="0" stopColor="#F3EEDC" />
        <stop offset="0.7" stopColor="#C9C3AF" />
        <stop offset="1" stopColor="#8E8A7C" />
      </radialGradient>
    </defs>
    <circle cx="100" cy="100" r="106" fill="rgba(255,248,231,0.10)" />
    <circle cx="100" cy="100" r="96" fill="url(#mg)" />
    {[
      [70, 70, 18],
      [128, 62, 11],
      [120, 128, 24],
      [62, 132, 10],
      [150, 100, 8],
      [92, 100, 7],
    ].map(([x, y, r], i) => (
      <circle key={i} cx={x} cy={y} r={r} fill="rgba(110,104,90,0.35)" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
    ))}
  </svg>
);

export const ROCK_PTS: [number, number][] = [
  [20, 36], [36, 14], [62, 8], [86, 26], [94, 52], [80, 82], [54, 94], [28, 86], [10, 62], [12, 46],
];
export const DEBRIS_PTS: [number, number][] = [
  [8, 24], [58, 18], [60, 6], [80, 6], [82, 30], [94, 34], [90, 74], [48, 82], [42, 94], [10, 76],
];
const ptsPath = (pts: [number, number][]) => "M" + pts.map((p) => p.join(",")).join(" L") + " Z";

export const Rock: React.FC<{size: number; color?: string; glow?: string}> = ({size, color = "#A59C8C", glow}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{overflow: "visible", filter: glow ? `drop-shadow(0 0 14px ${glow})` : undefined}}>
    <path d={ptsPath(ROCK_PTS)} fill={color} stroke="#5F584C" strokeWidth="4" strokeLinejoin="round" />
    <circle cx="40" cy="40" r="9" fill="rgba(0,0,0,0.18)" />
    <circle cx="68" cy="62" r="7" fill="rgba(0,0,0,0.18)" />
    <circle cx="44" cy="72" r="5" fill="rgba(0,0,0,0.15)" />
  </svg>
);

/** t: 0 = puing roket, 1 = batu alami. */
export const MorphRock: React.FC<{size: number; t: number}> = ({size, t}) => {
  const pts = DEBRIS_PTS.map((p, i) => [lerp(p[0], ROCK_PTS[i][0], t), lerp(p[1], ROCK_PTS[i][1], t)] as [number, number]);
  const fill = `rgb(${Math.round(lerp(176, 165, t))},${Math.round(lerp(186, 156, t))},${Math.round(lerp(200, 140, t))})`;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{overflow: "visible"}}>
      <path d={ptsPath(pts)} fill={fill} stroke={t > 0.5 ? "#5F584C" : "#5A6578"} strokeWidth="4" strokeLinejoin="round" />
      <g opacity={1 - t}>
        <path d="M20 30 L70 24 M16 52 L84 50 M24 70 L60 68" stroke="#5A6578" strokeWidth="2.5" />
        <circle cx="30" cy="40" r="3" fill="#5A6578" />
        <circle cx="70" cy="40" r="3" fill="#5A6578" />
        <path d="M70 6 L70 -10" stroke="#C9D2E0" strokeWidth="3" />
        <rect x="62" y="-16" width="16" height="6" rx="2" fill={C.coral} />
      </g>
      <g opacity={t}>
        <circle cx="40" cy="40" r="9" fill="rgba(0,0,0,0.18)" />
        <circle cx="68" cy="62" r="7" fill="rgba(0,0,0,0.18)" />
      </g>
    </svg>
  );
};

export const Sun: React.FC<{size: number; f: number}> = ({size, f}) => (
  <svg width={size} height={size} viewBox="0 0 200 200" style={{overflow: "visible"}}>
    <defs>
      <radialGradient id="sg">
        <stop offset="0" stopColor="#FFF3B0" />
        <stop offset="0.6" stopColor={C.yellow} />
        <stop offset="1" stopColor="#FFB020" />
      </radialGradient>
    </defs>
    <circle cx="100" cy="100" r="130" fill="rgba(255,217,61,0.10)" />
    <g transform={`rotate(${f * 0.6} 100 100)`} stroke={C.yellow} strokeWidth="8" strokeLinecap="round" opacity="0.9">
      {Array.from({length: 12}).map((_, i) => (
        <line key={i} x1="100" y1="12" x2="100" y2="-6" transform={`rotate(${i * 30} 100 100)`} />
      ))}
    </g>
    <circle cx="100" cy="100" r="70" fill="url(#sg)" />
  </svg>
);

export const Car: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size / 2} viewBox="0 0 200 100" style={{overflow: "visible"}}>
    <path d="M10 70 L10 52 Q10 44 20 42 L48 38 L68 16 Q72 12 80 12 L128 12 Q136 12 142 18 L160 40 L184 46 Q192 48 192 58 L192 70 Z" fill={C.coral} stroke={C.cream} strokeWidth="4" strokeLinejoin="round" />
    <path d="M74 22 L66 38 L104 38 L104 22 Z M112 22 L112 38 L146 38 L132 22 Z" fill="#BFE6FA" />
    <circle cx="56" cy="74" r="17" fill={C.navy} stroke={C.cream} strokeWidth="5" />
    <circle cx="146" cy="74" r="17" fill={C.navy} stroke={C.cream} strokeWidth="5" />
    <circle cx="56" cy="74" r="6" fill={C.cream} />
    <circle cx="146" cy="74" r="6" fill={C.cream} />
  </svg>
);

export const Telescope: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 200 200" style={{overflow: "visible"}}>
    <g stroke={C.cream} strokeWidth="7" strokeLinecap="round">
      <line x1="92" y1="112" x2="56" y2="188" />
      <line x1="92" y1="112" x2="128" y2="188" />
      <line x1="92" y1="112" x2="92" y2="188" />
    </g>
    <g transform="rotate(-38 92 100)">
      <rect x="22" y="82" width="140" height="40" rx="12" fill={C.cream} />
      <rect x="64" y="82" width="14" height="40" fill={C.coral} />
      <rect x="130" y="76" width="42" height="52" rx="10" fill={C.teal} />
      <rect x="6" y="90" width="22" height="24" rx="6" fill={C.indigo} stroke={C.cream} strokeWidth="4" />
    </g>
    <circle cx="92" cy="104" r="12" fill={C.yellow} stroke={C.navy} strokeWidth="4" />
  </svg>
);

export const Probe: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size / 2} viewBox="0 0 200 100" style={{overflow: "visible"}}>
    <rect x="2" y="30" width="62" height="40" rx="4" fill="#3A5BC7" stroke={C.cream} strokeWidth="3" />
    <rect x="136" y="30" width="62" height="40" rx="4" fill="#3A5BC7" stroke={C.cream} strokeWidth="3" />
    <path d="M22 30 V70 M42 30 V70 M156 30 V70 M176 30 V70" stroke={C.cream} strokeWidth="2" opacity="0.7" />
    <rect x="68" y="34" width="64" height="32" rx="6" fill={C.yellow} stroke={C.navy} strokeWidth="3" />
    <path d="M100 34 L100 18 M84 8 Q100 22 116 8" stroke={C.cream} strokeWidth="4" fill="none" strokeLinecap="round" />
    <circle cx="100" cy="50" r="7" fill={C.navy} />
    <path d="M68 50 H64 M132 50 H136" stroke={C.cream} strokeWidth="3" />
  </svg>
);

/** Garis dengan efek draw-on (pathLength=1). */
export const DrawPath: React.FC<{
  d: string;
  progress: number;
  stroke: string;
  width?: number;
  dash?: string;
  glow?: boolean;
  head?: boolean;
}> = ({d, progress, stroke, width = 6, dash, glow}) => (
  <g style={{filter: glow ? `drop-shadow(0 0 10px ${stroke})` : undefined}}>
    {dash ? (
      <path d={d} fill="none" stroke={stroke} strokeWidth={width} strokeLinecap="round" strokeDasharray={dash} opacity={clamp01(progress * 3)} />
    ) : (
      <path d={d} fill="none" stroke={stroke} strokeWidth={width} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - clamp01(progress)} />
    )}
  </g>
);

export const Arrowhead: React.FC<{x: number; y: number; angle: number; color: string; size?: number; opacity?: number}> = ({
  x,
  y,
  angle,
  color,
  size = 22,
  opacity = 1,
}) => (
  <path
    d={`M0 0 L${-size} ${-size * 0.6} L${-size} ${size * 0.6} Z`}
    fill={color}
    opacity={opacity}
    transform={`translate(${x} ${y}) rotate(${angle})`}
  />
);
