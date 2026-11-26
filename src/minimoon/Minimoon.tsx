import React from "react";
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {C} from "./common";
import {Background, Chip, ProgressBar, Subtitles} from "./shell";
import {SCENES} from "./scenes";

export type MinimoonProps = {starts: number[]};
const OVERLAP = 10;

const SceneWrap: React.FC<{idx: number; len: number; children: React.ReactNode}> = ({idx, len, children}) => {
  const f = useCurrentFrame();
  const t = Math.min(1, f / Math.max(1, len));
  const dir = idx % 2 ? -1 : 1;
  const enter = idx === 0 ? 1 : interpolate(f, [3, OVERLAP], [0.15, 1], {extrapolateRight: "clamp"});
  const exit = interpolate(f, [len, len + 5], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return (
    <AbsoluteFill style={{opacity: enter * exit}}>
      <AbsoluteFill style={{transform: `translateX(${dir * (-10 + 20 * t)}px) scale(${1 + 0.03 * t})`, transformOrigin: "50% 45%"}}>
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Minimoon: React.FC<MinimoonProps> = ({starts}) => {
  const {durationInFrames} = useVideoConfig();
  return (
    <AbsoluteFill style={{background: C.navy}}>
      <Audio src={staticFile("narration.wav")} />
      <Background />
      {SCENES.map((S, i) => {
        const from = starts[i];
        const last = i + 1 >= starts.length;
        const end = last ? durationInFrames : starts[i + 1];
        const dur = end - from + (last ? 0 : OVERLAP);
        return (
          <Sequence key={i} from={from} durationInFrames={dur}>
            <SceneWrap idx={i} len={end - from}>
              <S start={from} />
            </SceneWrap>
          </Sequence>
        );
      })}
      <Chip />
      <ProgressBar starts={starts} total={durationInFrames} />
      <Subtitles />
    </AbsoluteFill>
  );
};
