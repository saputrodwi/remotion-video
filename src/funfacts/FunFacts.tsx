import React from "react";
import {AbsoluteFill, Audio, Sequence, staticFile} from "remotion";
import {C, FONT, SceneProps} from "./common";
import {Scene1, Scene2, Scene3, Scene4, Scene5, Scene6, Scene7} from "./scenes";

const SCENES: {C: React.FC<SceneProps>; from: number; durationInFrames: number}[] = [
  {C: Scene1, from: 0, durationInFrames: 75},
  {C: Scene2, from: 75, durationInFrames: 195},
  {C: Scene3, from: 270, durationInFrames: 180},
  {C: Scene4, from: 450, durationInFrames: 165},
  {C: Scene5, from: 615, durationInFrames: 210},
  {C: Scene6, from: 825, durationInFrames: 240},
  {C: Scene7, from: 1065, durationInFrames: 252},
];

export const FunFacts: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: C.cream, fontFamily: FONT}}>
    <Audio src={staticFile("funfacts-narration.wav")} />
    {SCENES.map(({C: Scene, from, durationInFrames}) => (
      <Sequence key={from} from={from} durationInFrames={durationInFrames}>
        <Scene from={from} durationInFrames={durationInFrames} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
