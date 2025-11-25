import React from 'react';

const ThucHanhIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
     <defs>
      <style>
        {`.icon-font { font-family: 'Quicksand', 'Comic Sans MS', cursive; font-weight: 700; }`}
      </style>
    </defs>
    <g transform="translate(10, 20) scale(0.65)">
      <circle cx="50" cy="50" r="30" fill="#FBBF24" stroke="#d49b1c" strokeWidth="1.5" />
      <circle cx="75" cy="40" r="15" fill="#FBBF24" stroke="#d49b1c" strokeWidth="1.5" />
      <path d="M 78,30 C 83,20 73,20 78,30" fill="#F87171" />
      <circle cx="80" cy="40" r="3" fill="black" />
      <path d="M 90,45 L 95,40 L 90,35 Z" fill="#F97316" />
    </g>
    <ellipse cx="80" cy="75" rx="12" ry="16" fill="#FDE68A" transform="rotate(20 80 75)" stroke="#e6c855" strokeWidth="1.5" />
    <text x="45" y="85" className="icon-font" fontSize="50" fill="#4B5563" stroke="white" strokeWidth="2" strokeLinejoin="round">C</text>
  </svg>
);

export default ThucHanhIcon;