import React from "react";
import {C} from "./common";

type I = {size?: number};
const S = {stroke: C.ink, strokeWidth: 6, strokeLinejoin: "round", strokeLinecap: "round"} as const;

export const Jar: React.FC<I & {label?: string}> = ({size = 300, label = "MADU"}) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    <rect x="55" y="14" width="90" height="28" rx="9" fill={C.coral} {...S} />
    <rect x="42" y="38" width="116" height="148" rx="32" fill="#FFB627" {...S} />
    <path d="M45 74 H155 V88 q-9 22 -19 0 q-10 28 -22 0 q-10 18 -20 0 q-10 24 -20 0 q-8 10 -9 0 z" fill={C.yellow} />
    <rect x="64" y="108" width="72" height="46" rx="10" fill={C.cream} {...S} />
    <text x="100" y="140" textAnchor="middle" fontSize="26" fill={C.ink} style={{fontFamily: "inherit"}}>
      {label}
    </text>
  </svg>
);

export const Pyramid: React.FC<I> = ({size = 700}) => (
  <svg width={size} height={size * 0.6} viewBox="0 0 420 250">
    <circle cx="350" cy="52" r="30" fill={C.yellow} {...S} />
    <path d="M20 230 L190 30 L360 230 Z" fill="#F4C95D" {...S} />
    <path d="M190 30 L360 230 L190 230 Z" fill="#E0A93B" />
    <path d="M20 230 L190 30 L360 230 Z" fill="none" {...S} />
    <path d="M110 140 H270 M70 185 H310" stroke={C.ink} strokeWidth="4" opacity="0.4" />
    <path d="M260 230 L330 140 L405 230 Z" fill="#F4C95D" {...S} />
    <path d="M0 230 H420" {...S} />
  </svg>
);

export const Octopus: React.FC<I> = ({size = 500}) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    <g fill="none" stroke={C.purple} strokeWidth="20" strokeLinecap="round">
      <path d="M50 120 Q20 150 40 180" />
      <path d="M75 130 Q60 165 80 185" />
      <path d="M125 130 Q140 165 120 185" />
      <path d="M150 120 Q180 150 160 180" />
    </g>
    <ellipse cx="100" cy="80" rx="72" ry="66" fill={C.purple} stroke={C.ink} strokeWidth="6" />
    <circle cx="72" cy="78" r="15" fill="#fff" />
    <circle cx="128" cy="78" r="15" fill="#fff" />
    <circle cx="75" cy="80" r="7" fill={C.ink} />
    <circle cx="125" cy="80" r="7" fill={C.ink} />
    <circle cx="52" cy="102" r="8" fill={C.coral} opacity="0.7" />
    <circle cx="148" cy="102" r="8" fill={C.coral} opacity="0.7" />
    <path d="M85 104 Q100 118 115 104" fill="none" stroke={C.ink} strokeWidth="5" strokeLinecap="round" />
  </svg>
);

export const Heart: React.FC<I> = ({size = 100}) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    <path d="M100 175 C15 115 25 35 100 72 C175 35 185 115 100 175 Z" fill={C.coral} {...S} />
    <ellipse cx="62" cy="68" rx="12" ry="8" fill="#fff" opacity="0.6" transform="rotate(-30 62 68)" />
  </svg>
);

export const Shark: React.FC<I> = ({size = 360}) => (
  <svg width={size} height={size * 0.8} viewBox="0 0 220 176">
    <path d="M168 100 L212 66 L204 136 Z" fill="#74B9FF" {...S} />
    <path d="M88 70 L112 18 L136 74 Z" fill="#74B9FF" {...S} />
    <ellipse cx="100" cy="102" rx="84" ry="42" fill="#74B9FF" {...S} />
    <path d="M30 112 Q100 150 170 112 Q100 128 30 112 Z" fill="#fff" />
    <circle cx="52" cy="92" r="8" fill={C.ink} />
    <path d="M24 108 Q50 122 76 110" fill="none" stroke={C.ink} strokeWidth="5" strokeLinecap="round" />
  </svg>
);

export const Tree: React.FC<I> = ({size = 360}) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    <rect x="86" y="110" width="28" height="75" rx="6" fill="#B07A4A" {...S} />
    <circle cx="100" cy="70" r="48" fill="#55C57A" {...S} />
    <circle cx="62" cy="98" r="34" fill="#55C57A" {...S} />
    <circle cx="140" cy="98" r="34" fill="#55C57A" {...S} />
    <circle cx="100" cy="82" r="30" fill="#55C57A" />
  </svg>
);

export const Banana: React.FC<I> = ({size = 420}) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    <path d="M45 30 C28 125 90 188 178 152 C188 142 176 130 165 134 C105 152 76 105 78 34 Z" fill={C.yellow} {...S} />
    <path d="M45 30 L78 34 L72 14 L52 12 Z" fill="#B07A4A" {...S} />
    <circle cx="96" cy="120" r="5" fill={C.ink} />
    <circle cx="122" cy="132" r="5" fill={C.ink} />
    <path d="M100 138 Q112 148 126 144" fill="none" stroke={C.ink} strokeWidth="4" strokeLinecap="round" />
  </svg>
);

export const Strawberry: React.FC<I> = ({size = 420}) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    <path d="M100 185 C25 145 25 75 58 62 C80 56 90 64 100 64 C110 64 120 56 142 62 C175 75 175 145 100 185 Z" fill="#FF4757" {...S} />
    <path d="M100 66 L70 40 L100 52 L130 40 Z" fill="#55C57A" {...S} />
    <g fill={C.yellow}>
      <ellipse cx="70" cy="100" rx="4" ry="6" />
      <ellipse cx="130" cy="100" rx="4" ry="6" />
      <ellipse cx="100" cy="82" rx="4" ry="6" />
      <ellipse cx="86" cy="150" rx="4" ry="6" />
      <ellipse cx="114" cy="150" rx="4" ry="6" />
    </g>
    <circle cx="80" cy="115" r="7" fill="#fff" />
    <circle cx="120" cy="115" r="7" fill="#fff" />
    <circle cx="80" cy="118" r="4" fill={C.ink} />
    <circle cx="120" cy="118" r="4" fill={C.ink} />
    <path d="M82 144 Q100 128 118 144" fill="none" stroke={C.ink} strokeWidth="5" strokeLinecap="round" />
  </svg>
);

export const Crown: React.FC<I> = ({size = 200}) => (
  <svg width={size} height={size * 0.7} viewBox="0 0 200 140">
    <path d="M20 120 L10 40 L65 80 L100 20 L135 80 L190 40 L180 120 Z" fill="#FFC300" {...S} />
    <circle cx="10" cy="40" r="9" fill={C.coral} {...S} />
    <circle cx="100" cy="20" r="9" fill={C.coral} {...S} />
    <circle cx="190" cy="40" r="9" fill={C.coral} {...S} />
  </svg>
);

export const Venus: React.FC<I & {rotation?: number}> = ({size = 500, rotation = 0}) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    <defs>
      <radialGradient id="vg" cx="0.35" cy="0.3" r="0.8">
        <stop offset="0" stopColor="#FFE29A" />
        <stop offset="0.55" stopColor="#FFB347" />
        <stop offset="1" stopColor="#FF8C42" />
      </radialGradient>
      <clipPath id="vc">
        <circle cx="100" cy="100" r="90" />
      </clipPath>
    </defs>
    <circle cx="100" cy="100" r="90" fill="url(#vg)" />
    <g clipPath="url(#vc)" transform={`rotate(${rotation} 100 100)`} fill="none" stroke="#fff" strokeOpacity="0.45" strokeWidth="8" strokeLinecap="round">
      <path d="M0 60 Q60 40 100 62 T200 56" />
      <path d="M0 105 Q50 130 100 104 T200 112" />
      <path d="M0 150 Q70 128 120 152 T200 146" />
    </g>
    <circle cx="100" cy="100" r="90" fill="none" {...S} />
  </svg>
);

export const Check: React.FC<I & {color?: string}> = ({size = 70, color = C.ink}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M20 54 L42 76 L82 26" fill="none" stroke={color} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Cross: React.FC<I & {color?: string}> = ({size = 70, color = C.coral}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M22 22 L78 78 M78 22 L22 78" fill="none" stroke={color} strokeWidth="14" strokeLinecap="round" />
  </svg>
);

export const ArrowDown: React.FC<I> = ({size = 70}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M50 14 V78 M24 54 L50 82 L76 54" fill="none" stroke={C.purple} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
