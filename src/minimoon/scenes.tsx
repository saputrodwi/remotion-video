import React from "react";
import {Sequence, interpolate, random, useCurrentFrame, useVideoConfig} from "remotion";
import {
  Arrowhead, Badge, Car, Confetti, DrawPath, Earth, MorphRock, Moon, Pop, Probe, Rock, RowAt, Stamp, Sun, Telescope,
  Title, C, H, W, baloo, bob, clamp01, ease, fredoka, lerp, popAt, useCue, wig,
} from "./common";

type P = {start: number};

const dots = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const Full: React.FC<{children: React.ReactNode}> = ({children}) => (
  <svg width={W} height={H} style={{position: "absolute", inset: 0, overflow: "visible"}}>{children}</svg>
);

const At: React.FC<{x: number; y: number; rot?: number; scale?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({
  x, y, rot = 0, scale = 1, children, style,
}) => (
  <div style={{position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${scale})`, ...style}}>{children}</div>
);

const Label: React.FC<{text: string; size?: number; color?: string; weight?: 400 | 500 | 600; font?: string; style?: React.CSSProperties}> = ({
  text, size = 44, color = C.cream, weight = 600, font, style,
}) => (
  <div style={{fontFamily: font ?? fredoka, fontWeight: weight, fontSize: size, color, textShadow: "0 3px 0 rgba(0,0,0,0.3)", whiteSpace: "nowrap", ...style}}>{text}</div>
);

/* ============ 1. HOOK ============ */
export const S1: React.FC<P> = () => {
  const f = useCurrentFrame();
  const cx = 540, cy = 960, rx = 420, ry = 250, tilt = -14;
  const a = (tilt * Math.PI) / 180;
  const pt = (ang: number): [number, number] => {
    const x = rx * Math.cos(ang), y = ry * Math.sin(ang);
    return [cx + x * Math.cos(a) - y * Math.sin(a), cy + x * Math.sin(a) + y * Math.cos(a)];
  };
  const ang = 1 + f * 0.17;
  const behind = Math.sin(ang) < 0;
  const [rxp, ryp] = pt(ang);
  const draw = 1;
  const rockEl = (
    <>
      {[5, 4, 3, 2, 1].map((k) => {
        const [tx, ty] = pt(ang - k * 0.13);
        return <At key={k} x={tx} y={ty} scale={1 - k * 0.12} style={{opacity: 0.1 + 0.07 * (5 - k)}}><Rock size={86} /></At>;
      })}
      <At x={rxp} y={ryp} rot={f * 6}><Rock size={96} glow={C.yellow} /></At>
    </>
  );
  return (
    <>
      <Title text="BUMI PUNYA BULAN KEDUA?!" accent={["KEDUA"]} />
      <Full>
        <g transform={`rotate(${tilt} ${cx} ${cy})`}>
          <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke={C.yellow} strokeWidth={14} opacity={0.18 + 0.1 * Math.sin(f / 6)} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
          <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke={C.yellow} strokeWidth={6} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} style={{filter: `drop-shadow(0 0 12px ${C.yellow})`}} />
        </g>
      </Full>
      {behind && rockEl}
      <At x={cx} y={cy}><Pop><Earth size={400} spin={f * 0.5} /></Pop></At>
      {!behind && rockEl}
    </>
  );
};

/* ============ 2. RESMI ============ */
export const S2: React.FC<P> = ({start}) => {
  const f = useCurrentFrame();
  const cue = useCue(start);
  const cStamp = cue(/^resmi$/, 12);
  const cBadge = cue(/^sementara$/, 150);
  const cAst = cue(/^asteroid$/, 120);
  return (
    <>
      <Title text="TAMU BARU DI ORBIT BUMI" accent={["BARU"]} />
      <At x={540} y={740 + bob(f, 8)} rot={wig(f, 1.5)}>
        <Pop delay={4}>
          <div style={{width: 880, height: 440, borderRadius: 40, background: C.cream, border: `8px solid ${C.yellow}`, boxShadow: "0 18px 0 rgba(0,0,0,0.3)", padding: "34px 50px", boxSizing: "border-box", position: "relative"}}>
            <Label text="KARTU NAMA OBJEK" size={38} color="#6B6F8C" weight={500} />
            <Label text="2026 QQ8" size={168} color={C.navy} weight={600} font={baloo} style={{fontWeight: 800, lineHeight: 1.1, marginTop: 6}} />
            <div style={{height: 8, borderRadius: 4, background: C.teal, width: `${ease((f - 14) / 24) * 100}%`, marginTop: 8}} />
            <Label text="ASTEROID DEKAT BUMI" size={44} color="#2B7A64" style={{marginTop: 22}} />
          </div>
        </Pop>
      </At>
      <Stamp text="RESMI" at={cStamp} x={540} y={1050} rot={-8} size={118} />
      <RowAt top={1170}>{f >= cBadge - 4 ? <Badge text="SEMENTARA" blink bg={C.yellow} size={54} /> : <div style={{height: 80}} />}</RowAt>
      <RowAt top={1275}>{f >= cAst ? <Badge text="ASTEROID, BUKAN BULAN" bg={C.teal} size={40} delay={0} /> : null}</RowAt>
    </>
  );
};

/* ============ 3. UKURAN ============ */
export const S3: React.FC<P> = ({start}) => {
  const f = useCurrentFrame();
  const cue = useCue(start);
  const cCar = cue(/^1/, 4);
  const cMoon = cue(/^ribuan$/, 170);
  const pc = ease((f - cCar) / 40);
  const pm = ease((f - cMoon) / 50);
  return (
    <>
      <Title text="SEKECIL MOBIL?!" size={120} accent={["MOBIL?!"]} />
      <At x={540} y={880 + bob(f, 8)}><Pop delay={3}><Moon size={760} /></Pop></At>
      {/* QQ8: sengaja nyaris tak terlihat */}
      <Full>
        <circle cx={940} cy={560} r={5} fill={C.cream} opacity={0.35 + 0.25 * Math.sin(f / 7)} />
        <circle cx={940} cy={560} r={10 + ((f % 60) / 60) * 26} fill="none" stroke={C.cream} strokeWidth={2} opacity={0.4 * (1 - (f % 60) / 60)} />
      </Full>
      <At x={940} y={598}><Label text="QQ8?" size={30} color={C.cream} weight={500} style={{opacity: 0.45}} /></At>
      <div style={{position: "absolute", left: 80, top: 1262, display: "flex", alignItems: "center", gap: 18}}>
        <Pop delay={cCar}><div style={{transform: `translateY(${bob(f, 5, 40)}px)`}}><Car size={190} /></div></Pop>
        <Label text={`${Math.max(1, Math.round(pc))}–${Math.round(2 * pc)} m`} size={66} color={C.coral} font={baloo} style={{fontWeight: 800}} />
      </div>
      <div style={{position: "absolute", right: 80, top: 1274}}>
        <Label text={`${dots(3474 * pm)} km`} size={66} color={C.yellow} font={baloo} style={{fontWeight: 800}} />
      </div>
      <RowAt top={1286} style={{pointerEvents: "none"}}><Label text="VS" size={40} color={C.cream} weight={500} style={{opacity: 0.0}} /></RowAt>
    </>
  );
};

/* ============ 4. JARAK ============ */
export const S4: React.FC<P> = ({start}) => {
  const f = useCurrentFrame();
  const cue = useCue(start);
  const K = 0.001417, X0 = 150, Y = 720;
  const mx = X0 + 384400 * K, qx = X0 + 500000 * K;
  const cMoon = cue(/^bulan$/, 60);
  const cQ = cue(/^500$/, 120);
  const c384 = cue(/^384$/, 200);
  const cPark = cue(/^parkirnya$/, 330);
  const line = ease(f / 40);
  const pM = ease((f - cMoon) / 25);
  const pQ = ease((f - cQ) / 25);
  const n1 = 384400 * ease((f - c384) / 40);
  const n2 = 500000 * ease((f - cQ) / 50);
  return (
    <>
      <Title text="LEBIH JAUH DARI BULAN" size={104} accent={["JAUH"]} />
      <Full>
        <DrawPath d={`M${X0 + 60} ${Y} L${W - 70} ${Y}`} progress={line} stroke={C.cream} width={8} />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <line key={i} x1={X0 + i * 100000 * K} x2={X0 + i * 100000 * K} y1={Y - 14} y2={Y + 14} stroke={C.cream} strokeWidth={3} opacity={0.4 * line} />
        ))}
        <Arrowhead x={W - 62} y={Y} angle={0} color={C.cream} opacity={line} />
        <line x1={mx} x2={mx} y1={Y - 60} y2={Y - 96} stroke={C.yellow} strokeWidth={4} opacity={pM} />
        <line x1={qx} x2={qx} y1={Y + 40} y2={Y + 90} stroke={C.coral} strokeWidth={4} opacity={pQ} />
      </Full>
      <At x={130} y={Y}><Pop><Earth size={150} spin={f * 0.4} /></Pop></At>
      <At x={mx} y={Y} scale={pM}><Moon size={92} /></At>
      <At x={qx} y={Y + 2} scale={pQ} rot={f * 3}><Rock size={50} glow={C.coral} /></At>
      <div style={{position: "absolute", left: mx - 190, width: 380, top: Y - 215, textAlign: "center", opacity: pM}}>
        <Label text="BULAN" size={40} color={C.cream} weight={500} />
        <Label text={`${dots(n1)} km`} size={56} color={C.yellow} font={baloo} style={{fontWeight: 800}} />
      </div>
      <div style={{position: "absolute", left: qx - 230, width: 380, top: Y + 98, textAlign: "center", opacity: pQ}}>
        <Label text="QQ8" size={40} color={C.cream} weight={500} />
        <Label text={`>${dots(n2)} km`} size={56} color={C.coral} font={baloo} style={{fontWeight: 800}} />
      </div>
      <RowAt top={1000}>{f >= cPark - 6 ? <Badge text="PARKIR PALING BELAKANG" bg={C.coral} fg={C.navy} size={46} /> : <div style={{height: 76}} />}</RowAt>
      {f >= cPark - 6 && (
        <At x={540} y={1190 + bob(f, 6)} rot={wig(f, 2)}>
          <Pop delay={cPark}>
            <div style={{width: 150, height: 150, borderRadius: 26, background: "#2E6FD8", border: `8px solid ${C.cream}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: baloo, fontWeight: 800, fontSize: 118, color: C.cream, boxShadow: "0 10px 0 rgba(0,0,0,0.3)"}}>P</div>
          </Pop>
        </At>
      )}
    </>
  );
};

/* ============ 5. DEFINISI ============ */
export const S5: React.FC<P> = ({start}) => {
  const f = useCurrentFrame();
  const cue = useCue(start);
  const cx = 500, cy = 1010, rx = 390, ry = 220;
  const cOrb = cue(/^terjebak$/, 40);
  const cPull = cue(/^tarikan$/, 180);
  const orb = ease((f - cOrb) / 40);
  const tIn = clamp01(f / 120);
  const r = lerp(2.3, 1, ease(tIn));
  const th = -2.2 + f * 0.05 + (1 - tIn) * 2.2;
  const pull = ease((f - cPull) / 20) * (0.5 + 0.5 * Math.sin(f / 5));
  const sun = {x: 930, y: 740};
  let ax = cx + rx * r * Math.cos(th), ay = cy + ry * r * Math.sin(th);
  ax += (sun.x - ax) * 0.06 * pull;
  ay += (sun.y - ay) * 0.06 * pull;
  const showRays = f >= cPull;
  return (
    <>
      <Title text="ASTEROID YANG TERJEBAK SEMENTARA" size={100} accent={["TERJEBAK"]} />
      <Full>
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke={C.teal} strokeWidth={6} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - orb} style={{filter: `drop-shadow(0 0 10px ${C.teal})`}} />
        {showRays &&
          [0, 1, 2].map((i) => (
            <line key={i} x1={sun.x - 40} y1={sun.y + 20 + i * 12} x2={ax} y2={ay + (i - 1) * 8} stroke={C.yellow} strokeWidth={4} strokeDasharray="14 14" strokeDashoffset={-f * 3} opacity={0.35 + 0.4 * pull} />
          ))}
      </Full>
      <At x={cx} y={cy}><Pop><Earth size={290} spin={f * 0.4} /></Pop></At>
      <At x={sun.x} y={sun.y} scale={0.95}><Pop delay={6}><Sun size={190} f={f} /></Pop></At>
      <At x={ax} y={ay} rot={f * 5}><Rock size={92} glow={C.yellow} /></At>
      <div style={{position: "absolute", right: 70, top: 880, opacity: showRays ? 1 : 0}}>
        <Label text="TARIKAN MATAHARI" size={36} color={C.yellow} />
      </div>
      <RowAt top={1290}><Badge text="GRAVITASI BUMI" bg={C.teal} size={42} delay={cOrb} /></RowAt>
    </>
  );
};

/* ============ 6. KRONOLOGI ============ */
export const S6: React.FC<P> = ({start}) => {
  const f = useCurrentFrame();
  const cue = useCue(start);
  const rows = [
    {m: "APRIL", d: "Tertangkap gravitasi", re: /^april$/, fb: 40, y: 600},
    {m: "AGUSTUS", d: "Astronom Hungaria melihat", re: /^agustus$/, fb: 150, y: 890},
    {m: "OKTOBER", d: "Konfirmasi resmi", re: /^oktober$/, fb: 330, y: 1180},
  ].map((r) => ({...r, c: cue(r.re, r.fb)}));
  const x = 150;
  return (
    <>
      <Title text="KRONOLOGI" size={120} accent={["KRONOLOGI"]} />
      <Full>
        {rows.slice(0, 2).map((r, i) => (
          <DrawPath key={i} d={`M${x} ${r.y} L${x} ${rows[i + 1].y}`} progress={ease((f - rows[i + 1].c + 30) / 30)} stroke={C.yellow} width={8} glow />
        ))}
        <line x1={x} x2={x} y1={rows[0].y} y2={rows[2].y} stroke={C.cream} strokeWidth={6} opacity={0.2} />
        {rows.slice(0, 2).map((r, i) => (
          <DrawPath key={`b${i}`} d={`M${x} ${r.y} L${x} ${rows[i + 1].y}`} progress={ease((f - rows[i + 1].c + 30) / 30)} stroke={C.yellow} width={8} glow />
        ))}
      </Full>
      {rows.map((r, i) => {
        const lit = clamp01((f - r.c) / 10);
        const {scale} = popAt(f, 30, r.c, 8);
        return (
          <React.Fragment key={i}>
            <At x={x} y={r.y} scale={lit ? scale : 1}>
              <div style={{width: 76, height: 76, borderRadius: 38, border: `7px solid ${lit ? C.yellow : "rgba(255,248,231,0.4)"}`, background: lit ? C.yellow : C.navy, boxShadow: lit ? `0 0 34px ${C.yellow}` : "none"}} />
            </At>
            <div style={{position: "absolute", left: 230, top: r.y - 58, opacity: 0.45 + 0.55 * lit}}>
              <Label text={r.m} size={88} color={lit ? C.yellow : C.cream} font={baloo} style={{fontWeight: 800, lineHeight: 1}} />
              <Label text={r.d} size={46} color={C.cream} weight={500} style={{marginTop: 6}} />
            </div>
          </React.Fragment>
        );
      })}
      <At x={850} y={800 + bob(f, 8)} rot={wig(f, 3, 50)} style={{opacity: 0.4 + 0.6 * clamp01((f - rows[1].c) / 10)}}>
        <Telescope size={230} />
      </At>
    </>
  );
};

/* ============ 7. TWIST ============ */
export const S7: React.FC<P> = ({start}) => {
  const f = useCurrentFrame();
  const cue = useCue(start);
  const cSet = cue(/^setelah$/, 330);
  const cAlami = cue(/^alami$/, 380);
  const t = ease((f - (cSet + 6)) / 34);
  return (
    <>
      <Sequence durationInFrames={cSet + 6}><Title text="SAMPAH ROKET?" accent={["ROKET?"]} /></Sequence>
      <Sequence from={cSet + 6}><Title text="NYATANYA BATU ALAMI" accent={["ALAMI"]} /></Sequence>
      <At x={540} y={880 + bob(f, 8)} rot={t < 1 ? f * 0.6 * (1 - t) : wig(f, 2)}>
        <Pop><MorphRock size={800} t={t} /></Pop>
      </At>
      <Stamp text="ALAMI TULEN" at={cAlami} x={540} y={1190} rot={-8} size={104} color={C.teal} />
      <Confetti at={cAlami} x={540} y={900} />
    </>
  );
};

/* ============ 8. SEMENTARA ============ */
export const S8: React.FC<P> = ({start}) => {
  const f = useCurrentFrame();
  const cue = useCue(start);
  const cL = cue(/^lepas$/, 100);
  const cT = cue(/^tahun$/, 190);
  const ex = 300, ey = 1010, R = 230;
  const aL = -0.55;
  const sun = {x: 880, y: 640};
  const target = {x: 780, y: 700};
  const P0 = {x: ex + R * Math.cos(aL), y: ey + R * Math.sin(aL)};
  const leaving = f >= cL;
  let ax: number, ay: number;
  if (!leaving) {
    const ang = aL - (cL - f) * 0.06;
    ax = ex + R * Math.cos(ang);
    ay = ey + R * Math.sin(ang);
  } else {
    const q = ease((f - cL) / 90);
    ax = lerp(P0.x, target.x, q);
    ay = lerp(P0.y, target.y, q);
  }
  const gap = ease((f - cL) / 14) * 0.16;
  const draw = ease(f / 30);
  const dash = ease((f - cL) / 30);
  return (
    <>
      <Title text="SEMENTARA SAJA" accent={["SAJA"]} />
      <Full>
        <circle cx={ex} cy={ey} r={R} fill="none" stroke={C.teal} strokeWidth={6} pathLength={1} strokeDasharray={`${(1 - gap) * draw} ${1 - (1 - gap) * draw}`} transform={`rotate(${(aL * 180) / Math.PI + gap * 180} ${ex} ${ey})`} opacity={leaving ? 0.55 : 1} style={{filter: `drop-shadow(0 0 8px ${C.teal})`}} />
        {leaving && <path d={`M${P0.x} ${P0.y} L${lerp(P0.x, target.x, dash)} ${lerp(P0.y, target.y, dash)}`} stroke={C.yellow} strokeWidth={6} strokeDasharray="16 16" strokeDashoffset={-f * 2} strokeLinecap="round" />}
      </Full>
      <At x={ex} y={ey}><Pop><Earth size={280} spin={f * 0.4} /></Pop></At>
      <At x={sun.x} y={sun.y}><Pop delay={4}><Sun size={210} f={f} /></Pop></At>
      <At x={ax} y={ay} rot={f * 5}><Rock size={90} glow={C.yellow} /></At>
      <RowAt top={1190} style={{paddingLeft: 300}}>{f >= cT ? <Badge text="PERGI 2027" bg={C.coral} size={60} blink /> : <div style={{height: 84}} />}</RowAt>
    </>
  );
};

/* ============ 9. TAMU LAMA ============ */
export const S9: React.FC<P> = ({start}) => {
  const f = useCurrentFrame();
  const cue = useCue(start);
  const c4 = cue(/^4$/, 70);
  const cGone = cue(/^semuanya$/, 200);
  const n = Math.round(4 * ease((f - c4) / 24));
  const chips = ["2006 RH120", "2020 CD3", "2024 PT5"];
  const gone = ease((f - cGone) / 26);
  return (
    <>
      <Title text="TAMU LAMA" size={120} accent={["LAMA"]} />
      <At x={540} y={560 + bob(f, 8)} rot={wig(f, 2)}>
        <div style={{fontFamily: baloo, fontWeight: 800, fontSize: 340, lineHeight: 1, color: C.yellow, textShadow: `0 0 50px ${C.yellow}66, 0 10px 0 rgba(0,0,0,0.3)`}}>{n}</div>
      </At>
      <RowAt top={745}><Label text="BULAN MINI SEBELUMNYA" size={50} color={C.cream} /></RowAt>
      {chips.map((c, i) => {
        const at = c4 + 18 + i * 28;
        const {scale, opacity} = popAt(f, 30, at, 10);
        const vis = f >= at - 2;
        return (
          <RowAt key={c} top={850 + i * 150}>
            <div style={{opacity: vis ? opacity * (1 - 0.9 * gone) : 0, transform: `scale(${scale}) translateX(${gone * (i % 2 ? 90 : -90)}px)`, width: 780, height: 112, borderRadius: 56, background: "rgba(42,30,92,0.9)", border: `5px solid ${[C.teal, C.earth, C.coral][i]}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fredoka, fontWeight: 600, fontSize: 64, letterSpacing: 2, color: C.cream, boxShadow: `0 0 30px ${[C.teal, C.earth, C.coral][i]}55`}}>
              {c}
            </div>
          </RowAt>
        );
      })}
    </>
  );
};

/* ============ 10. REDUP ============ */
export const S10: React.FC<P> = ({start}) => {
  const f = useCurrentFrame();
  const cue = useCue(start);
  const cP = cue(/^wahana$/, 340);
  const cB = cue(/^murah$/, 400);
  const ph2 = ease((f - cP) / 14);
  const ph1 = 1 - ph2;
  const px = lerp(-300, W + 300, clamp01((f - cP) / 110));
  const py = 800 - Math.sin(clamp01((f - cP) / 110) * Math.PI) * 60;
  return (
    <>
      <Sequence durationInFrames={cP}><Title text="TERLALU REDUP" accent={["REDUP"]} /></Sequence>
      <Sequence from={cP}><Title text="TARGET RISET" accent={["RISET"]} /></Sequence>
      <div style={{opacity: ph1}}>
        <Full>
          <line x1={430} y1={1000} x2={830} y2={640} stroke={C.cream} strokeWidth={3} strokeDasharray="10 14" opacity={0.35} />
          <circle cx={840} cy={630} r={5} fill={C.cream} opacity={0.15 + 0.3 * Math.abs(Math.sin(f / 9))} />
          <circle cx={840} cy={630} r={20 + ((f % 50) / 50) * 20} fill="none" stroke={C.cream} strokeWidth={2} opacity={0.25 * (1 - (f % 50) / 50)} />
        </Full>
        <At x={330} y={1060 + bob(f, 6)} rot={wig(f, 5, 36)}><Pop><Telescope size={640} /></Pop></At>
        <At x={840} y={700}><Label text="???" size={40} color={C.cream} weight={500} style={{opacity: 0.5}} /></At>
      </div>
      {f >= cP - 2 && (
        <div style={{opacity: ph2}}>
          <At x={540} y={940 + bob(f, 6)} rot={f * 0.8}><Rock size={330} glow={C.yellow} /></At>
          <At x={px} y={py} rot={-6 + wig(f, 3, 30)}><Probe size={560} /></At>
        </div>
      )}
      <RowAt top={1180}>{f >= cB - 4 ? <Badge text="TARGET RISET MURAH" bg={C.coral} size={52} blink /> : <div style={{height: 84}} />}</RowAt>
    </>
  );
};

/* ============ 11. OUTRO ============ */
export const S11: React.FC<P> = ({start}) => {
  const f = useCurrentFrame();
  const cue = useCue(start);
  const cK = cue(/^kirim$/, 300);
  const cF = cue(/^ikuti$/, 420);
  const ex = 540, ey = 860;
  const conv = ease(f / 70);
  const beat = Math.pow(Math.max(0, Math.sin((f / 30) * Math.PI * 2 * 1.2)), 6);
  const fp = popAt(f, 30, cK + 6, 9);
  return (
    <>
      <Full>
        {Array.from({length: 40}).map((_, i) => {
          const ang = random(`oa${i}`) * Math.PI * 2;
          const d0 = 520 + random(`od${i}`) * 520;
          const d = lerp(d0, 150 + random(`oe${i}`) * 120, conv);
          const r = 2 + random(`or${i}`) * 4;
          return <circle key={i} cx={ex + Math.cos(ang) * d} cy={ey + Math.sin(ang) * d * 1.1} r={r} fill={i % 3 ? C.cream : C.yellow} opacity={0.5 + 0.5 * Math.sin(f / 6 + i)} />;
        })}
        {[0, 1, 2].map((i) => {
          const p = ((f + i * 24) % 72) / 72;
          return <circle key={i} cx={ex} cy={ey} r={250 + p * 230} fill="none" stroke={i % 2 ? C.teal : C.earth} strokeWidth={8 * (1 - p)} opacity={0.7 * (1 - p)} />;
        })}
      </Full>
      <At x={ex} y={ey + bob(f, 6)}><Pop><Earth size={470} spin={f * 0.5} /></Pop></At>
      <Sequence durationInFrames={cK}><Title text="HANYA MAMPIR SEBENTAR" accent={["MAMPIR"]} /></Sequence>
      <Sequence from={cK}><Title text="KIRIM KE TEMANMU!" size={110} accent={["TEMANMU!"]} /></Sequence>
      <RowAt top={1196}>
        <div style={{opacity: f >= cK + 6 ? fp.opacity : 0, transform: `scale(${(f >= cK + 6 ? fp.scale : 0.8) * (1 + 0.09 * beat)})`, width: 480, height: 124, borderRadius: 62, background: C.coral, color: C.cream, display: "flex", alignItems: "center", justifyContent: "center", gap: 16, fontFamily: baloo, fontWeight: 800, fontSize: 72, letterSpacing: 3, boxShadow: `0 0 ${30 + 30 * beat}px ${C.coral}aa, 0 10px 0 rgba(0,0,0,0.3)`}}>
          <span style={{fontSize: 80, lineHeight: 1}}>＋</span>FOLLOW
        </div>
      </RowAt>
    </>
  );
};

export const SCENES = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11];
