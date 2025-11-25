import React from 'react';

interface LearningButtonProps {
  circleColor: string;
  labelColor: string;
  label: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  onClick: () => void;
}

const LearningButton: React.FC<LearningButtonProps> = ({ circleColor, labelColor, label, Icon, onClick }) => {
  return (
    <div
      className="flex flex-col items-center group cursor-pointer"
      style={{ width: 'clamp(140px, 15vw, 190px)' }}
      onClick={onClick}
      onKeyPress={(e) => e.key === 'Enter' && onClick()}
      role="button"
      tabIndex={0}
      aria-label={`Học ${label}`}
    >
      <div
        className="relative w-full aspect-square rounded-full flex items-center justify-center p-4 shadow-lg transition-transform duration-300 ease-in-out group-hover:scale-110 z-10"
        style={{ backgroundColor: circleColor, boxShadow: 'inset 0 6px 12px rgba(0,0,0,0.2)' }}
      >
        <Icon className="w-3/4 h-3/4" />
      </div>

      <div className="relative w-full -mt-5 pt-8 pb-2 flex flex-col items-center">
        <div className="absolute top-0 w-8 h-12 bg-[#A0522D] shadow-md" style={{ clipPath: 'polygon(0 0, 100% 0, 85% 100%, 15% 100%)' }}></div>
        <div
          className="relative w-[95%] py-2 px-1 rounded-lg text-white font-bold text-base md:text-lg text-center shadow-xl z-10"
          style={{ backgroundColor: labelColor, textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}
        >
          {label}
        </div>
      </div>
    </div>
  );
};

export default LearningButton;