import React from 'react';

const ChuHoaIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <style>
        {`.icon-font { font-family: 'Quicksand', 'Comic Sans MS', cursive; font-weight: 700; }`}
      </style>
    </defs>
    <text x="25" y="45" className="icon-font" fontSize="50" fill="#EF4444" transform="rotate(-20 25 45)" stroke="#fff" strokeWidth="2.5" strokeLinejoin="round">A</text>
    <text x="70" y="40" className="icon-font" fontSize="50" fill="#3B82F6" transform="rotate(15 70 40)" stroke="#fff" strokeWidth="2.5" strokeLinejoin="round">B</text>
    <text x="50" y="85" className="icon-font" fontSize="50" fill="#8B5CF6" transform="rotate(5 50 85)" stroke="#fff" strokeWidth="2.5" strokeLinejoin="round">C</text>
  </svg>
);

export default ChuHoaIcon;
