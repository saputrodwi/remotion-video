import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {loadFont} from "@remotion/google-fonts/Baloo2";

const {fontFamily} = loadFont("normal", {weights: ["800"]});

export const FONT = fontFamily;
export const C = {
  cream: "#FFF8E7",
  yellow: "#FFD93D",
  coral: "#FF6B6B",
  purple: "#6C5CE7",
  ink: "#2D2A4A",
};
export const BOUNCY = {damping: 12, stiffness: 120};

export type SceneProps = {from?: number; durationInFrames: number};

export const useBounce = (delay = 0) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - delay, fps, config: BOUNCY});
};

type PopProps = {
  delay?: number;
  x?: number;
  y?: number;
  s0?: number;
  rotate?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

/** Entrance bouncy: slide dari offset (x,y) + scale dari s0 -> 1. */
export const Pop: React.FC<PopProps> = ({
  delay = 0,
  x = 0,
  y = 0,
  s0 = 0.2,
  rotate = 0,
  style,
  children,
}) => {
  const sp = useBounce(delay);
  const opacity = interpolate(sp, [0, 0.25], [0, 1], {extrapolateRight: "clamp"});
  return (
    <div
      style={{
        ...style,
        opacity,
        transform: `translate(${(1 - sp) * x}px, ${(1 - sp) * y}px) scale(${
          s0 + (1 - s0) * sp
        }) rotate(${rotate}deg)`,
      }}
    >
      {children}
    </div>
  );
};

/** Wrapper scene: bg krem, wipe masuk, fade + scale down 15 frame terakhir. */
export const SceneWrap: React.FC<{
  durationInFrames: number;
  wipe?: boolean;
  children: React.ReactNode;
}> = ({durationInFrames, wipe = true, children}) => {
  const frame = useCurrentFrame();
  const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
  const end = [durationInFrames - 15, durationInFrames];
  const opacity = interpolate(frame, end, [1, 0], clamp);
  const scale = interpolate(frame, end, [1, 0.92], clamp);
  const wipeX = interpolate(frame, [0, 10], [0, 1920], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  return (
    <AbsoluteFill style={{backgroundColor: C.cream, fontFamily: FONT}}>
      <AbsoluteFill style={{opacity, transform: `scale(${scale})`}}>{children}</AbsoluteFill>
      {wipe && frame < 10 ? (
        <div
          style={{
            position: "absolute",
            left: wipeX,
            top: 0,
            width: 1920,
            height: 1080,
            background: C.coral,
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};

export const Title: React.FC<{
  children: React.ReactNode;
  size?: number;
  top?: number;
  delay?: number;
  color?: string;
}> = ({children, size = 120, top = 70, delay = 0, color = C.ink}) => (
  <Pop
    delay={delay}
    y={140}
    style={{position: "absolute", left: 0, top, width: 1920, textAlign: "center"}}
  >
    <div
      style={{
        fontSize: size,
        lineHeight: 1.05,
        color,
        textShadow: `6px 6px 0 ${C.yellow}`,
      }}
    >
      {children}
    </div>
  </Pop>
);

/** Efek stempel: jatuh/membesar lalu menghantam. */
export const Stamp: React.FC<{
  delay: number;
  rotate: number;
  color: string;
  drop?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({delay, rotate, color, drop = 0, style, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sp = spring({frame: frame - delay, fps, config: {damping: 9, stiffness: 220}});
  const opacity = interpolate(frame - delay, [0, 4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        ...style,
        opacity,
        color,
        border: `10px solid ${color}`,
        borderRadius: 28,
        padding: "8px 36px",
        background: "rgba(255,248,231,0.85)",
        transform: `translateY(${(1 - sp) * -drop}px) scale(${1 + (1 - sp) * 1.8}) rotate(${rotate}deg)`,
      }}
    >
      {children}
    </div>
  );
};

/** Confetti kecil, deterministik (random seed). */
export const Confetti: React.FC<{start: number; cx: number; cy: number; count?: number}> = ({
  start,
  cx,
  cy,
  count = 40,
}) => {
  const t = useCurrentFrame() - start;
  if (t < 0 || t > 60) return null;
  const colors = [C.yellow, C.coral, C.purple];
  return (
    <AbsoluteFill style={{pointerEvents: "none"}}>
      {new Array(count).fill(0).map((_, i) => {
        const a = random(`a${i}${start}`) * Math.PI * 2;
        const sp = 8 + random(`s${i}${start}`) * 18;
        const x = cx + Math.cos(a) * sp * t;
        const y = cy + Math.sin(a) * sp * t + 0.35 * t * t;
        const opacity = interpolate(t, [40, 60], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const w = 14 + random(`w${i}${start}`) * 14;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: w,
              height: w * 0.55,
              background: colors[i % 3],
              borderRadius: 3,
              opacity,
              transform: `rotate(${t * (6 + (i % 7)) + i * 40}deg)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
