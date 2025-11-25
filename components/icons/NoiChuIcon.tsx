import React from 'react';

const NoiChuIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <style>
        {`.icon-font { font-family: 'Quicksand', 'Comic Sans MS', cursive; font-weight: 700; }`}
      </style>
    </defs>
    
    {/* Box on the left */}
    <rect x="10" y="35" width="30" height="30" rx="5" fill="#A7F3D0" stroke="#10B981" strokeWidth="2"/>
    <path d="M 18,55 C 23,45 30,45 35,55" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
    <circle cx="22" cy="45" r="2" fill="#059669" />
    <circle cx="31" cy="45" r="2" fill="#059669" />

    {/* Box on the right */}
    <rect x="60" y="35" width="30" height="30" rx="5" fill="#BFDBFE" stroke="#3B82F6" strokeWidth="2"/>
    <text x="66" y="57" className="icon-font" fontSize="20" fill="#2563EB">A</text>
    
    {/* Connecting Line */}
    <path d="M 40 50 C 50 40, 50 60, 60 50" stroke="#FBBF24" strokeWidth="4" fill="none" strokeDasharray="8 4" strokeLinecap="round">
      <animate attributeName="stroke-dashoffset" from="12" to="0" dur="0.5s" repeatCount="indefinite" />
    </path>
  </svg>
);

export default NoiChuIcon;