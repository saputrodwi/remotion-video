import React from "react";
import {AbsoluteFill, Audio, Sequence, interpolate, random, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {C, FONT, OVERLAP, Pop, Idle, SceneProps, W, H, abs, clamp01} from "./common";
import {SceneFeatures, SceneHook, SceneIso, SceneMorph, SceneProgressive, SceneRace, SceneOutro} from "./scenes";

export type JxlProps = {starts: number[]};

const SCENES: React.FC<SceneProps>[] = [SceneHook, SceneIso, SceneMorph, SceneRace, SceneFeatures, SceneProgressive, SceneOutro];

/* Background berlapis: krem + 3 blob drifting + dot grid parallax + 12 partikel */
const Background: React.FC<{converge: number}> = ({converge}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const blobs = [
    {color: C.yellow, x: 250, y: 200, ax: 220, ay: 140, period: 8},
    {color: C.coral, x: 1500, y: 300, ax: 200, ay: 180, period: 11},
    {color: C.teal, x: 900, y: 880, ax: 260, ay: 120, period: 14},
  ];
  const shapes = ["star", "circle", "plus", "zig"] as const;
  const cols = [C.yellow, C.coral, C.teal, C.purple];
  return (
    <AbsoluteFill style={{background: C.cream}}>
      {blobs.map((b, i) => {
        const a = (frame / (fps * b.period)) * Math.PI * 2;
        return (
          <div key={i} style={{position: "absolute", left: b.x + Math.sin(a) * b.ax - 450, top: b.y + Math.cos(a * 0.8) * b.ay - 450, width: 900, height: 900, borderRadius: 450, opacity: 0.12, background: `radial-gradient(circle, ${b.color} 0%, transparent 70%)`}} />
        );
      })}
      <AbsoluteFill style={{backgroundImage: `radial-gradient(rgba(26,43,76,0.14) 3px, transparent 3.5px)`, backgroundSize: "64px 64px", backgroundPosition: `${frame * 0.4}px ${frame * 0.25}px`, opacity: 0.6}} />
      {new Array(12).fill(0).map((_, i) => {
        const bx = random(`px${i}`) * W;
        const by = random(`py${i}`) * H;
        const sp = 0.25 + random(`ps${i}`) * 0.4;
        const x0 = bx + Math.sin(frame / (50 + i * 7) + i) * 50;
        const y0 = (((by - frame * sp) % (H + 120)) + (H + 120)) % (H + 120) - 60;
        const x = x0 + (W / 2 - x0) * converge * 0.85;
        const y = y0 + (H / 2 - y0) * converge * 0.85;
        const rot = frame * (0.6 + (i % 4) * 0.3) * (i % 2 ? 1 : -1);
        const col = cols[i % 4];
        const sh = shapes[i % 4];
        return (
          <svg key={i} width={46} height={46} viewBox="0 0 40 40" style={{position: "absolute", left: x, top: y, opacity: 0.2, transform: `rotate(${rot}deg)`}}>
            {sh === "star" ? <path d="M20 3 L25 15 L38 16 L28 24 L31 37 L20 30 L9 37 L12 24 L2 16 L15 15 Z" fill={col} /> : null}
            {sh === "circle" ? <circle cx="20" cy="20" r="14" fill="none" stroke={col} strokeWidth="6" /> : null}
            {sh === "plus" ? <path d="M20 4 V36 M4 20 H36" stroke={col} strokeWidth="8" strokeLinecap="round" /> : null}
            {sh === "zig" ? <path d="M3 28 L13 10 L23 28 L33 10" fill="none" stroke={col} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" /> : null}
          </svg>
        );
      })}
    </AbsoluteFill>
  );
};

const ProgressBar: React.FC<{starts: number[]; total: number}> = ({starts, total}) => {
  const frame = useCurrentFrame();
  const gap = 12;
  const segW = (1720 - gap * 6) / 7;
  return (
    <>
      {starts.map((s, i) => {
        const e = i === starts.length - 1 ? total : starts[i + 1];
        const f = clamp01((frame - s) / Math.max(1, e - s));
        return (
          <div key={i} style={{...abs(100 + i * (segW + gap), 1020, segW, 16), borderRadius: 8, background: "rgba(26,43,76,0.15)", overflow: "hidden"}}>
            <div style={{width: `${f * 100}%`, height: "100%", background: i % 2 ? C.coral : C.purple, borderRadius: 8}} />
          </div>
        );
      })}
    </>
  );
};

export const JxlInfo: React.FC<JxlProps> = ({starts}) => {
  const frame = useCurrentFrame();
  const {durationInFrames: total} = useVideoConfig();
  const converge = interpolate(frame, [starts[6] + 20, total - 6], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return (
    <AbsoluteFill style={{fontFamily: FONT}}>
      <Background converge={converge} />
      <Audio src={staticFile("jxl-narration.wav")} />
      <Sequence from={0} durationInFrames={total}>
        {SCENES.map((Scene, i) => {
          const from = starts[i];
          const last = i === SCENES.length - 1;
          const end = last ? total : starts[i + 1] + OVERLAP;
          return (
            <Sequence key={i} from={from} durationInFrames={Math.max(1, end - from)}>
              <Scene index={i} durationInFrames={end - from} />
            </Sequence>
          );
        })}
      </Sequence>
      <Pop opaque s0={0.8} style={abs(100, 36)}>
        <Idle mode="wiggle" period={64}>
          <div style={{background: C.yellow, color: C.navy, border: `6px solid ${C.navy}`, borderRadius: 40, fontSize: 56, lineHeight: "66px", padding: "0 30px"}}>.JXL</div>
        </Idle>
      </Pop>
      <ProgressBar starts={starts} total={total} />
    </AbsoluteFill>
  );
};
