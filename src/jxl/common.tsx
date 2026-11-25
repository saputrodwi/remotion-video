import React from "react";
import {AbsoluteFill, Easing, interpolate, random, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {loadFont} from "@remotion/google-fonts/Baloo2";

const {fontFamily} = loadFont("normal", {weights: ["800"]});

export const FONT = fontFamily;
export const C = {
  cream: "#FFF8E7", navy: "#1A2B4C", coral: "#FF6B6B", yellow: "#FFD93D",
  teal: "#06D6A0", purple: "#6C5CE7", green: "#22C55E",
};
export const SPRING = {damping: 12, stiffness: 120};
export const OVERLAP = 10;
export const W = 1920;
export const H = 1080;

export type SceneProps = {index: number; durationInFrames: number};

export const abs = (left: number, top: number, width?: number, height?: number): React.CSSProperties => ({
  position: "absolute", left, top, ...(width !== undefined ? {width} : {}), ...(height !== undefined ? {height} : {}),
});
export const makeAt = (d: number) => (f: number) => Math.round(d * f);
const cl = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export const useSp = (delay = 0, cfg: {damping?: number; stiffness?: number; mass?: number} = SPRING) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - delay, fps, config: cfg});
};

/** Entrance spring bouncy. opaque = selalu terlihat (untuk frame 0 hook), mulai dari scale s0. */
export const Pop: React.FC<{
  delay?: number; x?: number; y?: number; s0?: number; rotate?: number; opaque?: boolean;
  style?: React.CSSProperties; children?: React.ReactNode;
}> = ({delay = 0, x = 0, y = 0, s0 = 0.8, rotate = 0, opaque = false, style, children}) => {
  const sp = useSp(delay);
  const opacity = opaque ? 1 : interpolate(sp, [0, 0.3], [0, 1], {extrapolateRight: "clamp"});
  return (
    <div style={{...style, opacity, transform: `translate(${(1 - sp) * x}px, ${(1 - sp) * y}px) scale(${s0 + (1 - s0) * sp}) rotate(${rotate}deg)`}}>
      {children}
    </div>
  );
};

/** Micro-motion idle: bob 8px atau wiggle 2 derajat. */
export const Idle: React.FC<{mode?: "bob" | "wiggle"; phase?: number; period?: number; style?: React.CSSProperties; children: React.ReactNode}> = ({mode = "bob", phase = 0, period = 50, style, children}) => {
  const frame = useCurrentFrame();
  const s = Math.sin(((frame + phase) / period) * Math.PI * 2);
  const t = mode === "bob" ? `translateY(${s * 8}px)` : `rotate(${s * 2}deg)`;
  return <div style={{...style, transform: t}}>{children}</div>;
};

/** Teks masuk per kata, spring stagger 3 frame. items boleh campuran string dan node. */
export const Words: React.FC<{
  items: React.ReactNode[]; size: number; color?: string; delay?: number; opaque?: boolean;
  stagger?: number; shadow?: boolean; style?: React.CSSProperties;
}> = ({items, size, color = C.navy, delay = 0, opaque = false, stagger = 3, shadow = true, style}) => {
  const flat: React.ReactNode[] = [];
  items.forEach((it) => {
    if (typeof it === "string") it.split(" ").filter(Boolean).forEach((w) => flat.push(w));
    else flat.push(it);
  });
  return (
    <div style={{display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", columnGap: size * 0.22, fontSize: size, lineHeight: 1.05, color, textShadow: shadow ? `5px 5px 0 ${C.yellow}` : undefined, ...style}}>
      {flat.map((w, i) => (
        <Pop key={i} delay={delay + i * stagger} y={50} s0={0.7} opaque={opaque} style={{display: "inline-block"}}>
          {w}
        </Pop>
      ))}
    </div>
  );
};

export const Title: React.FC<{items: React.ReactNode[]; size?: number; top?: number; color?: string; delay?: number; opaque?: boolean}> = ({items, size = 130, top = 105, color = C.navy, delay = 0, opaque = false}) => (
  <div style={abs(100, top, 1720)}>
    <Words items={items} size={size} color={color} delay={delay} opaque={opaque} />
  </div>
);

/** Counter: angka dihitung dengan interpolate, format koma desimal Indonesia. */
export const Counter: React.FC<{from?: number; to: number; start?: number; frames?: number; decimals?: number; prefix?: string; suffix?: string}> = ({from = 0, to, start = 0, frames = 24, decimals = 0, prefix = "", suffix = ""}) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [start, start + frames], [from, to], {...cl, easing: Easing.out(Easing.cubic)});
  return <>{prefix + v.toFixed(decimals).replace(".", ",") + suffix}</>;
};

export const useDraw = (start: number, frames = 14) => {
  const frame = useCurrentFrame();
  return interpolate(frame - start, [0, frames], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
};

/** Stempel: overshoot spring (jatuh/zoom) — screen-shake diatur di SceneWrap lewat `shakes`. */
export const Stamp: React.FC<{delay: number; rotate: number; color: string; drop?: number; style?: React.CSSProperties; children: React.ReactNode}> = ({delay, rotate, color, drop = 0, style, children}) => {
  const frame = useCurrentFrame();
  const sp = useSp(delay, {damping: 7, stiffness: 190, mass: 0.9});
  const opacity = interpolate(frame - delay, [0, 3], [0, 1], cl);
  return (
    <div style={{...style, opacity, color, border: `12px solid ${color}`, borderRadius: 36, background: "rgba(255,248,231,0.92)", transform: `translateY(${(1 - sp) * -drop}px) scale(${1 + (1 - sp) * 1.4}) rotate(${rotate}deg)`}}>
      {children}
    </div>
  );
};

/** Wrapper adegan: camera drift, shake, transisi overlap (masuk dari scale 0.94, keluar geser + redup parsial; tidak pernah kosong). */
export const SceneWrap: React.FC<{index: number; durationInFrames: number; last?: boolean; shakes?: number[]; children: React.ReactNode}> = ({index, durationInFrames, last, shakes = [], children}) => {
  const frame = useCurrentFrame();
  const prog = clamp01(frame / durationInFrames);
  const enter = index === 0 ? 1 : interpolate(frame, [0, OVERLAP], [0, 1], cl);
  const exit = last ? 1 : interpolate(frame, [durationInFrames - OVERLAP, durationInFrames], [1, 0.3], cl);
  const exitX = last ? 0 : interpolate(frame, [durationInFrames - OVERLAP, durationInFrames], [0, -50], cl);
  const camScale = 1 + 0.03 * prog;
  const pan = (index % 2 === 0 ? 1 : -1) * 10 * prog;
  let sx = 0, sy = 0;
  for (const s of shakes) {
    if (frame >= s && frame < s + 4) {
      sx = (random(`shx${s}${frame}`) - 0.5) * 6;
      sy = (random(`shy${s}${frame}`) - 0.5) * 6;
    }
  }
  const enterScale = index === 0 ? 1 : 0.94 + 0.06 * enter;
  return (
    <AbsoluteFill style={{fontFamily: FONT, opacity: Math.min(enter, exit), transform: `translate(${pan + sx + exitX}px, ${sy}px) scale(${camScale * enterScale})`}}>
      {children}
    </AbsoluteFill>
  );
};

export const Confetti: React.FC<{start: number; cx: number; cy: number; count?: number}> = ({start, cx, cy, count = 36}) => {
  const t = useCurrentFrame() - start;
  if (t < 0 || t > 60) return null;
  const colors = [C.yellow, C.coral, C.teal, C.purple];
  return (
    <AbsoluteFill style={{pointerEvents: "none"}}>
      {new Array(count).fill(0).map((_, i) => {
        const a = random(`a${i}${start}`) * Math.PI * 2;
        const sp = 7 + random(`s${i}${start}`) * 15;
        const x = cx + Math.cos(a) * sp * t;
        const y = cy + Math.sin(a) * sp * t + 0.35 * t * t;
        const opacity = interpolate(t, [40, 60], [1, 0], cl);
        const w = 14 + random(`w${i}${start}`) * 14;
        return <div key={i} style={{position: "absolute", left: x, top: y, width: w, height: w * 0.55, background: colors[i % 4], borderRadius: 3, opacity, transform: `rotate(${t * (6 + (i % 7)) + i * 40}deg)`}} />;
      })}
    </AbsoluteFill>
  );
};
