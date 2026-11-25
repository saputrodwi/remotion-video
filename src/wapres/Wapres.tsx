import React from "react";
import {AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig} from "remotion";
import {C, FONT, OVERLAP, SceneProps} from "./common";
import {SceneCandidates, SceneHook, SceneMethod, SceneProcess, SceneResign, SceneSchedule, SceneVerify} from "./scenes";

export type WapresProps = {starts: number[]};

const SCENES: React.FC<SceneProps>[] = [SceneHook, SceneResign, SceneProcess, SceneCandidates, SceneVerify, SceneMethod, SceneSchedule];

export const Wapres: React.FC<WapresProps> = ({starts}) => {
  const {durationInFrames: total} = useVideoConfig();
  return (
    <AbsoluteFill style={{backgroundColor: C.cream, fontFamily: FONT}}>
      <Audio src={staticFile("wapres-narration.wav")} />
      <Sequence from={0} durationInFrames={total}>
        {SCENES.map((Scene, i) => {
          const from = starts[i];
          const end = i === SCENES.length - 1 ? total : starts[i + 1] + OVERLAP;
          return (
            <Sequence key={i} from={from} durationInFrames={Math.max(1, end - from)}>
              <Scene durationInFrames={end - from} />
            </Sequence>
          );
        })}
      </Sequence>
    </AbsoluteFill>
  );
};
