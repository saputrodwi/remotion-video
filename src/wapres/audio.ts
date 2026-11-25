/**
 * Analisis WAV tanpa dependensi: baca header -> durasi persis, lalu cari jeda napas
 * (RMS rendah) untuk menentukan awal tiap block. Target awal block dihitung
 * proporsional dari bobot suku kata, lalu di-"snap" ke jeda terdekat.
 */
export const BLOCK_WEIGHTS = [8, 14, 16, 20, 12, 16, 14]; // estimasi suku kata per block

export type AudioPlan = {durationInFrames: number; starts: number[]};

const MIN_BLOCK_SEC = 2.5;
const WIN = 0.02;

export const planFromWav = (
  buf: ArrayBuffer,
  fps: number,
  weights: number[] = BLOCK_WEIGHTS
): AudioPlan => {
  const dv = new DataView(buf);
  let pos = 12;
  let fmt = 1, ch = 1, sr = 24000, bits = 16, dataOff = 0, dataLen = 0;
  while (pos + 8 <= dv.byteLength) {
    const id = String.fromCharCode(
      dv.getUint8(pos), dv.getUint8(pos + 1), dv.getUint8(pos + 2), dv.getUint8(pos + 3)
    );
    const size = dv.getUint32(pos + 4, true);
    if (id === "fmt ") {
      fmt = dv.getUint16(pos + 8, true);
      ch = dv.getUint16(pos + 10, true);
      sr = dv.getUint32(pos + 12, true);
      bits = dv.getUint16(pos + 22, true);
    } else if (id === "data") {
      dataOff = pos + 8;
      dataLen = Math.min(size, dv.byteLength - dataOff);
      break;
    }
    pos += 8 + size + (size % 2);
  }
  const bps = bits / 8;
  const totalSamples = Math.floor(dataLen / (bps * ch));
  const duration = totalSamples / sr;

  const sample = (i: number): number => {
    const o = dataOff + i * ch * bps;
    if (fmt === 3) return bits === 32 ? dv.getFloat32(o, true) : dv.getFloat64(o, true);
    if (bits === 16) return dv.getInt16(o, true) / 32768;
    if (bits === 24) return ((dv.getUint8(o) | (dv.getUint8(o + 1) << 8) | (dv.getInt8(o + 2) << 16)) / 8388608);
    if (bits === 32) return dv.getInt32(o, true) / 2147483648;
    return (dv.getUint8(o) - 128) / 128;
  };

  const winSamples = Math.max(1, Math.floor(sr * WIN));
  const rms: number[] = [];
  for (let s = 0; s + winSamples <= totalSamples; s += winSamples) {
    let acc = 0, n = 0;
    for (let i = s; i < s + winSamples; i += 4) {
      const v = sample(i);
      acc += v * v;
      n++;
    }
    rms.push(Math.sqrt(acc / n));
  }
  const peak = Math.max(...rms, 1e-6);
  const th = peak * 0.04;

  const pauses: {start: number; end: number; len: number}[] = [];
  let run = -1;
  for (let i = 0; i <= rms.length; i++) {
    const quiet = i < rms.length && rms[i] < th;
    if (quiet && run < 0) run = i;
    if (!quiet && run >= 0) {
      const len = (i - run) * WIN;
      const start = run * WIN;
      if (len >= 0.25 && start > 0.5 && start < duration - 0.8) {
        pauses.push({start, end: i * WIN, len});
      }
      run = -1;
    }
  }

  const total = weights.reduce((a, b) => a + b, 0);
  let acc = 0;
  const times = [0];
  for (let k = 0; k < weights.length - 1; k++) {
    acc += weights[k];
    const target = (acc / total) * duration;
    let best = target;
    let bestScore = -Infinity;
    for (const p of pauses) {
      const mid = (p.start + p.end) / 2;
      const dist = Math.abs(mid - target);
      if (dist > duration * 0.06) continue;
      const score = p.len - dist * 0.15;
      if (score > bestScore) {
        bestScore = score;
        best = Math.max(p.start, p.end - 0.1); // animasi masuk tepat sebelum narator mulai
      }
    }
    const prev = times[times.length - 1];
    times.push(Math.max(best, prev + MIN_BLOCK_SEC));
  }
  return {
    durationInFrames: Math.ceil(duration * fps),
    starts: times.map((t) => Math.round(t * fps)),
  };
};
