import React from 'react';

const ShirtIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* Shirt Body */}
    <path 
      d="M 32,25 L 32,15 Q 50,25 68,15 L 68,25 L 85,35 L 75,50 L 68,42 L 68,90 L 32,90 L 32,42 L 25,50 L 15,35 Z" 
      fill="#F87171" 
      stroke="#B91C1C" 
      strokeWidth="2" 
      strokeLinejoin="round" 
    />
    
    {/* Collar area detail */}
    <path d="M 32,15 Q 50,25 68,15" fill="none" stroke="#B91C1C" strokeWidth="2" />
    
    {/* Pocket */}
    <path d="M 55,50 L 63,50 L 63,60 Q 59,65 55,60 Z" fill="#FCA5A5" stroke="#B91C1C" strokeWidth="1" />
    
    {/* Star decoration on shirt */}
    <path d="M 50,55 L 51,58 L 54,58 L 52,60 L 53,63 L 50,61 L 47,63 L 48,60 L 46,58 L 49,58 Z" fill="#FCD34D" />
  </svg>
);

export default ShirtIcon;