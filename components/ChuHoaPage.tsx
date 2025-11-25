
import React, { useState, useEffect, useCallback } from 'react';
import { useSpeechSynthesis } from './useSpeechSynthesis';

// Data mapping: Letter -> Word -> Image URL (High Quality Real Images)
const VOCABULARY = [
  { char: 'Ă', word: 'Mặt Trăng', img: 'https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?w=600&q=80' }, // Moon
  { char: 'Â', word: 'Con Gấu', img: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=600&q=80' }, // Bear
  { char: 'B', word: 'Quả Bóng', img: 'https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?w=600&q=80' }, // Yellow Soccer Ball
  { char: 'C', word: 'Con Cá', img: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?w=600&q=80' }, // Fish
  { char: 'D', word: 'Dưa Hấu', img: 'https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?w=600&q=80' }, // Watermelon
  { char: 'Đ', word: 'Đồng Hồ', img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80' }, // Clock
  { char: 'E', word: 'Em Bé', img: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600&q=80' }, // Baby
  { char: 'Ê', word: 'Con Ếch', img: 'https://images.unsplash.com/photo-1579380656108-f98e4df8ea62?w=600&q=80' }, // Frog
  { char: 'G', word: 'Con Gà', img: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=600&q=80' }, // Chicken
  { char: 'H', word: 'Bông Hoa', img: 'https://images.unsplash.com/photo-1562690868-60bbe7293e94?w=600&q=80' }, // Flower
  { char: 'K', word: 'Cái Kẹo', img: 'https://images.unsplash.com/photo-1575224300306-1b8da36134ec?w=600&q=80' }, // Candy/Lollipop
  { char: 'L', word: 'Quả Lê', img: 'https://images.unsplash.com/photo-1615484477778-ca3b77940c25?w=600&q=80' }, // Pear
  { char: 'M', word: 'Con Mèo', img: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&q=80' }, // Cat
  { char: 'N', word: 'Cái Nến', img: 'https://images.unsplash.com/photo-1602523961358-f9f03dd557db?w=600&q=80' }, // Candle
  { char: 'Ô', word: 'Ô Tô', img: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&q=80' }, // Car
  { char: 'Ơ', word: 'Quả Mơ', img: 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=600&q=80' }, // Apricot
  { char: 'Q', word: 'Hộp Quà', img: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&q=80' }, // Gift
  { char: 'R', word: 'Con Rùa', img: 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=600&q=80' }, // Turtle
  { char: 'T', word: 'Quả Táo', img: 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=600&q=80' }, // Apple
  { char: 'Ư', word: 'Sư Tử', img: 'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=600&q=80' }, // Lion
  { char: 'X', word: 'Xe Đạp', img: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&q=80' }, // Bicycle
];

const phoneticMap: { [key: string]: string } = {
    'A': 'a.', 'Ă': 'á.', 'Â': 'ớ.', 'B': 'bờ.', 'C': 'cờ.', 'D': 'dờ.', 'Đ': 'đờ.', 'E': 'e.', 'Ê': 'ê.', 'G': 'gờ.', 'H': 'hờ.', 'I': 'i.', 'K': 'ca.', 'L': 'lờ.', 'M': 'mờ.', 'N': 'nờ.', 'O': 'o.', 'Ô': 'ô.', 'Ơ': 'ơ.', 'P': 'pờ.', 'Q': 'cu.', 'R': 'rờ.', 'S': 'sờ.', 'T': 'tờ.', 'U': 'u.', 'Ư': 'ư.', 'V': 'vờ.', 'X': 'xờ.'
};

interface ChuHoaPageProps {
  onBack: () => void;
}

const ChuHoaPage: React.FC<ChuHoaPageProps> = ({ onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const { speak, cancel } = useSpeechSynthesis();

  const currentItem = VOCABULARY[currentIndex];

  const playAudio = useCallback(() => {
    const phonetic = phoneticMap[currentItem.char] || currentItem.char;
    speak(`${phonetic}. ${currentItem.word}.`, { rate: 0.9 });
  }, [currentItem, speak]);

  useEffect(() => {
    // Play audio automatically when slide changes
    const t = setTimeout(() => {
        playAudio();
    }, 300);
    return () => clearTimeout(t);
  }, [currentIndex, playAudio]);

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % VOCABULARY.length);
        setIsAnimating(false);
    }, 300);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
        setCurrentIndex((prev) => (prev - 1 + VOCABULARY.length) % VOCABULARY.length);
        setIsAnimating(false);
    }, 300);
  };
  
  // Keyboard navigation
  useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
          if (e.key === 'ArrowRight') handleNext();
          if (e.key === 'ArrowLeft') handlePrev();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnimating]);

  return (
    <div className="relative z-20 flex flex-col items-center justify-center h-full min-h-[85vh] p-2 text-center animate-fade-in w-full max-w-6xl mx-auto font-quicksand select-none">
       <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
        .font-quicksand { font-family: 'Quicksand', sans-serif; }
      `}</style>

      <button
        className="absolute top-0 left-4 md:left-0 bg-white/80 text-gray-700 font-bold py-2 px-4 rounded-full shadow-lg hover:bg-white transition-all duration-300 ease-in-out flex items-center focus:outline-none focus:ring-2 focus:ring-yellow-400 z-50"
        onClick={onBack}
        aria-label="Quay lại"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="ml-2 hidden sm:inline">Quay Lại</span>
      </button>

      <div className="bg-white/90 p-4 md:p-8 rounded-[2.5rem] shadow-2xl w-full max-w-5xl flex flex-col items-center relative border-8 border-white">
        <h1 className="text-2xl md:text-5xl font-bold text-blue-800 mb-4 md:mb-6" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.1)' }}>
          Học Chữ Cái In Hoa
        </h1>
        
        <div className="flex items-center justify-between w-full gap-2 md:gap-4">
            
            {/* Prev Button */}
            <button 
                onClick={handlePrev}
                className="p-2 md:p-4 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 hover:scale-110 transition-all shadow-md flex-shrink-0"
                aria-label="Chữ trước"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-12 md:w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            {/* Main Content Card - Horizontal Layout */}
            <div 
                className={`flex flex-row items-center justify-center gap-4 md:gap-16 w-full py-4 md:py-8 transition-opacity duration-300 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
                onClick={playAudio}
            >
                {/* Left: Huge Letter */}
                <div className="flex flex-col items-center">
                    <div 
                        className="text-[100px] sm:text-[150px] md:text-[200px] font-bold leading-none drop-shadow-lg cursor-pointer transform hover:scale-105 transition-transform"
                        style={{ color: '#E53935' }}
                    >
                        {currentItem.char}
                    </div>
                </div>

                {/* Right: Image & Word */}
                <div className="flex flex-col items-center cursor-pointer group">
                    <div className="w-32 h-32 sm:w-56 sm:h-56 md:w-80 md:h-80 rounded-3xl overflow-hidden border-4 md:border-8 border-yellow-300 shadow-2xl relative bg-white">
                         <img 
                            src={currentItem.img} 
                            alt={currentItem.word}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400?text=Bé+Học+Chữ';
                            }}
                         />
                    </div>
                    <div className="mt-2 md:mt-6 bg-yellow-100 text-yellow-800 px-4 py-1 md:px-8 md:py-3 rounded-full text-lg sm:text-3xl md:text-4xl font-bold shadow-sm whitespace-nowrap">
                        {currentItem.word}
                    </div>
                </div>
            </div>

            {/* Next Button */}
            <button 
                onClick={handleNext}
                className="p-2 md:p-4 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 hover:scale-110 transition-all shadow-md flex-shrink-0"
                aria-label="Chữ sau"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-12 md:w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                </svg>
            </button>

        </div>

        {/* Progress Dots */}
        <div className="flex flex-wrap justify-center gap-2 mt-4 md:mt-8 px-4">
            {VOCABULARY.map((item, idx) => (
                <div 
                    key={idx}
                    onClick={() => !isAnimating && setCurrentIndex(idx)}
                    className={`w-2 h-2 md:w-3 md:h-3 rounded-full cursor-pointer transition-all duration-300 ${idx === currentIndex ? 'bg-blue-500 w-6 md:w-8' : 'bg-gray-300 hover:bg-blue-300'}`}
                />
            ))}
        </div>
      </div>
    </div>
  );
};

export default ChuHoaPage;
    