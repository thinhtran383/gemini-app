import React from 'react';
import type { LearningButtonData } from '../types';

interface InnerPageProps {
  button: LearningButtonData;
  onBack: () => void;
}

const InnerPage: React.FC<InnerPageProps> = ({ button, onBack }) => {
  const { label, circleColor, icon: Icon } = button;

  return (
    <div className="relative z-20 flex flex-col items-center justify-center h-full p-4 text-center animate-fade-in">
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>

      <button
        className="absolute top-4 left-4 md:top-8 md:left-8 bg-white/80 text-gray-700 font-bold py-2 px-4 rounded-full shadow-lg hover:bg-white transition-all duration-300 ease-in-out flex items-center focus:outline-none focus:ring-2 focus:ring-yellow-400"
        onClick={onBack}
        aria-label="Quay lại trang chủ"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="ml-2 hidden sm:inline">Quay Lại</span>
      </button>

      <div className="flex flex-col items-center">
        <div
          className="relative w-48 h-48 md:w-64 md:h-64 rounded-full flex items-center justify-center p-4 shadow-2xl"
          style={{ backgroundColor: circleColor, boxShadow: 'inset 0 8px 16px rgba(0,0,0,0.2)' }}
        >
          <Icon className="w-3/4 h-3/4" />
        </div>
        <h2 
          className="mt-8 text-4xl md:text-6xl font-bold text-white" 
          style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.4)' }}
        >
          {label}
        </h2>
        <p className="mt-4 text-white/90 text-xl max-w-md">
          Đây là khu vực học tập cho chủ đề <span className="font-bold">{label}</span>. Nội dung chi tiết sẽ sớm được cập nhật!
        </p>
      </div>
    </div>
  );
};

export default InnerPage;
