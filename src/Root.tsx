import React from "react";
import {CalculateMetadataFunction, Composition, staticFile} from "remotion";
import {FunFacts} from "./funfacts/FunFacts";
import {Wapres, WapresProps} from "./wapres/Wapres";
import {planFromWav} from "./wapres/audio";

const FPS = 30;

const calculateMetadata: CalculateMetadataFunction<WapresProps> = async () => {
  const res = await fetch(staticFile("wapres-narration.wav"));
  const plan = planFromWav(await res.arrayBuffer(), FPS);
  return {durationInFrames: plan.durationInFrames, props: {starts: plan.starts}};
};

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="funfacts"
      component={FunFacts}
      width={1920}
      height={1080}
      fps={FPS}
      durationInFrames={1317}
    />
    <Composition
      id="wapres"
      component={Wapres}
      width={1920}
      height={1080}
      fps={FPS}
      durationInFrames={900} // placeholder, ditimpa calculateMetadata
      defaultProps={{starts: [0, 100, 300, 450, 700, 900, 1050]}}
      calculateMetadata={calculateMetadata}
    />
  </>
);

export default RemotionRoot;
