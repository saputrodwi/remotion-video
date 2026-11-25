/**
 * Timing 100% dari audio: envelope RMS per window 20ms, jeda hening
 * (< -35dB dari puncak, minimal 220ms) dipakai sebagai batas antar 7 adegan.
 * Fallback bila jumlah jeda tidak pas 6: target proporsional jumlah kata,
 * lalu di-snap ke jeda terdekat (kalau tidak ada, pakai target murni).
 */
export const WORD_COUNTS = [12, 12, 23, 15, 12, 14, 15];

export type JxlPlan = {durationInFrames: number; starts: number[]};

const WIN_SEC = 0.02;
const THRESH_DB = -35;
const MIN_PAUSE_SEC = 0.22;
const MIN_SCENE_SEC = 2;
const LEAD_SEC = 0.1; // adegan baru mulai sedikit sebelum narator bicara lagi

type Pause = {start: number; end: number; len: number};

export const findPauses = (samples: Float32Array, sampleRate: number): {pauses: Pause[]; duration: number} => {
  const duration = samples.length / sampleRate;
  const win = Math.max(1, Math.floor(sampleRate * WIN_SEC));
  const rms: number[] = [];
  for (let s = 0; s + win <= samples.length; s += win) {
    let acc = 0;
    for (let i = s; i < s + win; i++) acc += samples[i] * samples[i];
    rms.push(Math.sqrt(acc / win));
  }
  const peak = Math.max(...rms, 1e-9);
  const th = peak * Math.pow(10, THRESH_DB / 20);
  const pauses: Pause[] = [];
  let run = -1;
  for (let i = 0; i <= rms.length; i++) {
    const quiet = i < rms.length && rms[i] < th;
    if (quiet && run < 0) run = i;
    if (!quiet && run >= 0) {
      const start = run * WIN_SEC;
      const end = i * WIN_SEC;
      // abaikan hening di ujung awal/akhir file (bukan batas adegan)
      if (end - start >= MIN_PAUSE_SEC && start > 0.3 && end < duration - 0.3) {
        pauses.push({start, end, len: end - start});
      }
      run = -1;
    }
  }
  return {pauses, duration};
};

export const planFromSamples = (
  samples: Float32Array,
  sampleRate: number,
  fps: number,
  durationSec?: number,
  words: number[] = WORD_COUNTS
): JxlPlan => {
  const {pauses, duration: d0} = findPauses(samples, sampleRate);
  const duration = durationSec ?? d0;
  const n = words.length;
  let times: number[];

  if (pauses.length === n - 1) {
    times = [0, ...pauses.map((p) => Math.max(p.start, p.end - LEAD_SEC))];
  } else {
    const total = words.reduce((a, b) => a + b, 0);
    let acc = 0;
    times = [0];
    for (let k = 0; k < n - 1; k++) {
      acc += words[k];
      const target = (acc / total) * duration;
      let best = target;
      let bestScore = -Infinity;
      for (const p of pauses) {
        const dist = Math.abs((p.start + p.end) / 2 - target);
        if (dist > duration * 0.06) continue;
        const score = p.len - dist * 0.15;
        if (score > bestScore) {
          bestScore = score;
          best = Math.max(p.start, p.end - LEAD_SEC);
        }
      }
      times.push(best);
    }
  }
  // paksa urut naik dengan jarak minimal
  for (let k = 1; k < times.length; k++) times[k] = Math.max(times[k], times[k - 1] + MIN_SCENE_SEC);
  return {
    durationInFrames: Math.ceil(duration * fps),
    starts: times.map((t) => Math.round(t * fps)),
  };
};
