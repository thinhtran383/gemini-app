import React from 'react';

const FrogIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g transform="translate(10,10) scale(0.8)">
      {/* Face */}
      <ellipse cx="50" cy="60" rx="40" ry="30" fill="#4ADE80" stroke="#15803d" strokeWidth="2" />
      {/* Eyes */}
      <circle cx="25" cy="35" r="12" fill="#4ADE80" stroke="#15803d" strokeWidth="2" />
      <circle cx="75" cy="35" r="12" fill="#4ADE80" stroke="#15803d" strokeWidth="2" />
      <circle cx="25" cy="35" r="5" fill="black" />
      <circle cx="75" cy="35" r="5" fill="black" />
      <circle cx="22" cy="32" r="2" fill="white" />
      <circle cx="72" cy="32" r="2" fill="white" />
      {/* Mouth */}
      <path d="M 35,65 Q 50,75 65,65" fill="none" stroke="#15803d" strokeWidth="3" strokeLinecap="round" />
      {/* Blush */}
      <circle cx="30" cy="65" r="5" fill="#F472B6" opacity="0.5" />
      <circle cx="70" cy="65" r="5" fill="#F472B6" opacity="0.5" />
    </g>
  </svg>
);

export default FrogIcon;