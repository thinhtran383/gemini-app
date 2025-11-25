
import React, { useState, useEffect, useRef } from 'react';
import { ChickenIcon } from './icons';
import { useSpeechSynthesis } from './useSpeechSynthesis';

const ALPHABET = [
  'A', 'Ă', 'Â', 'B', 'C', 'D', 'Đ', 'E', 'Ê', 'G', 'H', 'I', 'K', 'L', 'M',
  'N', 'O', 'Ô', 'Ơ', 'P', 'Q', 'R', 'S', 'T', 'U', 'Ư', 'V', 'X', 'Y'
];

const CORRECT_SOUND_URL = "https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg";
const WRONG_SOUND_URL = "https://actions.google.com/sounds/v1/cartoon/boing.ogg";

interface ThucHanhPageProps {
  onBack: () => void;
}

interface DraggableLetter {
  id: string;
  char: string;
}

const ThucHanhPage: React.FC<ThucHanhPageProps> = ({ onBack }) => {
  // Game State
  const [currentIndex, setCurrentIndex] = useState(0); // Index of the letter we are currently looking for (0 = A, 1 = Ă...)
  const [currentBatch, setCurrentBatch] = useState<DraggableLetter[]>([]);
  const [draggedChar, setDraggedChar] = useState<string | null>(null);
  
  const { speak } = useSpeechSynthesis();

  // Audio refs
  const correctAudio = useRef<HTMLAudioElement | null>(null);
  const wrongAudio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    correctAudio.current = new Audio(CORRECT_SOUND_URL);
    wrongAudio.current = new Audio(WRONG_SOUND_URL);
    
    // Play instruction on mount
    setTimeout(() => {
        speak("bé hãy sắp xếp chữ cái theo đúng thứ tự nhé");
    }, 500);
  }, [speak]);

  // Generate a new batch of 5 letters whenever the target index changes
  useEffect(() => {
    if (currentIndex >= ALPHABET.length) return;

    const targetChar = ALPHABET[currentIndex];
    
    // Pick 4 distractors (random letters that are NOT the target)
    const otherChars = ALPHABET.filter(c => c !== targetChar);
    const distractors: string[] = [];
    while (distractors.length < 4) {
        const random = otherChars[Math.floor(Math.random() * otherChars.length)];
        if (!distractors.includes(random)) {
            distractors.push(random);
        }
    }

    // Combine and Shuffle
    const rawBatch = [targetChar, ...distractors].sort(() => Math.random() - 0.5);
    
    // Map to objects with IDs
    const batchWithIds = rawBatch.map((char, i) => ({
        id: `batch-${currentIndex}-${i}`,
        char
    }));

    setCurrentBatch(batchWithIds);

  }, [currentIndex]);

  const handleDragStart = (char: string) => {
    setDraggedChar(char);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = () => {
    if (!draggedChar) return;

    const targetChar = ALPHABET[currentIndex];

    if (draggedChar === targetChar) {
        // CORRECT
        if (correctAudio.current) {
            correctAudio.current.currentTime = 0;
            correctAudio.current.play().catch(e => console.error(e));
        }
        // Advance to next letter (Chicken jumps)
        setCurrentIndex(prev => prev + 1);
    } else {
        // WRONG
        if (wrongAudio.current) {
            wrongAudio.current.currentTime = 0;
            wrongAudio.current.play().catch(e => console.error(e));
        }
        alert("Sai rồi bé ơi! Chọn lại nhé!");
    }
    setDraggedChar(null);
  };

  // Determine nest status
  const getNestStatus = (index: number) => {
      if (index < currentIndex) return 'filled';
      if (index === currentIndex) return 'active';
      return 'empty';
  };

  const isGameComplete = currentIndex >= ALPHABET.length;

  return (
    <div className="min-h-screen w-full flex flex-col items-center pt-4 relative font-sans select-none bg-gradient-to-b from-sky-300 to-blue-200">
        
        {/* Navigation */}
        <div className="w-full max-w-6xl flex justify-between items-center px-4 mb-2 z-20">
             <button
                className="bg-white text-blue-600 font-bold py-2 px-4 rounded-full shadow-lg hover:scale-105 transition-all flex items-center border-2 border-blue-200"
                onClick={onBack}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="ml-2 hidden sm:inline">Quay Lại</span>
            </button>
             <div className="bg-yellow-300 text-yellow-900 border-2 border-yellow-500 px-6 py-2 rounded-full font-bold shadow-md text-lg">
                 Tiến độ: {currentIndex} / 29
             </div>
        </div>

        {isGameComplete && (
            <div className="absolute top-40 bg-white border-4 border-yellow-400 text-yellow-600 p-8 rounded-[2rem] shadow-2xl z-50 animate-bounce flex flex-col items-center">
                <div className="text-6xl mb-4">🏆</div>
                <p className="font-bold text-3xl mb-4">Xuất sắc! Bé đã hoàn thành!</p>
                <button 
                    onClick={() => setCurrentIndex(0)}
                    className="bg-blue-500 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-600 shadow-lg text-xl"
                >
                    Chơi Lại
                </button>
            </div>
        )}

        {/* Main Layout */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-12 justify-center items-start mt-4 w-full max-w-6xl px-4 pb-10">
            
            {/* --- LEFT: STRAW HOUSE (Blue & Yellow Theme) --- */}
            <div className="flex flex-col items-center w-full md:w-auto flex-shrink-0 transform md:scale-110 md:mt-10">
                {/* Roof */}
                <div 
                    className="w-0 h-0 border-l-[225px] border-r-[225px] border-b-[120px] border-l-transparent border-r-transparent border-b-[#3b82f6] relative drop-shadow-xl origin-bottom z-10"
                >
                    {/* Roof decoration */}
                    <div className="absolute top-[70px] -left-[30px] w-16 h-16 bg-white/20 rounded-full blur-sm"></div>
                </div>

                {/* House Body */}
                <div 
                    className="bg-[#fff9c4] p-4 md:p-6 rounded-b-3xl shadow-2xl border-x-8 border-b-8 border-[#fbc02d] relative w-full max-w-[450px]"
                    style={{ minHeight: '500px' }}
                >
                    {/* Texture lines */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" 
                         style={{backgroundImage: 'linear-gradient(#fbc02d 1px, transparent 1px)', backgroundSize: '100% 40px'}}>
                    </div>

                    <div className="flex flex-col gap-3 relative z-10">
                        {/* 5 Floors Logic */}
                        <div className="flex justify-center gap-2">{[0, 1, 2, 3, 4, 5].map(idx => (<Nest key={idx} letter={ALPHABET[idx]} status={getNestStatus(idx)} onDrop={handleDrop} isChickenHere={idx === currentIndex} />))}</div>
                        <div className="flex justify-center gap-2">{[6, 7, 8, 9, 10, 11].map(idx => (<Nest key={idx} letter={ALPHABET[idx]} status={getNestStatus(idx)} onDrop={handleDrop} isChickenHere={idx === currentIndex} />))}</div>
                        <div className="flex justify-center gap-2">{[12, 13, 14, 15, 16, 17].map(idx => (<Nest key={idx} letter={ALPHABET[idx]} status={getNestStatus(idx)} onDrop={handleDrop} isChickenHere={idx === currentIndex} />))}</div>
                        <div className="flex justify-center gap-2">{[18, 19, 20, 21, 22, 23].map(idx => (<Nest key={idx} letter={ALPHABET[idx]} status={getNestStatus(idx)} onDrop={handleDrop} isChickenHere={idx === currentIndex} />))}</div>
                        <div className="flex justify-center gap-2">{[24, 25, 26, 27, 28].map(idx => (<Nest key={idx} letter={ALPHABET[idx]} status={getNestStatus(idx)} onDrop={handleDrop} isChickenHere={idx === currentIndex} />))}</div>
                    </div>
                </div>
            </div>

            {/* --- RIGHT: LETTER BATCH (Bright Colors) --- */}
            {!isGameComplete && (
                <div className="flex flex-col items-center bg-white/90 p-6 rounded-[2rem] border-4 border-blue-400 shadow-2xl w-full md:w-40 lg:w-48 sticky top-4 backdrop-blur-sm">
                    <h3 className="text-blue-600 font-extrabold text-xl mb-4 text-center uppercase tracking-wide">Chọn Chữ</h3>
                    
                    <div className="flex flex-row md:flex-col flex-wrap justify-center gap-4">
                        {currentBatch.map((item) => (
                            <div
                                key={item.id}
                                draggable
                                onDragStart={() => handleDragStart(item.char)}
                                className="w-14 h-14 md:w-20 md:h-20 bg-yellow-50 border-4 border-yellow-400 rounded-2xl flex items-center justify-center text-2xl md:text-4xl font-bold cursor-grab active:cursor-grabbing hover:scale-110 hover:bg-yellow-200 transition-all shadow-md text-orange-600"
                            >
                                {item.char}
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-6 text-center text-blue-400 text-sm font-bold hidden md:block">
                        Kéo chữ vào ổ rơm có Gà đang đứng nhé!
                    </div>
                </div>
            )}

        </div>
    </div>
  );
};

// Nest Component
interface NestProps {
    letter: string;
    status: 'empty' | 'active' | 'filled';
    onDrop: () => void;
    isChickenHere: boolean;
}

const Nest: React.FC<NestProps> = ({ letter, status, onDrop, isChickenHere }) => {
    const handleDragOver = (e: React.DragEvent) => {
        if (status === 'active') {
            e.preventDefault(); // Only allow dropping if this is the active nest
        }
    };

    return (
        <div className="relative">
            {/* Chicken Character Jumping on the Active Nest */}
            {isChickenHere && (
                <div className="absolute -top-10 md:-top-14 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none animate-bounce">
                     <div className="w-12 h-12 md:w-16 md:h-16 drop-shadow-lg filter saturate-150">
                         <ChickenIcon className="w-full h-full" />
                     </div>
                </div>
            )}

            <div 
                onDragOver={handleDragOver}
                onDrop={status === 'active' ? onDrop : undefined}
                className={`
                    w-[45px] h-[45px] md:w-[55px] md:h-[55px] 
                    rounded-xl flex items-center justify-center text-2xl md:text-3xl font-bold border-[3px] transition-all duration-300 shadow-sm
                    ${status === 'filled' 
                        ? 'bg-green-400 border-green-600 text-white shadow-inner scale-95' // Correct/Filled
                        : status === 'active'
                            ? 'bg-yellow-300 border-orange-400 text-transparent shadow-[0_0_15px_rgba(250,204,21,0.8)] cursor-pointer animate-pulse' // Target
                            : 'bg-white/60 border-blue-200 text-transparent opacity-70' // Locked/Empty
                    }
                `}
            >
                {status === 'filled' ? letter : ''}
            </div>
        </div>
    );
};

export default ThucHanhPage;
