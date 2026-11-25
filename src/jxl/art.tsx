import React from "react";
import {C} from "./common";

const S = {stroke: C.navy, strokeWidth: 6, strokeLinejoin: "round", strokeLinecap: "round"} as const;

/** Pemandangan: gunung, matahari, danau. Ukuran fleksibel (rasio 4:3). */
export const Landscape: React.FC<{width: number; height: number; uid: string; blocky?: boolean}> = ({width, height, uid, blocky}) => (
  <svg width={width} height={height} viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" style={{display: "block"}}>
    <defs>
      <linearGradient id={`sky${uid}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#8FD3FF" /><stop offset="1" stopColor="#FFE9B0" />
      </linearGradient>
      <linearGradient id={`lake${uid}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#4FB3E8" /><stop offset="1" stopColor="#1F7FBF" />
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill={`url(#sky${uid})`} />
    <circle cx="300" cy="80" r="34" fill={C.yellow} />
    <path d="M0 200 L90 90 L160 170 L230 70 L330 200 Z" fill="#6C7A9C" />
    <path d="M90 90 L110 118 L96 112 L84 124 Z M230 70 L254 104 L238 98 L224 112 Z" fill="#fff" />
    <path d="M0 210 L120 130 L220 210 Z" fill="#3E8E6B" />
    <rect y="200" width="400" height="100" fill={`url(#lake${uid})`} />
    <path d="M40 235 H120 M180 255 H300 M260 225 H340" stroke="#fff" strokeOpacity="0.6" strokeWidth="5" strokeLinecap="round" />
    {blocky ? (
      <g stroke={C.navy} strokeOpacity="0.14" strokeWidth="1.5">
        {new Array(24).fill(0).map((_, i) => <path key={`v${i}`} d={`M${i * 17} 0 V300`} />)}
        {new Array(18).fill(0).map((_, i) => <path key={`h${i}`} d={`M0 ${i * 17} H400`} />)}
      </g>
    ) : null}
  </svg>
);

export const PhotoFrame: React.FC<{width: number; height: number; uid: string; blocky?: boolean; chip?: string; chipColor?: string}> = ({width, height, uid, blocky, chip, chipColor = C.coral}) => (
  <div style={{position: "relative", width, height, borderRadius: 36, border: `10px solid ${C.navy}`, overflow: "hidden", background: "#fff", boxShadow: `14px 14px 0 ${C.yellow}`}}>
    <Landscape width={width - 20} height={height - 20} uid={uid} blocky={blocky} />
    {chip ? (
      <div style={{position: "absolute", left: 20, top: 16, background: chipColor, color: "#fff", fontSize: 60, padding: "0 28px", borderRadius: 40, border: `5px solid ${C.navy}`, lineHeight: "76px"}}>{chip}</div>
    ) : null}
  </div>
);

export const Crown: React.FC<{size?: number}> = ({size = 180}) => (
  <svg width={size} height={size * 0.7} viewBox="0 0 200 140">
    <path d="M20 120 L10 40 L65 80 L100 20 L135 80 L190 40 L180 120 Z" fill="#FFC300" {...S} />
    <circle cx="10" cy="40" r="9" fill={C.coral} {...S} /><circle cx="100" cy="20" r="9" fill={C.coral} {...S} /><circle cx="190" cy="40" r="9" fill={C.coral} {...S} />
  </svg>
);

export const ArrowGlyph: React.FC<{size: number; color?: string; progress?: number}> = ({size, color = C.navy, progress = 1}) => (
  <svg width={size * 1.1} height={size * 0.7} viewBox="0 0 110 70">
    <path d="M6 35 H98 M72 10 L100 35 L72 60" pathLength={100} fill="none" stroke={color} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={100} strokeDashoffset={(1 - progress) * 100} />
  </svg>
);

export const CheckBadge: React.FC<{size?: number}> = ({size = 110}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="44" fill={C.green} {...S} strokeWidth={5} />
    <path d="M27 52 L44 69 L74 33" fill="none" stroke="#fff" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Sun: React.FC<{size: number; rotation: number}> = ({size, rotation}) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    <g transform={`rotate(${rotation} 100 100)`} stroke={C.coral} strokeWidth="12" strokeLinecap="round">
      {new Array(12).fill(0).map((_, i) => (
        <path key={i} d="M100 14 V40" transform={`rotate(${i * 30} 100 100)`} />
      ))}
    </g>
    <circle cx="100" cy="100" r="48" fill={C.yellow} {...S} />
  </svg>
);

export const Checker: React.FC<{size: number; shimmer: number}> = ({size, shimmer}) => {
  const n = 8, cell = size / n;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{borderRadius: 24, border: `6px solid ${C.navy}`, background: "#fff"}}>
      <defs>
        <linearGradient id="shm" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" /><stop offset="0.5" stopColor="#fff" stopOpacity="0.85" /><stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <clipPath id="chk"><rect width={size} height={size} rx="18" /></clipPath>
      </defs>
      <g clipPath="url(#chk)">
        {new Array(n * n).fill(0).map((_, i) => {
          const x = i % n, y = Math.floor(i / n);
          return <rect key={i} x={x * cell} y={y * cell} width={cell} height={cell} fill={(x + y) % 2 ? "#D5DAE6" : "#fff"} />;
        })}
        <circle cx={size / 2} cy={size / 2} r={size * 0.28} fill={C.purple} fillOpacity="0.9" stroke={C.navy} strokeWidth="6" />
        <rect x={shimmer * size * 2 - size} y={-size * 0.2} width={size * 0.5} height={size * 1.4} fill="url(#shm)" transform={`rotate(20 ${size / 2} ${size / 2})`} />
      </g>
    </svg>
  );
};

export const Flipbook: React.FC<{size: number; idx: number}> = ({size, idx}) => {
  const ys = [0.2, 0.45, 0.68, 0.78, 0.68, 0.45]; // posisi bola per frame (loop 6 frame)
  return (
    <svg width={size} height={size} viewBox="0 0 200 200">
      <rect x="10" y="10" width="180" height="130" rx="18" fill="#fff" {...S} strokeWidth={5} />
      <circle cx="100" cy={10 + ys[idx] * 130} r="22" fill={C.coral} {...S} strokeWidth={5} />
      {new Array(6).fill(0).map((_, i) => (
        <rect key={i} x={14 + i * 30} y="156" width="24" height="30" rx="5" fill={i === idx ? C.yellow : "#fff"} stroke={C.navy} strokeWidth="4" />
      ))}
    </svg>
  );
};
