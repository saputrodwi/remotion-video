import React from "react";
import {CalculateMetadataFunction, Composition, staticFile} from "remotion";
import {FunFacts} from "./funfacts/FunFacts";
import {Wapres, WapresProps} from "./wapres/Wapres";
import {planFromWav} from "./wapres/audio";
import {getAudioData, getAudioDurationInSeconds} from "@remotion/media-utils";
import {JxlInfo, JxlProps} from "./jxl/JxlInfo";
import {planFromSamples} from "./jxl/audio";
import {Minimoon, MinimoonProps} from "./minimoon/Minimoon";
import {computeStarts} from "./minimoon/plan";

const FPS = 30;

const calculateMetadata: CalculateMetadataFunction<WapresProps> = async () => {
  const res = await fetch(staticFile("wapres-narration.wav"));
  const plan = planFromWav(await res.arrayBuffer(), FPS);
  return {durationInFrames: plan.durationInFrames, props: {starts: plan.starts}};
};

// jxl-info: durasi & batas adegan 100% dari audio (tanpa tabel hardcoded)
const jxlMetadata: CalculateMetadataFunction<JxlProps> = async () => {
  const src = staticFile("jxl-narration.wav");
  const seconds = await getAudioDurationInSeconds(src);
  const data = await getAudioData(src);
  const plan = planFromSamples(data.channelWaveforms[0], data.sampleRate, FPS, seconds);
  return {durationInFrames: plan.durationInFrames, props: {starts: plan.starts}};
};

// minimoon-reel: durasi 100% dari audio, batas adegan dari captions.json (whisper lokal)
const minimoonMetadata: CalculateMetadataFunction<MinimoonProps> = async () => {
  const seconds = await getAudioDurationInSeconds(staticFile("narration.wav"));
  return {durationInFrames: Math.ceil(seconds * FPS), props: {starts: computeStarts()}};
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
    <Composition
      id="jxl-info"
      component={JxlInfo}
      width={1920}
      height={1080}
      fps={FPS}
      durationInFrames={1300} // placeholder, ditimpa calculateMetadata
      defaultProps={{starts: [0, 160, 310, 590, 770, 930, 1120]}}
      calculateMetadata={jxlMetadata}
    />
    <Composition
      id="minimoon-reel"
      component={Minimoon}
      width={1080}
      height={1920}
      fps={FPS}
      durationInFrames={4179} // placeholder, ditimpa calculateMetadata
      defaultProps={{starts: computeStarts()}}
      calculateMetadata={minimoonMetadata}
    />
  </>
);

export default RemotionRoot;
