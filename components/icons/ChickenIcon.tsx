import React from 'react';

const ChickenIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g transform="scale(0.9) translate(5, 5)">
      {/* Body */}
      <circle cx="50" cy="60" r="30" fill="#FBBF24" />
      {/* Head */}
      <circle cx="70" cy="40" r="15" fill="#FBBF24" />
      {/* Comb */}
      <path d="M 72,25 C 77,15 67,15 72,25" fill="#F87171" stroke="#c75a5a" strokeWidth="1" />
      <path d="M 68,26 C 73,18 63,18 68,26" fill="#F87171" stroke="#c75a5a" strokeWidth="1" />
      {/* Eye */}
      <circle cx="75" cy="40" r="2.5" fill="black" />
       {/* Beak */}
      <path d="M 85,42 L 92,40 L 85,38 Z" fill="#F97316" />
       {/* Wattle */}
      <ellipse cx="80" cy="48" rx="3" ry="5" fill="#F87171" />
       {/* Wing */}
      <path d="M 40,55 C 20,70 50,80 60,65" fill="#FDE68A" />
    </g>
  </svg>
);

export default ChickenIcon;