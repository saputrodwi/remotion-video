import React from "react";
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {abs, C, Confetti, Counter, Idle, makeAt, Pop, SceneProps, SceneWrap, Stamp, Title, Words, useDraw, useSp} from "./common";
import {ArrowGlyph, CheckBadge, Checker, Crown, Flipbook, Landscape, PhotoFrame, Sun} from "./art";

const cl = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
const ease = Easing.out(Easing.cubic);
const fmt = (v: number, d = 0) => v.toFixed(d).replace(".", ",");

const Panel: React.FC<{style: React.CSSProperties; children: React.ReactNode}> = ({style, children}) => (
  <div style={{background: "#fff", border: `8px solid ${C.navy}`, borderRadius: 44, boxShadow: `12px 12px 0 ${C.yellow}`, ...style}}>{children}</div>
);

/* 1. HOOK — foto squash-stretch mengecil, counter 2,4 -> 0,9 MB, stempel .JXL */
export const SceneHook: React.FC<SceneProps> = ({index, durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cfg = {damping: 8, stiffness: 90};
  const p = spring({frame: frame - 18, fps, config: cfg});
  const pPrev = spring({frame: frame - 19, fps, config: cfg});
  const v = (p - pPrev) * 14;
  const base = 1 - 0.38 * p;
  const stampDelay = 45;
  return (
    <SceneWrap index={index} durationInFrames={durationInFrames} shakes={[stampDelay + 6]}>
      <Title items={["FOTO", "MENYUSUT,"]} top={100} opaque />
      <Title items={["KUALITAS", "UTUH."]} top={240} color={C.coral} delay={6} opaque />
      <div style={abs(280, 440, 640, 480)}>
        <Idle mode="bob" period={46}>
          <div style={{transform: `scale(${base * (1 - v * 0.5)}, ${base * (1 + v * 0.5)})`}}>
            <Pop opaque s0={0.8}>
              <PhotoFrame width={640} height={480} uid="h" chip="FOTO" chipColor={C.purple} />
            </Pop>
          </div>
        </Idle>
      </div>
      <Pop opaque s0={0.8} style={abs(1120, 450, 680)}>
        <div style={{textAlign: "center", fontSize: 170, lineHeight: 1, color: C.navy, textShadow: `6px 6px 0 ${C.yellow}`}}>
          <Counter from={2.4} to={0.9} start={20} frames={34} decimals={1} suffix=" MB" />
        </div>
      </Pop>
      <div style={{...abs(1230, 690), padding: "0 44px", border: `12px dashed ${C.navy}`, borderRadius: 36, fontSize: 150, lineHeight: "170px", color: C.navy, opacity: 0.18}}>.JXL</div>
      <Stamp delay={stampDelay} rotate={-6} color={C.teal} style={{...abs(1230, 690), padding: "0 44px", fontSize: 150, lineHeight: "170px"}}>
        .JXL
      </Stamp>
    </SceneWrap>
  );
};

/* 2. ISO — stempel jatuh + shake, price tag Rp0 berayun */
export const SceneIso: React.FC<SceneProps> = ({index, durationInFrames}) => {
  const frame = useCurrentFrame();
  const sd = 8;
  const swing = Math.sin(frame / 13) * 12;
  return (
    <SceneWrap index={index} durationInFrames={durationInFrames} shakes={[sd + 7]}>
      <Title items={["RESMI", "&", "GRATIS"]} />
      <Stamp delay={sd} rotate={-5} drop={800} color={C.navy} style={{...abs(150, 430, 900, 420), textAlign: "center"}}>
        <div style={{fontSize: 120, lineHeight: "130px", paddingTop: 30}}>ISO</div>
        <div style={{fontSize: 200, lineHeight: "220px"}}>
          <Counter to={18181} start={0} frames={16} />
        </div>
      </Stamp>
      <Pop delay={22} y={-700} s0={0.9} style={abs(1250, 290, 420, 620)}>
        <div style={{transformOrigin: "210px 0px", transform: `rotate(${swing}deg)`, position: "relative", width: 420, height: 620}}>
          <svg width={420} height={620} viewBox="0 0 420 620" style={{position: "absolute", left: 0, top: 0}}>
            <path d="M210 0 V150" stroke={C.navy} strokeWidth="8" />
            <rect x="40" y="150" width="340" height="420" rx="44" fill={C.yellow} stroke={C.navy} strokeWidth="8" />
            <circle cx="210" cy="196" r="16" fill={C.cream} stroke={C.navy} strokeWidth="6" />
          </svg>
          <div style={{...abs(40, 280, 340), textAlign: "center", fontSize: 140, color: C.navy, lineHeight: 1}}>
            <Counter prefix="Rp" from={99} to={0} start={24} frames={28} />
          </div>
          <div style={{...abs(40, 440, 340), textAlign: "center", fontSize: 70, color: C.coral}}>GRATIS</div>
        </div>
      </Pop>
    </SceneWrap>
  );
};

/* 3. MORPH — JPEG -> JXL (-20%) lalu rewind, 100% identik */
export const SceneMorph: React.FC<SceneProps> = ({index, durationInFrames}) => {
  const at = makeAt(durationInFrames);
  const frame = useCurrentFrame();
  const swap = at(0.52);
  const flipP = interpolate(frame, [at(0.18), at(0.28), at(0.56), at(0.66)], [0, 1, 1, 0], {...cl, easing: Easing.inOut(Easing.cubic)});
  const bar = interpolate(frame, [at(0.28), at(0.44), at(0.56), at(0.66)], [100, 80, 80, 100], {...cl, easing: Easing.inOut(Easing.cubic)});
  const isJxl = flipP > 0.5;
  const scaleX = Math.max(0.02, Math.abs(Math.cos(flipP * Math.PI)));
  const stampDelay = at(0.74);
  const aO = interpolate(frame, [swap - 6, swap], [1, 0], cl);
  return (
    <SceneWrap index={index} durationInFrames={durationInFrames} shakes={[stampDelay + 6]}>
      <div style={{opacity: aO}}>
        <Title items={["JPEG", <ArrowGlyph key="a" size={110} />, "JXL:", <Counter key="c" prefix="−" suffix="%" to={20} start={at(0.28)} frames={at(0.16)} />]} size={120} />
      </div>
      {frame >= swap - 6 ? (
        <Title items={["BISA", "BALIK.", <Counter key="c2" to={100} suffix="%" start={swap} frames={20} />, "IDENTIK."]} size={118} delay={swap} />
      ) : null}
      <Pop delay={4} style={abs(680, 400, 560, 420)}>
        <Idle mode="bob" period={52}>
          <div style={{transform: `scaleX(${scaleX})`}}>
            {isJxl ? (
              <PhotoFrame width={560} height={420} uid="m2" chip="JXL" chipColor={C.teal} />
            ) : (
              <PhotoFrame width={560} height={420} uid="m1" blocky chip="JPEG" chipColor={C.coral} />
            )}
          </div>
        </Idle>
      </Pop>
      <Pop delay={10} style={{...abs(360, 860, 1200, 56), background: "rgba(26,43,76,0.1)", borderRadius: 28, overflow: "hidden", border: `5px solid ${C.navy}`}}>
        <div style={{width: `${bar}%`, height: "100%", background: isJxl ? C.teal : C.coral, borderRadius: 24}} />
      </Pop>
      <Pop delay={at(0.3)} y={80} style={abs(1290, 470, 480)}>
        <div style={{textAlign: "center", fontSize: 170, lineHeight: 1, color: C.teal, textShadow: `5px 5px 0 ${C.navy}`}}>
          {`−${fmt(100 - bar, 0)}%`}
        </div>
      </Pop>
      <Stamp delay={stampDelay} rotate={-10} color={C.green} style={{...abs(120, 460, 500), textAlign: "center", padding: "10px 0"}}>
        <div style={{fontSize: 110, lineHeight: "115px"}}><Counter to={100} suffix="%" start={stampDelay} frames={16} /></div>
        <div style={{fontSize: 90, lineHeight: "100px"}}>IDENTIK</div>
      </Stamp>
    </SceneWrap>
  );
};

/* 4. RACE BAR — JPEG 100% vs JXL 65%, JXL menang */
export const SceneRace: React.FC<SceneProps> = ({index, durationInFrames}) => {
  const at = makeAt(durationInFrames);
  const frame = useCurrentFrame();
  const TRACK = 1400;
  const v1 = interpolate(frame, [at(0.1), at(0.62)], [0, 100], {...cl, easing: ease});
  const v2 = interpolate(frame, [at(0.1), at(0.42)], [0, 65], {...cl, easing: ease});
  const win = at(0.45);
  const row = (top: number, label: string, color: string, v: number, delay: number, dark?: boolean) => (
    <>
      <Pop delay={delay} x={-300} style={{...abs(100, top + 30, 240, 160), background: color, color: dark ? C.navy : "#fff", border: `7px solid ${C.navy}`, borderRadius: 50, fontSize: 80, textAlign: "center", lineHeight: "146px"}}>
        {label}
      </Pop>
      <div style={{...abs(360, top, TRACK, 220), background: "rgba(26,43,76,0.08)", borderRadius: 110, border: `6px solid ${C.navy}`, overflow: "hidden"}}>
        <div style={{width: `${v}%`, minWidth: 200, height: "100%", background: color, borderRadius: 104, textAlign: "right", paddingRight: 40, fontSize: 110, lineHeight: "208px", color: dark ? C.navy : "#fff", boxSizing: "border-box"}}>
          {fmt(v, 0)}%
        </div>
      </div>
    </>
  );
  return (
    <SceneWrap index={index} durationInFrames={durationInFrames}>
      <Title items={["≈", <span key="m">−<Counter to={35} start={4} frames={24} />%</span>, "vs", "JPEG"]} />
      {row(320, "JPEG", C.coral, v1, 4)}
      {row(590, "JXL", C.teal, v2, 10)}
      <Pop delay={win} y={-200} s0={0.3} rotate={12} style={abs(1400, 640)}>
        <Idle mode="wiggle" period={30}><Crown size={230} /></Idle>
      </Pop>
      <Confetti start={win} cx={1330} cy={700} />
    </SceneWrap>
  );
};

/* 5. TIGA CHIP — HDR, TRANSPARAN, ANIMASI */
export const SceneFeatures: React.FC<SceneProps> = ({index, durationInFrames}) => {
  const at = makeAt(durationInFrames);
  const frame = useCurrentFrame();
  const shimmer = (frame % 60) / 60;
  const idx = Math.floor(frame / 5) % 6;
  const items: {label: string; icon: React.ReactNode}[] = [
    {label: "HDR", icon: <Sun size={290} rotation={frame * 2} />},
    {label: "TRANSPARAN", icon: <Checker size={270} shimmer={shimmer} />},
    {label: "ANIMASI", icon: <Flipbook size={290} idx={idx} />},
  ];
  return (
    <SceneWrap index={index} durationInFrames={durationInFrames}>
      <Title items={["BISA", "SEMUA", "INI"]} />
      {items.map((it, i) => {
        const d = at(0.08 + i * 0.24);
        return (
          <React.Fragment key={it.label}>
            <Pop delay={d} y={300} style={abs(210 + i * 520, 330, 460, 520)}>
              <Idle mode="bob" phase={i * 17} period={54}>
                <Panel style={{width: 460, height: 520, boxSizing: "border-box", textAlign: "center"}}>
                  <div style={{height: 300, display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 20}}>{it.icon}</div>
                  <div style={{fontSize: 62, color: C.navy, lineHeight: 1}}>{it.label}</div>
                </Panel>
              </Idle>
            </Pop>
            <Pop delay={d + 18} s0={0} style={abs(210 + i * 520 + 185, 745, 90, 90)}>
              <CheckBadge size={90} />
            </Pop>
          </React.Fragment>
        );
      })}
    </SceneWrap>
  );
};

/* 6. PROGRESSIVE — buram -> tajam, garis scan */
export const SceneProgressive: React.FC<SceneProps> = ({index, durationInFrames}) => {
  const frame = useCurrentFrame();
  const blurEnd = Math.round(durationInFrames * 0.7);
  const blur = interpolate(frame, [0, blurEnd], [24, 0], {...cl, easing: Easing.inOut(Easing.quad)});
  const scanY = (((frame / (durationInFrames * 0.45)) % 1) * 590);
  const scanOn = frame < blurEnd + 20;
  return (
    <SceneWrap index={index} durationInFrames={durationInFrames}>
      <Title items={["BURAM", <ArrowGlyph key="a" size={110} />, "TAJAM"]} />
      <Pop delay={4} style={abs(310, 290, 1300, 610)}>
        <Idle mode="bob" period={60}>
          <div style={{position: "relative", width: 1300, height: 610, borderRadius: 44, border: `10px solid ${C.navy}`, overflow: "hidden", boxShadow: `14px 14px 0 ${C.yellow}`, background: "#fff", boxSizing: "border-box"}}>
            <div style={{width: "100%", height: "100%", filter: `blur(${blur}px)`, transform: "scale(1.07)"}}>
              <Landscape width={1280} height={590} uid="p" />
            </div>
            {scanOn ? (
              <div style={{position: "absolute", left: 0, top: scanY, width: "100%", height: 10, background: "rgba(255,255,255,0.95)", boxShadow: "0 0 30px 12px rgba(255,255,255,0.7)"}} />
            ) : null}
            <div style={{position: "absolute", left: 28, bottom: 24, background: C.navy, color: C.yellow, fontSize: 64, borderRadius: 40, padding: "0 32px", lineHeight: "84px"}}>
              <Counter from={0} to={100} start={0} frames={blurEnd} suffix="%" />
            </div>
          </div>
        </Idle>
      </Pop>
    </SceneWrap>
  );
};

/* 7. OUTRO — dukungan browser, CTA, FOLLOW heartbeat */
const Dots: React.FC<{color: string}> = ({color}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{display: "flex", gap: 14}}>
      {[0, 1, 2].map((i) => {
        const s = 0.5 + 0.5 * Math.sin((frame - i * 5) / 5);
        return <div key={i} style={{width: 26, height: 26, borderRadius: 13, background: color, opacity: 0.35 + 0.65 * s, transform: `scale(${0.7 + 0.5 * s})`}} />;
      })}
    </div>
  );
};

const Compass: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    <circle cx="100" cy="100" r="86" fill="#fff" stroke={C.navy} strokeWidth="9" />
    <circle cx="100" cy="100" r="68" fill="#DDF3FF" stroke={C.navy} strokeWidth="4" />
    <path d="M100 100 L132 68 L110 110 Z" fill={C.coral} stroke={C.navy} strokeWidth="4" strokeLinejoin="round" />
    <path d="M100 100 L68 132 L90 90 Z" fill="#fff" stroke={C.navy} strokeWidth="4" strokeLinejoin="round" />
  </svg>
);

export const SceneOutro: React.FC<SceneProps> = ({index, durationInFrames}) => {
  const at = makeAt(durationInFrames);
  const frame = useCurrentFrame();
  const t = (frame % 36) / 36;
  const bump = (c: number, w: number) => Math.exp(-Math.pow((t - c) / w, 2));
  const beat = 1 + 0.1 * bump(0.1, 0.06) + 0.07 * bump(0.3, 0.06);
  const btn = useSp(at(0.6));
  return (
    <SceneWrap index={index} durationInFrames={durationInFrames} last>
      <Title items={["COBA", "JXL", "SEKARANG!"]} />
      <Pop delay={at(0.1)} y={300} style={abs(210, 310, 700, 400)}>
        <Idle mode="bob" period={56}>
          <Panel style={{width: 700, height: 400, boxSizing: "border-box", display: "flex", alignItems: "center", gap: 30, padding: "0 40px"}}>
            <Compass size={210} />
            <div>
              <div style={{fontSize: 100, color: C.navy, lineHeight: 1}}>SAFARI</div>
              <Pop delay={at(0.2)} s0={0} style={{marginTop: 18}}><CheckBadge size={120} /></Pop>
            </div>
          </Panel>
        </Idle>
      </Pop>
      <Pop delay={at(0.3)} y={300} style={abs(1010, 310, 700, 400)}>
        <Idle mode="bob" phase={20} period={56}>
          <Panel style={{width: 700, height: 400, boxSizing: "border-box", padding: "40px 50px", display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
            {["CHROME", "FIREFOX"].map((n, i) => (
              <div key={n} style={{display: "flex", alignItems: "center", justifyContent: "space-between", background: i ? "rgba(255,107,107,0.14)" : "rgba(108,92,231,0.14)", borderRadius: 30, padding: "0 36px", height: 140}}>
                <div style={{fontSize: 84, color: C.navy}}>{n}</div>
                <Dots color={i ? C.coral : C.purple} />
              </div>
            ))}
          </Panel>
        </Idle>
      </Pop>
      <div style={{...abs(680, 790, 560, 150), opacity: Math.min(1, btn * 3), transform: `scale(${(0.7 + 0.3 * btn) * beat})`}}>
        <div style={{width: "100%", height: "100%", background: C.coral, border: `8px solid ${C.navy}`, borderRadius: 80, boxShadow: `0 10px 0 ${C.navy}`, color: "#fff", fontSize: 100, textAlign: "center", lineHeight: "134px"}}>FOLLOW</div>
      </div>
    </SceneWrap>
  );
};
