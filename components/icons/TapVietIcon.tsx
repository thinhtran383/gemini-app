import React from 'react';

const TapVietIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <style>
        {`.icon-font { font-family: 'Quicksand', 'Comic Sans MS', cursive; font-weight: 700; }`}
      </style>
    </defs>
    <rect x="15" y="20" width="70" height="70" rx="5" fill="#FEF3C7" stroke="#FDE68A" strokeWidth="2" />
    <line x1="20" y1="40" x2="80" y2="40" stroke="#A5B4FC" strokeWidth="1" />
    <line x1="20" y1="65" x2="80" y2="65" stroke="#A5B4FC" strokeWidth="1" />
    <line x1="25" y1="20" x2="25" y2="90" stroke="#FDA4AF" strokeWidth="1.5" />
    <text x="40" y="62" className="icon-font" fontSize="30" fill="#374151">Aa</text>
    
    <g transform="rotate(20 70 70)">
      <rect x="65" y="25" width="10" height="50" fill="#FBBF24" stroke="#f0a800" strokeWidth="1" />
      <polygon points="65,75 75,75 70,85" fill="#374151" />
      <rect x="65" y="20" width="10" height="5" fill="#F472B6" />
    </g>
  </svg>
);

export default TapVietIcon;
