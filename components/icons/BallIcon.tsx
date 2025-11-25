import React from 'react';

const BallIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
        <circle cx="50" cy="50" r="40" fill="#3B82F6"/>
        <path d="M50,10 A40,40 0 0,1 50,90" fill="#FBBF24"/>
        <circle cx="50" cy="50" r="15" fill="#FFFFFF"/>
        <path d="M25,25 L75,75" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />
        <path d="M75,25 L25,75" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />
    </svg>
);

export default BallIcon;
