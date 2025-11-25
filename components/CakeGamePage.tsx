
import React, { useState, useEffect } from 'react';
import { useSpeechSynthesis } from './useSpeechSynthesis';
import { useAudio } from './useAudio';

// 1. Data Structure: 6 Groups of letters
const LETTER_GROUPS = [
  { name: 'Nhóm 1', letters: ['a', 'ă', 'â', 'b', 'c'] },
  { name: 'Nhóm 2', letters: ['d', 'đ', 'e', 'ê', 'g'] },
  { name: 'Nhóm 3', letters: ['h', 'i', 'k', 'l', 'm'] },
  { name: 'Nhóm 4', letters: ['n', 'o', 'ô', 'ơ', 'p'] },
  { name: 'Nhóm 5', letters: ['q', 'r', 's', 't', 'u', 'ư'] },
  { name: 'Nhóm 6', letters: ['v', 'x', 'y'] },
];

const phoneticMap: { [key: string]: string } = {
    'a': 'a.', 'ă': 'á.', 'â': 'ớ.', 'b': 'bờ.', 'c': 'cờ.', 'd': 'dờ.', 'đ': 'đờ.', 
    'e': 'e.', 'ê': 'ê.', 'g': 'gờ.', 'h': 'hờ.', 'i': 'i.', 'k': 'ca.', 'l': 'lờ.', 
    'm': 'mờ.', 'n': 'nờ.', 'o': 'o.', 'ô': 'ô.', 'ơ': 'ơ.', 'p': 'pờ.', 'q': 'cu.', 
    'r': 'rờ.', 's': 'sờ.', 't': 'tờ.', 'u': 'u.', 'ư': 'ư.', 'v': 'vờ.', 'x': 'xờ.', 'y': 'y.'
};

const LAYER_COLORS = [
    '#F48FB1', '#CE93D8', '#90CAF9', '#80CBC4', '#C5E1A5', '#FFF59D', '#FFCC80', '#FFAB91',
    '#F06292', '#BA68C8', '#64B5F6', '#4DB6AC', '#AED581', '#FFF176', '#FFB74D', '#FF8A65'
];

interface CakeLayer {
  char: string;
  id: string; // unique id to handle React keys properly
  color: string;
}

interface CakeGamePageProps {
  onBack: () => void;
}

const CakeGamePage: React.FC<CakeGamePageProps> = ({ onBack }) => {
  // 2. State Management
  const [groupIndex, setGroupIndex] = useState(0);
  const [stackedCakes, setStackedCakes] = useState<CakeLayer[]>([]); // Cakes on the stand
  const [availableCakes, setAvailableCakes] = useState<CakeLayer[]>([]); // Cakes on the tray
  const [isRoundComplete, setIsRoundComplete] = useState(false);
  const [shakingId, setShakingId] = useState<string | null>(null);

  const { speak, cancel } = useSpeechSynthesis();
  const { playClap } = useAudio();

  // 3. Start Round (Setup Logic)
  useEffect(() => {
    if (groupIndex >= LETTER_GROUPS.length) {
        speak("Chúc mừng bé! Bé đã hoàn thành tất cả các tầng bánh!");
        return;
    }

    const currentGroup = LETTER_GROUPS[groupIndex];
    
    // Create layer objects with unique IDs and colors
    // We map correct order first to define the "Target Sequence" logic implicitly via index
    const sequence = currentGroup.letters.map((char, index) => ({
        char,
        id: `${char}-${groupIndex}-${index}`,
        color: LAYER_COLORS[(groupIndex * 5 + index) % LAYER_COLORS.length]
    }));

    setStackedCakes([]);
    setIsRoundComplete(false);

    // Shuffle the available cakes for the player to find
    const shuffled = [...sequence].sort(() => Math.random() - 0.5);
    setAvailableCakes(shuffled);

    // Instructions
    const firstChar = sequence[0].char;
    const phonetic = phoneticMap[firstChar] || firstChar;
    setTimeout(() => {
        speak(`Bé hãy tìm chữ ${phonetic} và xếp vào đĩa nhé!`);
    }, 500);

  }, [groupIndex, speak]);

  // 4. Handle Interaction
  const handleCakeClick = (cake: CakeLayer) => {
    if (isRoundComplete || groupIndex >= LETTER_GROUPS.length) return;

    // Logic: Determine which cake needs to be stacked next
    const currentGroup = LETTER_GROUPS[groupIndex];
    const nextIndexNeeded = stackedCakes.length;
    const correctChar = currentGroup.letters[nextIndexNeeded];

    if (cake.char === correctChar) {
        // CORRECT
        const phonetic = phoneticMap[cake.char] || cake.char;
        speak(phonetic);
        
        // Move from available to stacked
        setStackedCakes(prev => [...prev, cake]);
        setAvailableCakes(prev => prev.filter(c => c.id !== cake.id));

        // Check if group is now complete
        if (nextIndexNeeded + 1 === currentGroup.letters.length) {
            handleGroupComplete();
        } else {
             // Prompt for next letter (optional, or just let them explore)
             // const nextChar = currentGroup.letters[nextIndexNeeded + 1];
             // speak(`Tiếp theo là ${phoneticMap[nextChar]}`);
        }
    } else {
        // INCORRECT
        setShakingId(cake.id);
        setTimeout(() => setShakingId(null), 500);
        
        const phoneticCorrect = phoneticMap[correctChar] || correctChar;
        speak(`Chưa đúng rồi. Bé tìm chữ ${phoneticCorrect} nhé!`);
    }
  };

  const handleGroupComplete = () => {
    setIsRoundComplete(true);
    playClap();
    speak("Bánh đẹp quá! Chúc mừng sinh nhật!");

    // Transition Logic: Wait 4 seconds then move to next group
    setTimeout(() => {
        if (groupIndex < LETTER_GROUPS.length - 1) {
            setGroupIndex(prev => prev + 1);
        } else {
            // End Game
            speak("Bé đã hoàn thành xuất sắc! Giỏi quá!");
            setTimeout(onBack, 3000);
        }
    }, 4000);
  };

  return (
    <div className="relative z-20 flex flex-col items-center justify-between h-full min-h-[85vh] p-4 font-quicksand w-full max-w-4xl mx-auto animate-fade-in select-none">
       <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes bounce-soft { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
        @keyframes flame { 0% { transform: scale(1); } 50% { transform: scale(1.1) rotate(2deg); } 100% { transform: scale(1); } }
        .animate-shake { animation: shake 0.4s ease-in-out; }
        .font-quicksand { font-family: 'Quicksand', sans-serif; }
      `}</style>

      {/* Header / Nav */}
      <div className="w-full flex justify-between items-start">
        <button
            className="bg-white/80 text-gray-700 font-bold py-2 px-4 rounded-full shadow-lg hover:bg-white transition-all flex items-center"
            onClick={onBack}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="ml-2 hidden sm:inline">Quay Lại</span>
        </button>
        <div className="bg-pink-100 border-2 border-pink-400 text-pink-600 font-bold px-4 py-1 rounded-full text-lg shadow-sm">
            Tầng {groupIndex + 1} / {LETTER_GROUPS.length}
        </div>
      </div>
        
      <h1 className="text-3xl md:text-5xl font-bold text-pink-600 drop-shadow-sm mt-2 text-center">
          Tiệm Bánh ABC
      </h1>

      {/* Main Game Area: The Cake Stand */}
      <div className="flex-grow flex items-end justify-center w-full max-w-lg relative mt-8 mb-4">
          
          {/* Confetti if round complete */}
          {isRoundComplete && (
              <div className="absolute inset-0 pointer-events-none -top-20">
                  {[...Array(20)].map((_, i) => (
                      <div key={i} className="absolute text-2xl animate-[bounce-soft_2s_infinite]" style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 50}%`,
                          animationDelay: `${Math.random()}s`
                      }}>
                          {['✨', '🧁', '🍬', '🎉'][i % 4]}
                      </div>
                  ))}
              </div>
          )}

          {/* The Stack */}
          <div className="relative flex flex-col-reverse items-center z-10 w-full mb-12">
               {/* Cake Stand Base */}
               <div className="w-48 h-4 bg-gray-300 rounded-full shadow-lg z-0 mb-[-10px]"></div>
               <div className="w-4 h-16 bg-gray-300 z-0"></div>
               <div className="w-64 h-4 bg-gray-300 rounded-full shadow-lg z-0 relative"></div>

               {/* Stacked Layers */}
               {stackedCakes.map((cake, index) => {
                   const width = 240 - index * 20; // Cakes get slightly smaller as they go up
                   return (
                       <div 
                           key={cake.id}
                           className="h-16 rounded-xl flex items-center justify-center border-b-4 border-black/10 shadow-md transition-all duration-500 animate-[bounce-soft_0.5s_ease-out]"
                           style={{ 
                               width: `${width}px`, 
                               backgroundColor: cake.color,
                               zIndex: index + 1
                           }}
                       >
                           <span className="text-4xl font-bold text-white drop-shadow-md">
                               {cake.char}
                           </span>
                           {/* Decoration icing */}
                           <div className="absolute top-0 left-0 w-full h-4 bg-white/30 rounded-t-xl"></div>
                       </div>
                   );
               })}

               {/* Candles (Show only when round is complete) */}
               {isRoundComplete && (
                   <div className="flex justify-center gap-4 mb-2 z-20 animate-[bounce-soft_1s_infinite]">
                       {[1, 2, 3].map(i => (
                           <div key={i} className="flex flex-col items-center">
                               <div className="w-2 h-6 bg-red-500 rounded-sm"></div>
                               <div className="w-3 h-3 bg-yellow-400 rounded-full -mt-8 animate-[flame_0.5s_infinite] shadow-[0_0_10px_orange]"></div>
                           </div>
                       ))}
                   </div>
               )}
          </div>
      </div>

      {/* Available Cakes (Tray) */}
      <div className="w-full bg-white/60 backdrop-blur-md rounded-t-[2rem] p-6 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] border-t-4 border-pink-200">
          <p className="text-center text-gray-600 mb-4 font-bold">
              {isRoundComplete ? "Đang nướng bánh mới..." : "Chọn chữ cái để xếp lên bánh:"}
          </p>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 min-h-[100px]">
              {availableCakes.map((cake) => (
                  <button
                      key={cake.id}
                      onClick={() => handleCakeClick(cake)}
                      className={`
                          w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg border-b-4 border-black/10 active:border-b-0 active:translate-y-1 transition-all transform hover:scale-110
                          ${shakingId === cake.id ? 'animate-shake bg-red-400 ring-4 ring-red-200' : ''}
                      `}
                      style={{ backgroundColor: cake.color }}
                  >
                      {cake.char}
                  </button>
              ))}
          </div>
      </div>
      
    </div>
  );
};

export default CakeGamePage;
