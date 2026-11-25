import React from "react";
import {AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {loadFont} from "@remotion/google-fonts/Baloo2";

const {fontFamily} = loadFont("normal", {weights: ["800"]});

export const FONT = fontFamily;
export const C = {cream: "#FFF8E7", brick: "#D9383A", navy: "#1A2B4C", yellow: "#FFD93D"};
export const BOUNCY = {damping: 12, stiffness: 120};
export const OVERLAP = 12; // frame tumpang tindih antar block untuk transisi halus

export type SceneProps = {durationInFrames: number};

export const abs = (left: number, top: number): React.CSSProperties => ({position: "absolute", left, top});

export const useBounce = (delay = 0) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - delay, fps, config: BOUNCY});
};

/** Posisi relatif (0..1) dari durasi block -> frame, supaya animasi ikut panjang narasi. */
export const makeAt = (d: number) => (f: number) => Math.round(d * f);

export const Pop: React.FC<{
  delay?: number; x?: number; y?: number; s0?: number; rotate?: number;
  style?: React.CSSProperties; children?: React.ReactNode;
}> = ({delay = 0, x = 0, y = 0, s0 = 0.2, rotate = 0, style, children}) => {
  const sp = useBounce(delay);
  const opacity = interpolate(sp, [0, 0.25], [0, 1], {extrapolateRight: "clamp"});
  return (
    <div style={{...style, opacity, transform: `translate(${(1 - sp) * x}px, ${(1 - sp) * y}px) scale(${s0 + (1 - s0) * sp}) rotate(${rotate}deg)`}}>
      {children}
    </div>
  );
};

/** Fade-in 8 frame, fade + scale down di 12 frame terakhir. Background transparan (crossfade antar block). */
export const SceneWrap: React.FC<{durationInFrames: number; last?: boolean; children: React.ReactNode}> = ({durationInFrames, last, children}) => {
  const frame = useCurrentFrame();
  const cl = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
  const fin = interpolate(frame, [0, 8], [0, 1], cl);
  const end = [durationInFrames - OVERLAP, durationInFrames];
  const fout = last ? 1 : interpolate(frame, end, [1, 0], cl);
  const sc = last ? 1 : interpolate(frame, end, [1, 0.96], cl);
  return (
    <AbsoluteFill style={{fontFamily: FONT, opacity: Math.min(fin, fout), transform: `scale(${sc})`}}>{children}</AbsoluteFill>
  );
};

export const Headline: React.FC<{children: React.ReactNode; size?: number; top?: number; delay?: number; color?: string}> = ({children, size = 110, top = 70, delay = 0, color = C.navy}) => (
  <Pop delay={delay} y={120} style={{position: "absolute", left: 0, top, width: 1920, textAlign: "center"}}>
    <div style={{fontSize: size, lineHeight: 1.05, color, textShadow: `6px 6px 0 ${C.yellow}`}}>{children}</div>
  </Pop>
);

/** Garis-gambar animasi (0..1) untuk panah, coretan, lingkaran. */
export const useDraw = (delay: number, frames = 12) => {
  const frame = useCurrentFrame();
  return interpolate(frame - delay, [0, frames], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
};

export const Confetti: React.FC<{start: number; cx: number; cy: number; count?: number}> = ({start, cx, cy, count = 28}) => {
  const t = useCurrentFrame() - start;
  if (t < 0 || t > 55) return null;
  const colors = [C.yellow, C.brick, C.navy];
  return (
    <AbsoluteFill style={{pointerEvents: "none"}}>
      {new Array(count).fill(0).map((_, i) => {
        const a = random(`a${i}${start}`) * Math.PI * 2;
        const sp = 7 + random(`s${i}${start}`) * 14;
        const x = cx + Math.cos(a) * sp * t;
        const y = cy + Math.sin(a) * sp * t + 0.35 * t * t;
        const opacity = interpolate(t, [35, 55], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
        const w = 12 + random(`w${i}${start}`) * 12;
        return <div key={i} style={{position: "absolute", left: x, top: y, width: w, height: w * 0.55, background: colors[i % 3], borderRadius: 3, opacity, transform: `rotate(${t * (6 + (i % 7)) + i * 40}deg)`}} />;
      })}
    </AbsoluteFill>
  );
};
