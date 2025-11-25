import React from 'react';

const CakeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <style>
        {`.icon-font { font-family: 'Quicksand', 'Comic Sans MS', cursive; font-weight: 700; }`}
      </style>
    </defs>
    
    {/* Cake Stand Base */}
    <path d="M 50,90 L 50,75 M 20,90 L 80,90" stroke="#9E9E9E" strokeWidth="3" strokeLinecap="round" />
    
    {/* Cake Layers */}
    <path d="M 20,75 L 20,55 Q 50,65 80,55 L 80,75 Q 50,85 20,75 Z" fill="#F8BBD0" stroke="#EC407A" strokeWidth="2" />
    <path d="M 25,55 L 25,35 Q 50,45 75,35 L 75,55 Q 50,65 25,55 Z" fill="#E1BEE7" stroke="#AB47BC" strokeWidth="2" />
    
    {/* Top Icing */}
    <ellipse cx="50" cy="35" rx="25" ry="8" fill="#F3E5F5" stroke="#AB47BC" strokeWidth="2" />
    
    {/* Cherry */}
    <circle cx="50" cy="25" r="5" fill="#EF5350" />
    
    <text x="50" y="72" className="icon-font" fontSize="14" fill="#880E4F" textAnchor="middle">ABC</text>
  </svg>
);

export default CakeIcon;