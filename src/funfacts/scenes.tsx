import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame} from "remotion";
import {C, Confetti, Pop, SceneProps, SceneWrap, Stamp, Title, useBounce} from "./common";
import {
  ArrowDown, Banana, Check, Crown, Cross, Heart, Jar, Octopus,
  Pyramid, Shark, Strawberry, Tree, Venus,
} from "./icons";

const abs = (left: number, top: number): React.CSSProperties => ({position: "absolute", left, top});

/* Scene 1 — Hook (0–75) */
export const Scene1: React.FC<SceneProps> = ({durationInFrames}) => (
  <SceneWrap durationInFrames={durationInFrames} wipe={false}>
    <Title size={170} top={90} delay={0}>MADU NGGAK</Title>
    <Title size={170} top={270} delay={8}>PERNAH BASI?!</Title>
    <Pop delay={14} y={900} style={abs(750, 560)}>
      <Jar size={420} />
    </Pop>
  </SceneWrap>
);

/* Scene 2 — Madu Kuno (75–270) */
export const Scene2: React.FC<SceneProps> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const wobble = (start: number) =>
    Math.sin((frame - start) / 3) * 10 * Math.max(0, 1 - (frame - start) / 70);
  return (
    <SceneWrap durationInFrames={durationInFrames}>
      <Title size={100} top={60} delay={10}>RIBUAN TAHUN. MASIH ENAK.</Title>
      <Pop delay={0} x={-1000} s0={0.9} style={abs(40, 420)}>
        <Pyramid size={820} />
      </Pop>
      <Pop delay={25} rotate={wobble(25)} style={abs(960, 290)}>
        <Jar size={400} />
      </Pop>
      <Pop
        delay={40}
        rotate={wobble(40)}
        style={{...abs(940, 740), background: C.yellow, border: `6px solid ${C.ink}`, borderRadius: 60, padding: "6px 44px", fontSize: 64, color: C.ink}}
      >
        ribuan tahun
      </Pop>
      <Pop
        delay={75}
        style={{...abs(1400, 330), width: 380, height: 380, borderRadius: 190, background: C.purple, color: C.cream, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 130, border: `8px solid ${C.ink}`}}
      >
        3000+
      </Pop>
      <Confetti start={75} cx={1590} cy={520} />
    </SceneWrap>
  );
};

/* Scene 3 — Gurita (270–450) */
const Pulse: React.FC<{phase: number; x: number; y: number; size: number}> = ({phase, x, y, size}) => {
  const frame = useCurrentFrame();
  const p = Math.max(0, Math.sin(((frame - phase) / 30) * Math.PI * 2));
  return (
    <div style={{...abs(x - size / 2, y - size / 2), opacity: 0.3 + 0.7 * p, transform: `scale(${1 + 0.25 * p})`}}>
      <Heart size={size} />
    </div>
  );
};

export const Scene3: React.FC<SceneProps> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const bob = Math.sin(frame / 12) * 12;
  const label = (text: string, x: number, y: number, delay: number) => (
    <Pop delay={delay} style={{...abs(x, y), background: C.yellow, border: `5px solid ${C.ink}`, borderRadius: 40, padding: "2px 34px", fontSize: 56, color: C.ink}}>
      {text}
    </Pop>
  );
  return (
    <SceneWrap durationInFrames={durationInFrames}>
      <Title size={110} top={50}>GURITA = 3 JANTUNG</Title>
      <Pop delay={5} y={500} style={{...abs(710, 260 + bob)}}>
        <Octopus size={500} />
      </Pop>
      <Pulse phase={0} x={960} y={420} size={110} />
      <Pulse phase={10} x={850} y={540} size={90} />
      <Pulse phase={20} x={1070} y={540} size={90} />
      <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0}}>
        <g stroke={C.ink} strokeWidth="5" strokeDasharray="12 10" strokeLinecap="round">
          <line x1="560" y1="560" x2="800" y2="545" />
          <line x1="1360" y1="560" x2="1120" y2="545" />
          <line x1="1330" y1="360" x2="1020" y2="410" />
        </g>
      </svg>
      {label("insang", 340, 520, 50)}
      {label("insang", 1330, 520, 60)}
      {label("tubuh", 1300, 300, 70)}
    </SceneWrap>
  );
};

/* Scene 4 — Hiu vs Pohon (450–615) */
export const Scene4: React.FC<SceneProps> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const swim = Math.sin(frame / 8) * 35;
  const marker = (x: number, color: string, delay: number) => (
    <Pop delay={delay} style={{...abs(x - 24, 676), width: 48, height: 48, borderRadius: 24, background: color, border: `6px solid ${C.ink}`}} />
  );
  const tag = (text: string, x: number, delay: number, color: string) => (
    <Pop delay={delay} style={{...abs(x - 160, 760), width: 320, textAlign: "center", fontSize: 60, color}}>
      {text}
    </Pop>
  );
  return (
    <SceneWrap durationInFrames={durationInFrames}>
      <Title size={130} top={50} delay={5}>HIU &gt; POHON?</Title>
      <div style={{...abs(180, 694), width: 1560, height: 14, borderRadius: 7, background: C.ink}} />
      {marker(520, C.purple, 15)}
      {marker(1400, C.coral, 40)}
      <div style={{...abs(520 - 190 + swim, 400)}}>
        <Pop delay={10} x={-800}>
          <Shark size={380} />
        </Pop>
      </div>
      <Pop delay={40} y={-700} style={abs(1400 - 180, 330)}>
        <Tree size={360} />
      </Pop>
      {tag("DULUAN", 520, 25, C.purple)}
      {tag("TELAT", 1400, 55, C.coral)}
      <Stamp delay={95} rotate={-8} color={C.coral} style={{...abs(560, 880), fontSize: 100}}>
        SENIOR SEJATI
      </Stamp>
    </SceneWrap>
  );
};

/* Scene 5 — Pisang & Stroberi (615–825) */
export const Scene5: React.FC<SceneProps> = ({durationInFrames}) => (
  <SceneWrap durationInFrames={durationInFrames}>
    <div style={{...abs(960, 180), width: 8, height: 780, background: C.ink, opacity: 0.15, borderRadius: 4}} />
    <Title size={84} top={50}>PISANG = BERI. STROBERI ≠ BERI.</Title>
    <Pop delay={10} x={-600} style={abs(270, 330)}>
      <Banana size={420} />
    </Pop>
    <Pop delay={45} y={-400} style={abs(380, 190)}>
      <Crown size={200} />
    </Pop>
    <Pop
      delay={60}
      style={{...abs(250, 800), background: C.yellow, border: `6px solid ${C.ink}`, borderRadius: 50, padding: "0 36px", fontSize: 74, color: C.ink, display: "flex", alignItems: "center", gap: 10}}
    >
      BERI <Check size={64} />
    </Pop>
    <Pop delay={20} x={600} style={abs(1230, 330)}>
      <Strawberry size={420} />
    </Pop>
    <Stamp delay={95} rotate={-12} drop={700} color="#E03131" style={{...abs(1230, 740), fontSize: 80, display: "flex", alignItems: "center", gap: 10}}>
      BUKAN <Cross size={64} color="#E03131" />
    </Stamp>
  </SceneWrap>
);

/* Scene 6 — Venus (825–1065) */
const Calendar: React.FC = () => {
  const frame = useCurrentFrame();
  const day = (Math.floor(frame / 3) % 30) + 1;
  const phase = (frame % 3) / 3;
  const flip = 0.3 + 0.7 * Math.abs(Math.cos(phase * Math.PI));
  return (
    <div style={{width: 480, height: 460, borderRadius: 36, background: "#fff", border: `8px solid ${C.ink}`, overflow: "hidden", boxShadow: `12px 12px 0 ${C.purple}`}}>
      <div style={{height: 100, background: C.coral, color: C.cream, fontSize: 64, textAlign: "center", lineHeight: "100px"}}>HARI</div>
      <div style={{fontSize: 250, textAlign: "center", lineHeight: "340px", color: C.ink, transform: `scaleY(${flip})`}}>{day}</div>
    </div>
  );
};

export const Scene6: React.FC<SceneProps> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const sub = useBounce(120);
  return (
    <SceneWrap durationInFrames={durationInFrames}>
      <Title size={96} top={50} delay={10}>1 HARI VENUS &gt; 1 TAHUN BUMI</Title>
      <Pop delay={0} x={-700} style={abs(240, 280)}>
        <Venus size={540} rotation={frame * 0.25} />
      </Pop>
      <Pop delay={30} x={700} style={abs(1100, 310)}>
        <Calendar />
      </Pop>
      <div style={{...abs(0, 900), width: 1920, textAlign: "center", fontSize: 62, color: C.purple, opacity: sub, transform: `translateY(${(1 - sub) * 60}px)`}}>
        ...akhir pekanmu kapan tiba?
      </div>
    </SceneWrap>
  );
};

/* Scene 7 — Outro (1065–1290) */
export const Scene7: React.FC<SceneProps> = ({durationInFrames}) => {
  const icons: {el: React.ReactNode; fx: number; fy: number}[] = [
    {el: <Jar size={230} />, fx: -1200, fy: -700},
    {el: <Octopus size={250} />, fx: 0, fy: -900},
    {el: <Shark size={270} />, fx: 1200, fy: -700},
    {el: <Banana size={250} />, fx: -1200, fy: 700},
    {el: <Venus size={240} />, fx: 0, fy: 900},
    {el: <Tree size={250} />, fx: 1200, fy: 700},
  ];
  return (
    <SceneWrap durationInFrames={durationInFrames}>
      {icons.map((ic, i) => (
        <Pop
          key={i}
          delay={i * 5}
          x={ic.fx}
          y={ic.fy}
          style={{...abs(70 + (i % 3) * 310, 230 + Math.floor(i / 3) * 360), width: 290, height: 330, display: "flex", alignItems: "center", justifyContent: "center"}}
        >
          {ic.el}
        </Pop>
      ))}
      <Pop delay={40} y={200} style={{...abs(1000, 220), width: 840, textAlign: "center", fontSize: 130, lineHeight: 1.05, color: C.ink, textShadow: `6px 6px 0 ${C.yellow}`}}>
        FAKTA<br />FAVORITMU?
      </Pop>
      <Pop delay={70} style={{...abs(1000, 600), width: 840, display: "flex", justifyContent: "center", alignItems: "center", gap: 16, fontSize: 64, color: C.purple}}>
        Tulis di komentar <ArrowDown size={70} />
      </Pop>
      <Pop delay={110} s0={0} y={300} style={{...abs(1220, 790), background: C.coral, border: `8px solid ${C.ink}`, borderRadius: 70, padding: "6px 80px", fontSize: 90, color: C.cream}}>
        FOLLOW
      </Pop>
      <Confetti start={135} cx={1420} cy={560} count={60} />
    </SceneWrap>
  );
};
