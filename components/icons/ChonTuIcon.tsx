import React from 'react';

const ChonTuIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M 50 15 L 10 10 C 5 20, 5 80, 10 90 L 50 85 V 15 Z" fill="#F3F4F6" stroke="#9CA3AF" strokeWidth="2" />
    <path d="M 50 15 L 90 10 C 95 20, 95 80, 90 90 L 50 85 V 15 Z" fill="#FFFFFF" stroke="#9CA3AF" strokeWidth="2" />
    <line x1="15" y1="30" x2="45" y2="32" stroke="#D1D5DB" strokeWidth="1.5" />
    <line x1="15" y1="45" x2="45" y2="47" stroke="#D1D5DB" strokeWidth="1.5" />
    <line x1="15" y1="60" x2="45" y2="62" stroke="#D1D5DB" strokeWidth="1.5" />
    <rect x="58" y="40" width="30" height="20" fill="#E0F2FE" stroke="#3B82F6" strokeWidth="2" strokeDasharray="4" />
  </svg>
);

export default ChonTuIcon;
