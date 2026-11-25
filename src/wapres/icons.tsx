import React from "react";
import {C} from "./common";

type I = {size?: number};
const S = {stroke: C.navy, strokeWidth: 6, strokeLinejoin: "round", strokeLinecap: "round"} as const;

export const Chair: React.FC<I> = ({size = 400}) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    <rect x="50" y="20" width="100" height="95" rx="14" fill={C.brick} {...S} />
    <rect x="62" y="34" width="76" height="67" rx="8" fill="#E86163" />
    <rect x="42" y="110" width="116" height="30" rx="10" fill={C.brick} {...S} />
    <path d="M56 140 V186 M144 140 V186" {...S} />
  </svg>
);

export const BallotBox: React.FC<I> = ({size = 400}) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    <rect x="30" y="70" width="140" height="110" rx="12" fill={C.cream} {...S} />
    <rect x="30" y="70" width="140" height="22" rx="8" fill={C.navy} {...S} />
    <rect x="70" y="40" width="60" height="12" rx="4" fill={C.yellow} {...S} transform="rotate(-6 100 46)" />
    <path d="M62 82 H138" stroke={C.yellow} strokeWidth="6" strokeLinecap="round" />
    <circle cx="100" cy="135" r="20" fill={C.brick} {...S} />
  </svg>
);

export const Palace: React.FC<I> = ({size = 300}) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    <path d="M100 18 V44" {...S} />
    <path d="M100 18 H128 V32 H100 Z" fill={C.brick} {...S} />
    <path d="M30 80 L100 44 L170 80 Z" fill={C.cream} {...S} />
    <rect x="34" y="80" width="132" height="14" fill={C.yellow} {...S} />
    <g fill={C.cream} {...S}>
      <rect x="44" y="96" width="16" height="64" /><rect x="76" y="96" width="16" height="64" />
      <rect x="108" y="96" width="16" height="64" /><rect x="140" y="96" width="16" height="64" />
    </g>
    <rect x="28" y="160" width="144" height="22" rx="4" fill={C.navy} {...S} />
  </svg>
);

export const Envelope: React.FC<I> = ({size = 300}) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    <rect x="25" y="55" width="150" height="100" rx="12" fill={C.cream} {...S} />
    <path d="M28 62 L100 114 L172 62" fill="none" {...S} />
    <circle cx="100" cy="114" r="14" fill={C.brick} {...S} />
  </svg>
);

export const Parliament: React.FC<I> = ({size = 300}) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    <path d="M56 100 A44 44 0 0 1 144 100 Z" fill={C.navy} {...S} />
    <path d="M100 38 V56" {...S} />
    <rect x="24" y="100" width="152" height="18" fill={C.yellow} {...S} />
    <g fill={C.cream} {...S}>
      <rect x="34" y="118" width="18" height="48" /><rect x="70" y="118" width="18" height="48" />
      <rect x="112" y="118" width="18" height="48" /><rect x="148" y="118" width="18" height="48" />
    </g>
    <rect x="20" y="166" width="160" height="18" rx="4" fill={C.navy} {...S} />
  </svg>
);

export const Rice: React.FC<I> = ({size = 120}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M50 94 C50 60 52 40 56 8" fill="none" stroke={C.navy} strokeWidth="5" strokeLinecap="round" />
    {[16, 30, 44, 58].map((y, i) => (
      <g key={y}>
        <ellipse cx={42 - i * 1} cy={y + 8} rx="6" ry="12" fill={C.yellow} stroke={C.navy} strokeWidth="3" transform={`rotate(-30 ${42 - i} ${y + 8})`} />
        <ellipse cx={64 + i * 1} cy={y} rx="6" ry="12" fill={C.yellow} stroke={C.navy} strokeWidth="3" transform={`rotate(30 ${64 + i} ${y})`} />
      </g>
    ))}
  </svg>
);

export const Flag: React.FC<I> = ({size = 120}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M24 92 V10" stroke={C.navy} strokeWidth="6" strokeLinecap="round" />
    <path d="M24 14 Q50 4 76 16 V52 Q50 40 24 52 Z" fill={C.brick} stroke={C.navy} strokeWidth="5" strokeLinejoin="round" />
    <circle cx="50" cy="32" r="8" fill={C.yellow} />
  </svg>
);

export const Doc: React.FC<I> = ({size = 160}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M24 8 H62 L78 24 V92 H24 Z" fill="#fff" {...S} strokeWidth={5} />
    <path d="M62 8 V24 H78" fill="none" {...S} strokeWidth={5} />
    <path d="M34 42 H68 M34 56 H68 M34 70 H56" stroke={C.navy} strokeWidth="5" strokeLinecap="round" />
  </svg>
);

export const Stethoscope: React.FC<I> = ({size = 160}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M24 12 V40 A16 16 0 0 0 56 40 V12" fill="none" {...S} strokeWidth={6} />
    <path d="M40 56 V66 A18 18 0 0 0 76 66 V58" fill="none" {...S} strokeWidth={6} />
    <circle cx="76" cy="50" r="9" fill={C.yellow} {...S} strokeWidth={5} />
    <circle cx="24" cy="12" r="4" fill={C.navy} /><circle cx="56" cy="12" r="4" fill={C.navy} />
  </svg>
);

export const Gavel: React.FC<I> = ({size = 400}) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    <rect x="40" y="130" width="120" height="28" rx="8" fill={C.navy} {...S} />
    <g transform="rotate(-35 100 80)">
      <rect x="60" y="40" width="80" height="44" rx="10" fill={C.brick} {...S} />
      <rect x="94" y="84" width="12" height="80" rx="5" fill="#B07A4A" {...S} />
    </g>
  </svg>
);

export const CheckCircle: React.FC<I> = ({size = 110}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="42" fill="#2FB36D" {...S} strokeWidth={5} />
    <path d="M28 52 L44 68 L72 34" fill="none" stroke="#fff" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Chat: React.FC<I> = ({size = 90}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M14 18 H86 V66 H44 L24 86 V66 H14 Z" fill={C.cream} stroke={C.navy} strokeWidth="6" strokeLinejoin="round" />
    <path d="M30 36 H70 M30 50 H56" stroke={C.navy} strokeWidth="6" strokeLinecap="round" />
  </svg>
);

/** Panah kanan yang tergambar sesuai progress 0..1. */
export const ArrowRight: React.FC<{progress: number; width?: number; color?: string}> = ({progress, width = 200, color = C.navy}) => (
  <svg width={width} height={90} viewBox="0 0 200 90">
    <path d="M10 45 H182 M150 15 L184 45 L150 75" pathLength={100} fill="none" stroke={color} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={100} strokeDashoffset={(1 - progress) * 100} />
  </svg>
);

/** Coretan silang merah, tergambar sesuai progress 0..1. */
export const BigCross: React.FC<{progress: number; size?: number}> = ({progress, size = 400}) => {
  const p1 = Math.min(1, progress * 2);
  const p2 = Math.max(0, progress * 2 - 1);
  const st = {fill: "none", stroke: C.brick, strokeWidth: 22, strokeLinecap: "round", strokeDasharray: 100} as const;
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={{position: "absolute", left: 0, top: 0}}>
      <path d="M30 30 L170 170" pathLength={100} {...st} strokeDashoffset={(1 - p1) * 100} />
      <path d="M170 30 L30 170" pathLength={100} {...st} strokeDashoffset={(1 - p2) * 100} />
    </svg>
  );
};
