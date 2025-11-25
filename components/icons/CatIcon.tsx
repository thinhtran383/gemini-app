import React from 'react';

const CatIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
        {/* Body */}
        <ellipse cx="50" cy="65" rx="30" ry="25" fill="#FDBA74"/>
        {/* Head */}
        <circle cx="50" cy="40" r="20" fill="#FDBA74"/>
        {/* Ears */}
        <path d="M 35,25 L 45,15 L 50,25 Z" fill="#FDBA74" stroke="#ca8a4d" strokeWidth="1"/>
        <path d="M 65,25 L 55,15 L 50,25 Z" fill="#FDBA74" stroke="#ca8a4d" strokeWidth="1"/>
        {/* Eyes */}
        <circle cx="43" cy="40" r="3" fill="black"/>
        <circle cx="57" cy="40" r="3" fill="black"/>
        {/* Nose */}
        <path d="M 48,45 L 52,45 L 50,48 Z" fill="#F87171"/>
        {/* Whiskers */}
        <path d="M 30,45 Q 40,47 45,45" stroke="black" fill="none" strokeWidth="0.5"/>
        <path d="M 30,48 Q 40,50 45,48" stroke="black" fill="none" strokeWidth="0.5"/>
        <path d="M 70,45 Q 60,47 55,45" stroke="black" fill="none" strokeWidth="0.5"/>
        <path d="M 70,48 Q 60,50 55,48" stroke="black" fill="none" strokeWidth="0.5"/>
    </svg>
);

export default CatIcon;
