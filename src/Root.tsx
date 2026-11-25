import React from "react";
import {Composition} from "remotion";
import {FunFacts} from "./FunFacts";

export const RemotionRoot: React.FC = () => (
  <Composition
    id="funfacts"
    component={FunFacts}
    width={1920}
    height={1080}
    fps={30}
    durationInFrames={1317}
  />
);

export default RemotionRoot;
