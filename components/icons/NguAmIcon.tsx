import React from 'react';

const NguAmIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <style>
        {`.icon-font { font-family: 'Quicksand', 'Comic Sans MS', cursive; font-weight: 700; }`}
      </style>
    </defs>
    <text x="25" y="75" className="icon-font" fontSize="70" fill="#4B5563" stroke="white" strokeWidth="2" strokeLinejoin="round">A</text>
    
    {/* Shirt Drawing */}
    <g transform="translate(60, 20) scale(0.4)">
        <path 
        d="M 32,25 L 32,15 Q 50,25 68,15 L 68,25 L 85,35 L 75,50 L 68,42 L 68,90 L 32,90 L 32,42 L 25,50 L 15,35 Z" 
        fill="#EF4444" 
        stroke="#B91C1C" 
        strokeWidth="4" 
        strokeLinejoin="round" 
        />
        <path d="M 32,15 Q 50,25 68,15" fill="none" stroke="#B91C1C" strokeWidth="4" />
        <path d="M 55,50 L 63,50 L 63,60 Q 59,65 55,60 Z" fill="#FCA5A5" stroke="#B91C1C" strokeWidth="2" />
        <path d="M 50,55 L 51,58 L 54,58 L 52,60 L 53,63 L 50,61 L 47,63 L 48,60 L 46,58 L 49,58 Z" fill="#FCD34D" />
    </g>
  </svg>
);

export default NguAmIcon;