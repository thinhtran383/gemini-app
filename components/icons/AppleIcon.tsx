import React from 'react';

const AppleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g transform="translate(5, 5) scale(0.9)">
      <path d="M 75,40 C 90,20 95,50 75,60 C 55,70 60,20 75,40 Z" fill="#EF4444" stroke="#c03030" strokeWidth="2" />
      <path d="M 75,60 C 95,70 90,90 75,80 C 60,70 55,90 75,60 Z" fill="#EF4444" stroke="#c03030" strokeWidth="2" />
      <path d="M 50,20 C 60,10, 70,10, 75,20" stroke="#8D5524" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M 75,25 C 80,20 90,25 85,30 C 80,35 70,30 75,25 Z" fill="#22C55E" />
    </g>
  </svg>
);

export default AppleIcon;
