import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSpeechSynthesis } from './useSpeechSynthesis';
import { useAudio } from './useAudio';

// Data for the game: Matching Pairs (Uppercase - Lowercase)
const ALPHABET_PAIRS = [
  { id: 'a', upper: 'A', lower: 'a' },
  { id: 'b', upper: 'B', lower: 'b' },
  { id: 'c', upper: 'C', lower: 'c' },
  { id: 'd', upper: 'D', lower: 'd' },
  { id: 'e', upper: 'E', lower: 'e' },
  { id: 'g', upper: 'G', lower: 'g' },
  { id: 'h', upper: 'H', lower: 'h' },
  { id: 'i', upper: 'I', lower: 'i' },
  { id: 'k', upper: 'K', lower: 'k' },
  { id: 'l', upper: 'L', lower: 'l' },
  { id: 'm', upper: 'M', lower: 'm' },
  { id: 'n', upper: 'N', lower: 'n' },
  { id: 'o', upper: 'O', lower: 'o' },
  { id: 'p', upper: 'P', lower: 'p' },
  { id: 'q', upper: 'Q', lower: 'q' },
  { id: 'r', upper: 'R', lower: 'r' },
  { id: 's', upper: 'S', lower: 's' },
  { id: 't', upper: 'T', lower: 't' },
  { id: 'u', upper: 'U', lower: 'u' },
  { id: 'v', upper: 'V', lower: 'v' },
  { id: 'x', upper: 'X', lower: 'x' },
  { id: 'y', upper: 'Y', lower: 'y' },
];

// Phonetic map for "pờ, sờ, cờ..."
const phoneticMap: { [key: string]: string } = {
    'A': 'a.', 'Ă': 'á.', 'Â': 'ớ.', 'B': 'bờ.', 'C': 'cờ.', 'D': 'dờ.', 'Đ': 'đờ.', 
    'E': 'e.', 'Ê': 'ê.', 'G': 'gờ.', 'H': 'hờ.', 'I': 'i.', 'K': 'ca.', 'L': 'lờ.', 
    'M': 'mờ.', 'N': 'nờ.', 'O': 'o.', 'Ô': 'ô.', 'Ơ': 'ơ.', 'P': 'pờ.', 'Q': 'cu.', 
    'R': 'rờ.', 'S': 'sờ.', 'T': 'tờ.', 'U': 'u.', 'Ư': 'ư.', 'V': 'vờ.', 'X': 'xờ.', 'Y': 'y.'
};

interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  isDashed: boolean;
}

interface NoiChuPageProps {
  onBack: () => void;
}

const NoiChuPage: React.FC<NoiChuPageProps> = ({ onBack }) => {
  const [score, setScore] = useState(0);
  
  // Game Data
  const [currentPairs, setCurrentPairs] = useState<typeof ALPHABET_PAIRS>([]);
  const [leftItems, setLeftItems] = useState<typeof ALPHABET_PAIRS>([]);
  const [rightItems, setRightItems] = useState<typeof ALPHABET_PAIRS>([]);
  
  // Game State
  const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null);
  const [completedMatches, setCompletedMatches] = useState<string[]>([]); // Array of pair IDs
  const [wrongMatch, setWrongMatch] = useState<{leftId: string, rightId: string} | null>(null);
  
  // Refs for Line Calculation
  const containerRef = useRef<HTMLDivElement>(null);
  const leftRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const rightRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [lines, setLines] = useState<Line[]>([]);

  const { speak, cancel } = useSpeechSynthesis();
  const { playClap } = useAudio();

  // Start/Reset Round
  const startNewRound = useCallback(() => {
    setWrongMatch(null);
    setSelectedLeftId(null);
    setCompletedMatches([]);
    
    // Pick 3 random pairs
    const shuffled = [...ALPHABET_PAIRS].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 3);
    
    setCurrentPairs(selected);
    // Keep Left somewhat random or sorted? Let's randomize both columns to make it "lộn xộn"
    setLeftItems([...selected].sort(() => Math.random() - 0.5));
    setRightItems([...selected].sort(() => Math.random() - 0.5));
    
    speak("Con hãy chạm vào một chữ Hoa, rồi chạm vào chữ Thường tương ứng nhé!");
  }, [speak]);

  useEffect(() => {
    startNewRound();
  }, [startNewRound]);

  // Calculate SVG Lines
  const calculateLines = useCallback(() => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const newLines: Line[] = [];

    const getCenter = (el: HTMLElement) => {
        const rect = el.getBoundingClientRect();
        return {
            x: rect.left + rect.width / 2 - containerRect.left,
            y: rect.top + rect.height / 2 - containerRect.top
        };
    };

    // 1. Draw Completed Matches (Green Solid)
    completedMatches.forEach(id => {
        const lEl = leftRefs.current[id];
        const rEl = rightRefs.current[id];
        if (lEl && rEl) {
            const start = getCenter(lEl);
            const end = getCenter(rEl);
            newLines.push({ x1: start.x, y1: start.y, x2: end.x, y2: end.y, color: '#4ade80', isDashed: false });
        }
    });

    // 2. Draw Wrong Match (Red Dashed)
    if (wrongMatch) {
        const lEl = leftRefs.current[wrongMatch.leftId];
        const rEl = rightRefs.current[wrongMatch.rightId];
        if (lEl && rEl) {
            const start = getCenter(lEl);
            const end = getCenter(rEl);
            newLines.push({ x1: start.x, y1: start.y, x2: end.x, y2: end.y, color: '#ef4444', isDashed: true });
        }
    }

    setLines(newLines);
  }, [completedMatches, wrongMatch]);

  // Recalculate lines on state change or resize
  useEffect(() => {
    const t = setTimeout(calculateLines, 50);
    window.addEventListener('resize', calculateLines);
    return () => {
        clearTimeout(t);
        window.removeEventListener('resize', calculateLines);
    }
  }, [calculateLines, completedMatches, wrongMatch, leftItems, rightItems]);


  // Interaction Handlers
  const handleLeftClick = (id: string) => {
    if (wrongMatch) return; // Block interaction during error state
    if (completedMatches.includes(id)) return; // Already matched
    
    setSelectedLeftId(id);
    
    // Speak the letter PHONETICALLY
    const pair = currentPairs.find(p => p.id === id);
    if (pair) {
        const phonetic = phoneticMap[pair.upper] || pair.upper;
        speak(phonetic);
    }
  };

  const handleRightClick = (id: string) => {
    if (wrongMatch) return;
    if (completedMatches.includes(id)) return;

    if (!selectedLeftId) {
        speak("Con hãy chọn chữ Hoa trước nhé!");
        return;
    }

    // Check Match
    if (selectedLeftId === id) {
        // Correct
        const newCompleted = [...completedMatches, id];
        setCompletedMatches(newCompleted);
        setSelectedLeftId(null);
        setScore(s => s + 10);
        playClap();
        speak("Tuyệt vời! Chúng là một đôi bạn thân!");
        
        // Check if round complete
        if (newCompleted.length === currentPairs.length) {
            setTimeout(() => {
                speak("Giỏi quá! Câu tiếp theo nhé!");
                setTimeout(startNewRound, 2000);
            }, 1500);
        }
    } else {
        // Incorrect
        setWrongMatch({ leftId: selectedLeftId, rightId: id });
        speak("Ôi, chưa đúng rồi. Con thử lại nhé!");
    }
  };

  const handleRetry = () => {
      setWrongMatch(null);
      // As per requirement, we return to the state where Uppercase was selected
      // selectedLeftId remains active
  };

  return (
    <div className="relative z-20 flex flex-col items-center justify-center h-full p-4 text-center animate-fade-in w-full max-w-5xl mx-auto font-quicksand select-none">
       <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes bounce-in { 0% { transform: scale(0.8); opacity: 0; } 60% { transform: scale(1.1); } 100% { transform: scale(1); opacity: 1; } }
        .font-quicksand { font-family: 'Quicksand', sans-serif; }
      `}</style>

      {/* Navigation & Score */}
      <button
        className="absolute top-0 left-4 md:left-0 bg-white/80 text-gray-700 font-bold py-2 px-4 rounded-full shadow-lg hover:bg-white transition-all flex items-center z-50"
        onClick={onBack}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="ml-2 hidden sm:inline">Quay Lại</span>
      </button>
      
      <div className="absolute top-0 right-4 md:right-0 bg-white/90 text-yellow-600 font-bold py-2 px-6 rounded-full shadow-lg border-2 border-yellow-400 z-50 text-xl">
         Điểm: {score}
      </div>

      <div className="bg-white/60 backdrop-blur-sm p-6 md:p-8 rounded-[2rem] shadow-2xl w-full border-4 border-white mt-12 md:mt-0">
        <h1 className="text-3xl md:text-5xl font-bold text-purple-600 mb-8 drop-shadow-sm uppercase tracking-wider">
            NỐI ĐÔI THẦN TỐC
        </h1>

        <div ref={containerRef} className="relative flex justify-between items-stretch min-h-[300px] gap-8 md:gap-24">
            
            {/* SVG Lines Layer */}
            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 overflow-visible">
                {lines.map((line, i) => (
                    <line 
                        key={i}
                        x1={line.x1} y1={line.y1}
                        x2={line.x2} y2={line.y2}
                        stroke={line.color}
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={line.isDashed ? "12 6" : "none"}
                        className="drop-shadow-md"
                    />
                ))}
            </svg>

            {/* Left Column: Uppercase (WARM COLORS) */}
            <div className="flex flex-col justify-around w-1/3 space-y-6 z-20">
                {leftItems.map((item, index) => {
                    const isSelected = selectedLeftId === item.id;
                    const isMatched = completedMatches.includes(item.id);
                    const isWrong = wrongMatch?.leftId === item.id;
                    
                    return (
                        <div
                            key={item.id}
                            ref={(el) => { leftRefs.current[item.id] = el; }}
                            onClick={() => handleLeftClick(item.id)}
                            className={`
                                relative h-24 md:h-32 rounded-2xl flex items-center justify-center text-4xl md:text-6xl font-bold cursor-pointer shadow-lg transition-all duration-300 border-4
                                ${isMatched ? 'bg-green-100 border-green-400 text-green-600 opacity-80' : ''}
                                ${isSelected && !isMatched ? 'bg-orange-200 border-orange-500 text-orange-800 scale-105 shadow-orange-200 ring-4 ring-orange-200/50' : ''}
                                ${isWrong ? 'bg-red-100 border-red-500 text-red-500' : ''}
                                ${!isSelected && !isMatched && !isWrong ? 'bg-orange-50 border-orange-200 text-orange-700 hover:border-orange-400 hover:scale-105' : ''}
                            `}
                        >
                            {item.upper}
                            {/* Indicator for 'Selected' */}
                            {isSelected && !isMatched && !isWrong && (
                                <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-4 h-4 bg-orange-500 rounded-full animate-pulse" />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Right Column: Lowercase (COOL COLORS) */}
            <div className="flex flex-col justify-around w-1/3 space-y-6 z-20">
                {rightItems.map((item, index) => {
                    const isMatched = completedMatches.includes(item.id);
                    const isWrong = wrongMatch?.rightId === item.id;
                    // If user selected matching Left, highlight this as a potential target? No, keep it simple.

                    return (
                        <div
                            key={item.id}
                            ref={(el) => { rightRefs.current[item.id] = el; }}
                            onClick={() => handleRightClick(item.id)}
                            className={`
                                relative h-24 md:h-32 rounded-2xl flex items-center justify-center text-4xl md:text-6xl font-bold cursor-pointer shadow-lg transition-all duration-300 border-4
                                ${isMatched ? 'bg-green-100 border-green-400 text-green-600 opacity-80' : ''}
                                ${isWrong ? 'bg-red-100 border-red-500 text-red-500' : ''}
                                ${!isMatched && !isWrong ? 'bg-cyan-50 border-cyan-200 text-cyan-700 hover:border-cyan-400 hover:scale-105' : ''}
                            `}
                        >
                            {item.lower}
                        </div>
                    );
                })}
            </div>
        </div>

        {/* Wrong Feedback Overlay (Trang 5 equivalent) */}
        {wrongMatch && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 rounded-[2rem] animate-fade-in">
                <div className="bg-white p-6 rounded-3xl shadow-2xl border-4 border-red-400 flex flex-col items-center animate-bounce-in">
                    <div className="text-5xl mb-4">😓</div>
                    <h3 className="text-xl font-bold text-red-500 mb-2">Chưa đúng rồi!</h3>
                    <p className="text-gray-600 mb-6">Con thử lại nhé!</p>
                    <button 
                        onClick={handleRetry}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all hover:scale-105"
                    >
                        THỬ LẠI
                    </button>
                </div>
            </div>
        )}
        
      </div>
    </div>
  );
};

export default NoiChuPage;