import React from 'react';

const VongQuayIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <style>
        {`.icon-font { font-family: 'Quicksand', 'Comic Sans MS', cursive; font-weight: 700; }`}
      </style>
    </defs>
    <circle cx="50" cy="50" r="45" fill="#FFCC80" stroke="#F57C00" strokeWidth="2" />
    <circle cx="50" cy="50" r="5" fill="#F57C00" />
    
    {/* Wheel Slices */}
    <path d="M50,50 L50,5 A45,45 0 0,1 88,22 Z" fill="#FFAB91" stroke="#fff" strokeWidth="1" />
    <path d="M50,50 L88,22 A45,45 0 0,1 95,50 Z" fill="#80CBC4" stroke="#fff" strokeWidth="1" />
    <path d="M50,50 L95,50 A45,45 0 0,1 88,78 Z" fill="#CE93D8" stroke="#fff" strokeWidth="1" />
    <path d="M50,50 L88,78 A45,45 0 0,1 50,95 Z" fill="#FFF59D" stroke="#fff" strokeWidth="1" />
    <path d="M50,50 L50,95 A45,45 0 0,1 12,78 Z" fill="#A5D6A7" stroke="#fff" strokeWidth="1" />
    <path d="M50,50 L12,78 A45,45 0 0,1 5,50 Z" fill="#90CAF9" stroke="#fff" strokeWidth="1" />
    <path d="M50,50 L5,50 A45,45 0 0,1 12,22 Z" fill="#F48FB1" stroke="#fff" strokeWidth="1" />
    <path d="M50,50 L12,22 A45,45 0 0,1 50,5 Z" fill="#B39DDB" stroke="#fff" strokeWidth="1" />

    {/* Pointer */}
    <path d="M45,2 L55,2 L50,12 Z" fill="#D32F2F" />
  </svg>
);

export default VongQuayIcon;