import React from 'react';

const ChuThuongIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <style>
        {`.icon-font { font-family: 'Quicksand', 'Comic Sans MS', cursive; font-weight: 700; }`}
      </style>
    </defs>
    <text x="25" y="50" className="icon-font" fontSize="50" fill="#F472B6" transform="rotate(-15 25 50)" stroke="white" strokeWidth="2.5" strokeLinejoin="round">a</text>
    <text x="70" y="45" className="icon-font" fontSize="50" fill="#60A5FA" transform="rotate(20 70 45)" stroke="white" strokeWidth="2.5" strokeLinejoin="round">b</text>
    <text x="50" y="88" className="icon-font" fontSize="50" fill="#A78BFA" transform="rotate(-5 50 88)" stroke="white" strokeWidth="2.5" strokeLinejoin="round">c</text>
  </svg>
);

export default ChuThuongIcon;
