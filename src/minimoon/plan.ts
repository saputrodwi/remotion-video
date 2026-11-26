import raw from "../captions.json";
import type {Caption} from "@remotion/captions";

export const FPS = 30;
export const captions = raw as Caption[];

export const norm = (t: string) =>
  t.trim().toLowerCase().replace(/[^\p{L}\p{N}-]/gu, "");

const similar = (a: string, b: string) =>
  a === b || (a.length >= 5 && b.length >= 5 && a.slice(0, 5) === b.slice(0, 5));

/**
 * Kalimat pertama tiap adegan (dari naskah). Batas adegan = timestamp kata pertama
 * kalimat tsb di captions.json (hasil whisper). Tidak ada tabel waktu hardcoded.
 */
export const SCENE_ANCHORS: string[][] = [
  ["berita", "hangat"], // 1 Hook
  ["astronom", "resmi"], // 2 Resmi
  ["ukurannya", "cuma"], // 3 Ukuran
  ["yang", "mengejutkan"], // 4 Jarak
  ["bulan", "mini", "adalah"], // 5 Definisi
  ["kronologinya", "begini"], // 6 Kronologi
  ["lucunya", "benda"], // 7 Twist
  ["para", "astronom"], // 8 Sementara
  ["ini", "bukan", "tamu"], // 9 Tamu lama
  ["pengen", "lihat"], // 10 Redup
  ["jadi", "bulan", "kedua"], // 11 Outro
];

export const msToFrame = (ms: number) => Math.round((ms / 1000) * FPS);

export const computeStarts = (): number[] => {
  const words = captions.map((c) => norm(c.text));
  const starts: number[] = [];
  let from = 0;
  SCENE_ANCHORS.forEach((anchor, si) => {
    let found = -1;
    for (let i = from; i < words.length; i++) {
      if (anchor.every((tok, k) => words[i + k] !== undefined && similar(words[i + k], tok))) {
        found = i;
        break;
      }
    }
    if (found < 0) throw new Error(`Anchor adegan ${si + 1} tidak ketemu di captions.json: ${anchor.join(" ")}`);
    starts.push(si === 0 ? 0 : msToFrame(captions[found].startMs));
    from = found + 1;
  });
  return starts;
};

/** Frame absolut kata pertama yang cocok (regex pada kata ternormalisasi) setelah frame `after`. */
export const cueAbs = (re: RegExp, after: number, fallback: number): number => {
  for (const c of captions) {
    const f = msToFrame(c.startMs);
    if (f >= after && re.test(norm(c.text))) return f;
  }
  return fallback;
};
