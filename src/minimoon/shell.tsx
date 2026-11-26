import React, {useEffect, useMemo, useState} from "react";
import {continueRender, delayRender, random, useCurrentFrame, useVideoConfig} from "remotion";
import {measureText} from "@remotion/layout-utils";
import type {Caption} from "@remotion/captions";
import {C, H, W, baloo, clamp01, fontsReady, fredoka} from "./common";
import {captions, msToFrame} from "./plan";

/* ================= BACKGROUND ================= */

const STAR_LAYERS = [
  {n: 70, r: 1.6, speed: 0.12, tw: 0.04, op: 0.55},
  {n: 45, r: 2.6, speed: 0.28, tw: 0.06, op: 0.75},
  {n: 26, r: 3.8, speed: 0.55, tw: 0.08, op: 0.95},
];

export const Background: React.FC = () => {
  const f = useCurrentFrame();
  const stars = useMemo(
    () =>
      STAR_LAYERS.map((L, li) =>
        Array.from({length: L.n}).map((_, i) => ({
          x: random(`sx${li}-${i}`) * W,
          y: random(`sy${li}-${i}`) * H,
          ph: random(`sp${li}-${i}`) * 6.28,
          warm: random(`sw${li}-${i}`) > 0.8,
        }))
      ),
    []
  );
  const parts = useMemo(
    () =>
      Array.from({length: 10}).map((_, i) => ({
        x: random(`px${i}`) * W,
        y: random(`py${i}`) * H,
        r: 5 + random(`pr${i}`) * 7,
        sp: 0.5 + random(`ps${i}`) * 0.9,
        amp: 20 + random(`pa${i}`) * 40,
        ph: random(`pph${i}`) * 6.28,
      })),
    []
  );
  return (
    <div style={{position: "absolute", inset: 0, background: `radial-gradient(120% 90% at 50% 20%, ${C.indigo}55 0%, ${C.navy} 60%)`, overflow: "hidden"}}>
      <div
        style={{
          position: "absolute",
          width: 1100,
          height: 1100,
          left: -380 + Math.sin(f / 150) * 70,
          top: 120 + Math.cos(f / 190) * 80,
          borderRadius: "50%",
          background: "radial-gradient(circle, #5B4FD6 0%, rgba(91,79,214,0) 68%)",
          opacity: 0.12 * 3.2,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1000,
          height: 1000,
          left: 480 + Math.cos(f / 170) * 80,
          top: 900 + Math.sin(f / 130) * 90,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.teal} 0%, rgba(6,214,160,0) 68%)`,
          opacity: 0.12 * 2.2,
        }}
      />
      <svg width={W} height={H} style={{position: "absolute", inset: 0}}>
        {STAR_LAYERS.map((L, li) =>
          stars[li].map((s, i) => {
            const y = (((s.y - f * L.speed) % H) + H) % H;
            const tw = 0.55 + 0.45 * Math.sin(f * L.tw + s.ph);
            return <circle key={`${li}-${i}`} cx={s.x} cy={y} r={L.r} fill={s.warm ? C.yellow : C.cream} opacity={L.op * tw} />;
          })
        )}
        {parts.map((p, i) => {
          const y = (((p.y - f * p.sp) % (H + 100)) + H + 100) % (H + 100) - 50;
          const x = p.x + Math.sin(f / 60 + p.ph) * p.amp;
          return <circle key={i} cx={x} cy={y} r={p.r} fill={i % 2 ? C.teal : C.cream} opacity={0.28} />;
        })}
      </svg>
    </div>
  );
};

/* ================= PERSISTENT ================= */

export const Chip: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        top: 112,
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "10px 26px",
        borderRadius: 999,
        background: "rgba(11,16,38,0.7)",
        border: `3px solid ${C.teal}`,
        fontFamily: fredoka,
        fontWeight: 600,
        fontSize: 40,
        color: C.cream,
      }}
    >
      <span style={{width: 16, height: 16, borderRadius: 8, background: C.teal, opacity: 0.6 + 0.4 * Math.sin(f / 8), boxShadow: `0 0 12px ${C.teal}`}} />
      2026 QQ8
    </div>
  );
};

export const ProgressBar: React.FC<{starts: number[]; total: number}> = ({starts, total}) => {
  const f = useCurrentFrame();
  const n = starts.length;
  const gap = 8;
  const segW = (W - 140 - gap * (n - 1)) / n;
  return (
    <div style={{position: "absolute", left: 70, top: 1620, width: W - 140, height: 12, display: "flex", gap}}>
      {starts.map((s, i) => {
        const e = i + 1 < n ? starts[i + 1] : total;
        const p = clamp01((f - s) / Math.max(1, e - s));
        return (
          <div key={i} style={{width: segW, height: 12, borderRadius: 6, background: "rgba(255,248,231,0.2)", overflow: "hidden"}}>
            <div style={{width: `${p * 100}%`, height: "100%", background: i === n - 1 ? C.coral : C.yellow, borderRadius: 6}} />
          </div>
        );
      })}
    </div>
  );
};

/* ================= SUBTITLE ================= */

const FS = 62;
const MAX_W = Math.round(W * 0.88); // 88% layar
const PAD_X = 38;
const LINE_W = MAX_W - PAD_X * 2;

type Cue = {lines: Caption[][]; startMs: number; endMs: number};

const widthOf = (text: string) =>
  measureText({text, fontFamily: fredoka, fontSize: FS, fontWeight: "600"}).width;

const wrapLines = (ws: Caption[]): Caption[][] => {
  const lines: Caption[][] = [];
  let cur: Caption[] = [];
  for (const w of ws) {
    const t = [...cur, w].map((x) => x.text).join("").trim();
    if (cur.length && widthOf(t) > LINE_W) {
      lines.push(cur);
      cur = [w];
    } else cur.push(w);
  }
  if (cur.length) lines.push(cur);
  return lines;
};

/** Cue = kalimat; bila kalimat > 2 baris, dipecah (pilih koma terdekat) agar tetap maksimal 2 baris. */
export const buildCues = (): Cue[] => {
  const sentences: Caption[][] = [];
  let cur: Caption[] = [];
  for (const c of captions) {
    cur.push(c);
    if (/[.?!]["”]?\s*$/.test(c.text)) {
      sentences.push(cur);
      cur = [];
    }
  }
  if (cur.length) sentences.push(cur);

  const cues: Cue[] = [];
  const push = (ws: Caption[]) =>
    cues.push({lines: wrapLines(ws), startMs: ws[0].startMs, endMs: ws[ws.length - 1].endMs});

  for (const s of sentences) {
    let rest = s;
    while (rest.length) {
      if (wrapLines(rest).length <= 2) {
        push(rest);
        break;
      }
      // cari prefix terpanjang yang muat 2 baris
      let k = rest.length - 1;
      while (k > 1 && wrapLines(rest.slice(0, k)).length > 2) k--;
      // utamakan pecah di koma jika ada di paruh akhir prefix
      let cut = k;
      for (let j = k; j >= Math.ceil(k * 0.5); j--) {
        if (/[,;:]$/.test(rest[j - 1].text.trim())) {
          cut = j;
          break;
        }
      }
      push(rest.slice(0, cut));
      rest = rest.slice(cut);
    }
  }
  return cues;
};

export const Subtitles: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const [cues, setCues] = useState<Cue[] | null>(null);
  const [handle] = useState(() => delayRender("subtitle cues", {timeoutInMilliseconds: 60000}));
  useEffect(() => {
    fontsReady().then(() => {
      setCues(buildCues());
      continueRender(handle);
    });
  }, [handle]);
  if (!cues) return null;
  const t = (f / fps) * 1000;
  let idx = -1;
  for (let i = 0; i < cues.length; i++) {
    const next = cues[i + 1]?.startMs ?? Infinity;
    const endShow = Math.min(cues[i].endMs + 350, next);
    if (t >= cues[i].startMs - 80 && t < endShow) idx = i;
  }
  if (idx < 0) return null;
  const cue = cues[idx];
  const age = clamp01((t - (cue.startMs - 80)) / 160);
  return (
    <div style={{position: "absolute", left: 0, width: W, top: 1380, height: 200, display: "flex", justifyContent: "center", alignItems: "center"}}>
      <div
        style={{
          maxWidth: MAX_W,
          padding: `18px ${PAD_X}px`,
          borderRadius: 48,
          background: "rgba(11,16,38,0.74)",
          border: "2px solid rgba(255,248,231,0.12)",
          fontFamily: fredoka,
          fontWeight: 600,
          fontSize: FS,
          lineHeight: 1.16,
          textAlign: "center",
          color: C.cream,
          opacity: 0.4 + 0.6 * age,
          transform: `translateY(${(1 - age) * 10}px)`,
        }}
      >
        {cue.lines.map((line, li) => (
          <div key={li} style={{whiteSpace: "nowrap"}}>
            {line.map((w, wi) => {
              const active = t >= w.startMs && (t < w.endMs || (wi === line.length - 1 && false));
              const spoken = t >= w.endMs;
              const nextStart = (() => {
                const all = cue.lines.flat();
                const i = all.indexOf(w);
                return all[i + 1]?.startMs ?? Infinity;
              })();
              const lit = active || (spoken && t < nextStart && t < w.endMs + 120);
              return (
                <span
                  key={wi}
                  style={{
                    color: lit ? C.yellow : C.cream,
                    textShadow: lit ? `0 0 22px ${C.yellow}aa` : "none",
                  }}
                >
                  {w.text}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
