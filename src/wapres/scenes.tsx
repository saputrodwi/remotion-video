import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame} from "remotion";
import {abs, C, Confetti, Headline, makeAt, Pop, SceneProps, SceneWrap, useBounce, useDraw} from "./common";
import {ArrowRight, BallotBox, BigCross, Chair, Chat, CheckCircle, Doc, Envelope, Flag, Gavel, Palace, Parliament, Rice, Stethoscope} from "./icons";

const cl = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;

const Pill: React.FC<{children: React.ReactNode; bg?: string; color?: string; size?: number}> = ({children, bg = C.yellow, color = C.navy, size = 60}) => (
  <div style={{background: bg, color, border: `6px solid ${C.navy}`, borderRadius: 60, padding: "4px 40px", fontSize: size, display: "inline-block"}}>{children}</div>
);

/* Block 1 — Hook */
export const SceneHook: React.FC<SceneProps> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const q = Math.abs(Math.sin(frame / 7)) * 60;
  return (
    <SceneWrap durationInFrames={durationInFrames}>
      <AbsoluteFill style={{background: `linear-gradient(180deg, rgba(217,56,58,0.16) 0%, rgba(217,56,58,0.16) 50%, #FFFFFF 50%, #FFF8E7 100%)`}} />
      <Headline size={130} top={70} delay={0}>INDONESIA PILIH</Headline>
      <Headline size={130} top={230} delay={6} color={C.brick}>WAPRES BARU!</Headline>
      <Pop delay={12} y={800} style={abs(560, 470)}><Chair size={420} /></Pop>
      <Pop delay={24} s0={0} style={abs(1040, 440 - q)}>
        <div style={{fontSize: 420, lineHeight: 1, color: C.navy, textShadow: `10px 10px 0 ${C.yellow}`}}>?</div>
      </Pop>
    </SceneWrap>
  );
};

/* Block 2 — Gibran mundur */
export const SceneResign: React.FC<SceneProps> = ({durationInFrames}) => {
  const at = makeAt(durationInFrames);
  const frame = useCurrentFrame();
  const swap = at(0.55);
  const chairO = interpolate(frame, [swap - 10, swap], [1, 0], cl);
  const boxO = interpolate(frame, [swap, swap + 10], [0, 1], cl);
  return (
    <SceneWrap durationInFrames={durationInFrames}>
      <Headline size={120} top={60}>GIBRAN MUNDUR</Headline>
      <Pop delay={at(0.08)} y={-700} rotate={-6} style={{...abs(740, 230), width: 440, borderRadius: 30, background: "#fff", border: `8px solid ${C.navy}`, overflow: "hidden", boxShadow: `10px 10px 0 ${C.brick}`}}>
        <div style={{background: C.brick, color: C.cream, fontSize: 50, textAlign: "center"}}>NOV</div>
        <div style={{fontSize: 170, lineHeight: "170px", textAlign: "center", color: C.navy}}>12</div>
      </Pop>
      <div style={{...abs(760, 540), width: 400, height: 400, opacity: chairO}}><Chair size={400} /></div>
      <div style={{...abs(760, 540), width: 400, height: 400, opacity: boxO}}><BallotBox size={400} /></div>
      <Pop delay={swap} y={80} style={{...abs(0, 930), width: 1920, textAlign: "center"}}>
        <Pill bg={C.brick} color={C.cream} size={80}>KURSI KOSONG</Pill>
      </Pop>
    </SceneWrap>
  );
};

/* Block 3 — Proses pengajuan */
export const SceneProcess: React.FC<SceneProps> = ({durationInFrames}) => {
  const at = makeAt(durationInFrames);
  const a1 = useDraw(at(0.3), 14);
  const a2 = useDraw(at(0.6), 14);
  const node = (el: React.ReactNode, label: string, x: number, d: number) => (
    <Pop delay={d} style={{...abs(x, 370), width: 360, textAlign: "center", fontSize: 56, color: C.navy}}>
      {el}
      <div>{label}</div>
    </Pop>
  );
  return (
    <SceneWrap durationInFrames={durationInFrames}>
      <Headline size={92} top={60}>PRESIDEN AJUKAN 2 NAMA KE MPR</Headline>
      {node(<Palace size={300} />, "ISTANA", 90, at(0.1))}
      <div style={abs(470, 470)}><ArrowRight progress={a1} width={200} /></div>
      {node(<Envelope size={300} />, "2 NAMA", 780, at(0.35))}
      <div style={abs(1150, 470)}><ArrowRight progress={a2} width={200} /></div>
      {node(<Parliament size={300} />, "MPR", 1470, at(0.62))}
    </SceneWrap>
  );
};

/* Block 4 — Profil calon */
const Card: React.FC<{init: string; name: string; label: string; icon: React.ReactNode; x: number; delay: number; fromX: number}> = ({init, name, label, icon, x, delay, fromX}) => (
  <Pop delay={delay} x={fromX} s0={0.6} style={{...abs(x, 250), width: 700, height: 620, borderRadius: 48, background: "#fff", border: `8px solid ${C.navy}`, boxShadow: `14px 14px 0 ${C.yellow}`, textAlign: "center"}}>
    <div style={{margin: "40px auto 0", width: 220, height: 220, borderRadius: 110, background: C.navy, color: C.yellow, fontSize: 120, lineHeight: "220px", border: `8px solid ${C.brick}`}}>{init}</div>
    <div style={{fontSize: 78, color: C.navy, marginTop: 24, lineHeight: 1}}>{name}</div>
    <div style={{display: "inline-flex", alignItems: "center", gap: 12, marginTop: 24}}>
      {icon}
      <Pill size={52}>{label}</Pill>
    </div>
  </Pop>
);

export const SceneCandidates: React.FC<SceneProps> = ({durationInFrames}) => {
  const at = makeAt(durationInFrames);
  return (
    <SceneWrap durationInFrames={durationInFrames}>
      <Card init="AS" name="AMRAN SULAIMAN" label="Mentan" icon={<Rice size={110} />} x={110} delay={at(0.08)} fromX={-1000} />
      <Card init="S" name="SUGIONO" label="Gerindra" icon={<Flag size={110} />} x={1110} delay={at(0.35)} fromX={1000} />
      <Pop delay={at(0.55)} s0={0} rotate={-8} style={{...abs(800, 460), width: 320, height: 200, borderRadius: 100, background: C.brick, color: C.cream, border: `8px solid ${C.navy}`, fontSize: 130, textAlign: "center", lineHeight: "190px"}}>
        VS
      </Pop>
      <Confetti start={at(0.08) + 8} cx={460} cy={400} />
      <Confetti start={at(0.35) + 8} cx={1460} cy={400} />
    </SceneWrap>
  );
};

/* Block 5 — Verifikasi */
export const SceneVerify: React.FC<SceneProps> = ({durationInFrames}) => {
  const at = makeAt(durationInFrames);
  const row = (icon: React.ReactNode, text: string, y: number, d: number, dc: number) => {
    const ck = useBounce(dc);
    return (
      <>
        <Pop delay={d} x={-900} s0={0.8} style={{...abs(260, y), width: 1400, height: 260, borderRadius: 50, background: "#fff", border: `8px solid ${C.navy}`, boxShadow: `12px 12px 0 ${C.yellow}`, display: "flex", alignItems: "center", gap: 40, paddingLeft: 50, fontSize: 110, color: C.navy}}>
          {icon}{text}
        </Pop>
        <div style={{...abs(1530, y + 75), transform: `scale(${ck})`, opacity: Math.min(1, ck * 3)}}><CheckCircle size={170} /></div>
      </>
    );
  };
  return (
    <SceneWrap durationInFrames={durationInFrames}>
      {row(<Doc size={170} />, "CEK BERKAS", 200, at(0.08), at(0.3))}
      {row(<Stethoscope size={170} />, "CEK KESEHATAN", 560, at(0.5), at(0.75))}
    </SceneWrap>
  );
};

/* Block 6 — Perbedaan metode */
export const SceneMethod: React.FC<SceneProps> = ({durationInFrames}) => {
  const at = makeAt(durationInFrames);
  const cross = useDraw(at(0.3), 6); // coretan cepat = penekanan dramatis
  const arrow = useDraw(at(0.5), 14);
  return (
    <SceneWrap durationInFrames={durationInFrames}>
      <Pop delay={at(0.05)} style={{...abs(130, 220), width: 640, textAlign: "center", fontSize: 76, color: C.navy, lineHeight: 1}}>
        <div style={{position: "relative", width: 400, height: 400, margin: "0 auto 20px"}}>
          <BallotBox size={400} />
          <BigCross progress={cross} size={400} />
        </div>
        BUKAN COBLOS RAKYAT
      </Pop>
      <div style={abs(790, 400)}><ArrowRight progress={arrow} width={340} color={C.brick} /></div>
      <Pop delay={at(0.6)} s0={0.3} rotate={10} style={{...abs(1150, 220), width: 640, textAlign: "center", fontSize: 76, color: C.navy, lineHeight: 1}}>
        <div style={{margin: "0 auto 20px", width: 400}}><Gavel size={400} /></div>
        SIDANG PARIPURNA MPR
      </Pop>
    </SceneWrap>
  );
};

/* Block 7 — Jadwal & CTA */
export const SceneSchedule: React.FC<SceneProps> = ({durationInFrames}) => {
  const at = makeAt(durationInFrames);
  const ring = useDraw(at(0.3), 16);
  const days = ["SEN", "SEL", "RAB", "KAM", "JUM", "SAB", "MIN"];
  const cells: (number | null)[] = [null, ...Array.from({length: 31}, (_, i) => i + 1)]; // 1 Des 2026 = Selasa
  return (
    <SceneWrap durationInFrames={durationInFrames} last>
      <Headline size={96} top={40}>SIDANG: 11 DES 2026</Headline>
      <Pop delay={at(0.08)} y={400} style={{...abs(120, 220), width: 900, height: 780, borderRadius: 40, background: "#fff", border: `8px solid ${C.navy}`, boxShadow: `12px 12px 0 ${C.brick}`, overflow: "hidden"}}>
        <div style={{background: C.brick, color: C.cream, fontSize: 64, textAlign: "center", height: 90, lineHeight: "90px"}}>DESEMBER 2026</div>
        <div style={{display: "grid", gridTemplateColumns: "repeat(7, 1fr)", textAlign: "center", fontSize: 38, color: C.brick, padding: "10px 16px 0"}}>
          {days.map((d) => <div key={d}>{d}</div>)}
        </div>
        <div style={{display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gridAutoRows: 100, textAlign: "center", fontSize: 54, color: C.navy, padding: "0 16px", lineHeight: "100px"}}>
          {cells.map((c, i) => <div key={i}>{c}</div>)}
        </div>
      </Pop>
      {/* kolom 5 baris 2 (Jum 11): x = 120+16+ (868/7)*4 ..., y = 220+90+48+100*1 */}
      <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0}}>
        <ellipse cx={120 + 16 + (868 / 7) * 4.5} cy={220 + 90 + 48 + 150} rx="62" ry="54" fill="none" stroke={C.yellow} strokeWidth="14" pathLength={100} strokeDasharray={100} strokeDashoffset={(1 - ring) * 100} transform={`rotate(-8 ${120 + 16 + (868 / 7) * 4.5} ${220 + 90 + 48 + 150})`} />
      </svg>
      <Pop delay={at(0.5)} y={160} style={{...abs(1090, 300), width: 740, textAlign: "center", fontSize: 120, lineHeight: 1.05, color: C.navy, textShadow: `6px 6px 0 ${C.yellow}`}}>
        SIAPA<br />PILIHANMU?
      </Pop>
      <Pop delay={at(0.75)} s0={0} y={300} style={{...abs(1130, 700), background: C.brick, border: `8px solid ${C.navy}`, borderRadius: 70, padding: "10px 56px", fontSize: 80, color: C.cream, display: "flex", alignItems: "center", gap: 20}}>
        <Chat size={90} /> KOMENTAR
      </Pop>
    </SceneWrap>
  );
};
