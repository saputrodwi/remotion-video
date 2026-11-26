// Jalankan LOKAL (bukan di CI): node scripts/transcribe.mjs
import path from "node:path";
import {execSync} from "node:child_process";
import {writeFileSync, existsSync, mkdirSync} from "node:fs";
import {installWhisperCpp, downloadWhisperModel, transcribe, toCaptions} from "@remotion/install-whisper-cpp";

const whisperPath = path.join(process.cwd(), "whisper.cpp");
const model = process.env.WHISPER_MODEL || "medium";
await installWhisperCpp({to: whisperPath, version: "1.5.5"});
await downloadWhisperModel({model, folder: whisperPath});
mkdirSync(".tmp", {recursive: true});
const wav16 = ".tmp/narration-16k.wav";
execSync(`ffmpeg -y -i public/narration.wav -ar 16000 -ac 1 ${wav16}`, {stdio: "inherit"});
const out = await transcribe({
  inputPath: wav16, whisperPath, model, tokenLevelTimestamps: true,
  language: "id", splitOnWord: true, whisperCppVersion: "1.5.5",
});
const {captions} = toCaptions({whisperCppOutput: out});
writeFileSync("src/captions.json", JSON.stringify(captions, null, 1));
console.log("captions:", captions.length);
