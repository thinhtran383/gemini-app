import React, { useState, useCallback } from 'react';
import { ShirtIcon, BallIcon, CatIcon, FrogIcon } from './icons';
import { useSpeechSynthesis } from './useSpeechSynthesis';

const vocabulary = [
  { letter: 'A', word: 'Áo', Icon: ShirtIcon, phoneticLetter: 'a', phoneticWord: 'cái áo' },
  { letter: 'B', word: 'Bóng', Icon: BallIcon, phoneticLetter: 'bờ', phoneticWord: 'quả bóng' },
  { letter: 'C', word: 'Mèo', Icon: CatIcon, phoneticLetter: 'cờ', phoneticWord: 'con mèo' },
  { letter: 'Ê', word: 'Ếch', Icon: FrogIcon, phoneticLetter: 'ê', phoneticWord: 'con ếch' },
];

interface NguAmPageProps {
  onBack: () => void;
}

const NguAmPage: React.FC<NguAmPageProps> = ({ onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { speak } = useSpeechSynthesis();

  const handleCardClick = () => {
    const item = vocabulary[currentIndex];
    speak(`${item.phoneticLetter}... ${item.phoneticWord}`, { rate: 0.9 });
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % vocabulary.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + vocabulary.length) % vocabulary.length);
  };

  const { letter, word, Icon } = vocabulary[currentIndex];

  return (
    <div className="relative z-20 flex flex-col items-center justify-center h-full p-4 text-center animate-fade-in w-full max-w-lg mx-auto">
       <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
        .card {
            perspective: 1000px;
        }
        .card-inner {
            transition: transform 0.6s;
            transform-style: preserve-3d;
        }
      `}</style>

      <button
        className="absolute top-0 left-4 md:left-0 bg-white/80 text-gray-700 font-bold py-2 px-4 rounded-full shadow-lg hover:bg-white transition-all duration-300 ease-in-out flex items-center focus:outline-none focus:ring-2 focus:ring-yellow-400"
        onClick={onBack}
        aria-label="Quay lại"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="ml-2 hidden sm:inline">Quay Lại</span>
      </button>

      <div className="w-full flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-8" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
          Học Ngữ Âm
        </h1>
        
        <div className="card w-full max-w-xs md:max-w-sm aspect-square">
            <div 
                key={currentIndex}
                className="card-inner w-full h-full bg-white rounded-2xl shadow-2xl flex flex-col items-center justify-center p-4 cursor-pointer transform hover:scale-105 transition-transform duration-300 animate-fade-in"
                onClick={handleCardClick}
            >
                <Icon className="w-4/6 h-4/6"/>
                <p className="text-5xl md:text-6xl font-bold text-gray-800 mt-4">{letter} - {word}</p>
            </div>
        </div>

        <div className="mt-8 flex justify-between w-full max-w-sm md:max-w-md">
            <button onClick={handlePrev} className="py-3 px-8 text-xl border-none rounded-xl cursor-pointer bg-orange-500 text-white font-bold shadow-lg hover:bg-orange-600 transition-all duration-200 transform hover:scale-105">
              Trước
            </button>
            <button onClick={handleNext} className="py-3 px-8 text-xl border-none rounded-xl cursor-pointer bg-teal-500 text-white font-bold shadow-lg hover:bg-teal-600 transition-all duration-200 transform hover:scale-105">
              Sau
            </button>
        </div>
      </div>
    </div>
  );
};

export default NguAmPage;