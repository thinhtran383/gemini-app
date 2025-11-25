import React, { useState, useRef, useEffect } from 'react';
import { useSpeechSynthesis } from './useSpeechSynthesis';
import { useAudio } from './useAudio';
import { ShirtIcon, BallIcon, CatIcon, ChickenIcon, AppleIcon, FrogIcon } from './icons';

const alphabet = [
  'a', 'ă', 'â', 'b', 'c', 'd', 'đ', 'e', 'ê', 'g', 'h', 'i', 'k', 'l', 'm',
  'n', 'o', 'ô', 'ơ', 'p', 'q', 'r', 's', 't', 'u', 'ư', 'v', 'x', 'y'
];

const sliceColors = [
    '#EF5350', '#EC407A', '#AB47BC', '#7E57C2', '#5C6BC0', 
    '#42A5F5', '#29B6F6', '#26C6DA', '#26A69A', '#66BB6A',
    '#9CCC65', '#D4E157', '#FFEE58', '#FFCA28', '#FFA726',
    '#FF7043'
];

const phoneticMap: { [key: string]: string } = {
    'a': 'a.', 'ă': 'á.', 'â': 'ớ.', 'b': 'bờ.', 'c': 'cờ.', 'd': 'dờ.', 'đ': 'đờ.', 'e': 'e.', 'ê': 'ê.', 'g': 'gờ.', 'h': 'hờ.', 'i': 'i.', 'k': 'ca.', 'l': 'lờ.', 'm': 'mờ.', 'n': 'nờ.', 'o': 'o.', 'ô': 'ô.', 'ơ': 'ơ.', 'p': 'pờ.', 'q': 'cu.', 'r': 'rờ.', 's': 'sờ.', 't': 'tờ.', 'u': 'u.', 'ư': 'ư.', 'v': 'vờ.', 'x': 'xờ.', 'y': 'y.'
};

// Mapping specifically based on user request and available icons
const imageMap: { [key: string]: { icon: React.FC<React.SVGProps<SVGSVGElement>>, label: string } } = {
    'm': { icon: CatIcon, label: 'Con Mèo' },
    'g': { icon: ChickenIcon, label: 'Con Gà' },
    'b': { icon: BallIcon, label: 'Quả Bóng' },
    // Adding a few more for variety if they hit them
    'a': { icon: ShirtIcon, label: 'Cái Áo' }, 
    'ê': { icon: FrogIcon, label: 'Con Ếch' },
};

interface VongQuayPageProps {
  onBack: () => void;
}

type GameState = 'intro' | 'idle' | 'spinning' | 'result' | 'reward';

const VongQuayPage: React.FC<VongQuayPageProps> = ({ onBack }) => {
  const [gameState, setGameState] = useState<GameState>('intro');
  const [rotation, setRotation] = useState(0);
  const [resultIndex, setResultIndex] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  
  const { speak, cancel } = useSpeechSynthesis();
  const { playClap, playSpin, stopSpin } = useAudio();
  const hintTimeoutRef = useRef<number | null>(null);

  // Wheel constants
  const SIZE = 320;
  const CENTER = SIZE / 2;
  const RADIUS = SIZE / 2 - 10;
  const SLICE_ANGLE = 360 / alphabet.length;

  // Cleanup timer and sounds on unmount or state change
  useEffect(() => {
    return () => {
      if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current as unknown as number);
      stopSpin();
    };
  }, [stopSpin]);

  const startGame = () => {
    setGameState('idle');
    speak("Chào mừng bé đến với Vòng Quay Kỳ Diệu. Hãy nhấn nút Quay nhé!");
  };

  const spinWheel = () => {
    if (gameState !== 'idle' && gameState !== 'reward') return;
    
    cancel(); // Stop speaking
    playSpin(); // Start sound
    
    setGameState('spinning');
    setResultIndex(null);
    setShowHint(false);
    if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current as unknown as number);
    
    // Pick random letter
    const newResultIndex = Math.floor(Math.random() * alphabet.length);
    setResultIndex(newResultIndex);

    // Calculate rotation
    // Target angle for the pointer (top, 270deg)
    const sliceCenterAngle = newResultIndex * SLICE_ANGLE + SLICE_ANGLE / 2;
    
    const currentRotation = rotation;
    const extraSpins = 360 * (5 + Math.floor(Math.random() * 3)); // 5-8 full spins
    
    // Calculate target rotation
    const targetRotation = 270 - sliceCenterAngle; 
    const totalRotation = currentRotation + extraSpins + (targetRotation - (currentRotation % 360));
    
    // Ensure forward rotation
    const finalRotation = totalRotation < currentRotation ? totalRotation + 360 : totalRotation;

    setRotation(finalRotation);

    // Spin duration 3s
    setTimeout(() => {
      handleSpinEnd(newResultIndex);
    }, 3000);
  };

  const handleSpinEnd = (index: number) => {
    stopSpin(); // Stop sound
    setGameState('result');
    const letter = alphabet[index];
    const phonetic = phoneticMap[letter] || letter;
    
    // Play audio: "Chữ gì đây bé ơi?"
    speak("chữ gì đây bé ơi");

    // Start 5s timer for hint
    if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current as unknown as number);
    hintTimeoutRef.current = window.setTimeout(() => {
        triggerHint(phonetic);
    }, 5000);
  };

  const triggerHint = (phonetic: string) => {
      setShowHint(true);
      // Play reminder file
      speak("con quên rồi à cô đọc lại nhé");
      // Then play the letter
      speak(phonetic, { cancel: false });
  };

  const handleLetterInteraction = () => {
      if (gameState !== 'result') return;
      if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current as unknown as number);
      
      // Reward Logic
      playClap();
      speak("Giỏi lắm! Con đã phát âm đúng rồi!");
      setScore(prev => prev + 10);
      setGameState('reward');
  };

  const handleReplay = () => {
    setGameState('idle');
    // Reset rotation visual if needed, or keep it
  };

  // Render Helpers
  const renderSlices = () => {
    return alphabet.map((char, i) => {
      const startAngle = i * SLICE_ANGLE;
      const endAngle = (i + 1) * SLICE_ANGLE;
      
      const startX = CENTER + RADIUS * Math.cos((startAngle * Math.PI) / 180);
      const startY = CENTER + RADIUS * Math.sin((startAngle * Math.PI) / 180);
      const endX = CENTER + RADIUS * Math.cos((endAngle * Math.PI) / 180);
      const endY = CENTER + RADIUS * Math.sin((endAngle * Math.PI) / 180);
      
      const largeArcFlag = SLICE_ANGLE > 180 ? 1 : 0;
      
      const pathData = [
        `M ${CENTER} ${CENTER}`,
        `L ${startX} ${startY}`,
        `A ${RADIUS} ${RADIUS} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
        `Z`
      ].join(' ');
      
      const midAngle = startAngle + SLICE_ANGLE / 2;
      const textRadius = RADIUS * 0.85;
      const textX = CENTER + textRadius * Math.cos((midAngle * Math.PI) / 180);
      const textY = CENTER + textRadius * Math.sin((midAngle * Math.PI) / 180);
  
      return (
        <g key={char}>
          <path d={pathData} fill={sliceColors[i % sliceColors.length]} stroke="white" strokeWidth="1" />
          <text 
              x={textX} 
              y={textY} 
              fill="white" 
              textAnchor="middle" 
              dominantBaseline="middle" 
              fontSize="12" 
              fontWeight="bold"
              transform={`rotate(${midAngle + 90}, ${textX}, ${textY})`}
          >
              {char}
          </text>
        </g>
      );
    });
  };

  return (
    <div className="relative z-20 flex flex-col items-center justify-center h-full min-h-[80vh] p-4 text-center animate-fade-in w-full max-w-4xl mx-auto overflow-hidden font-quicksand">
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes pop-in {
          0% { transform: scale(0); opacity: 0; }
          70% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes pulse-hint {
            0%, 100% { transform: scale(1); box-shadow: 0 0 0 rgba(239, 68, 68, 0); }
            50% { transform: scale(1.05); box-shadow: 0 0 20px rgba(239, 68, 68, 0.5); }
        }
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }
        .font-quicksand { font-family: 'Quicksand', sans-serif; }
      `}</style>

      {/* Back Button */}
      <button
        className="absolute top-4 left-4 z-30 bg-white/90 text-gray-700 font-bold py-2 px-4 rounded-full shadow-lg hover:bg-white transition-all hover:scale-105 flex items-center"
        onClick={onBack}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Quay Lại
      </button>

      {/* Score Display */}
      <div className="absolute top-4 right-4 z-30 bg-white/90 px-6 py-2 rounded-full shadow-lg border-2 border-yellow-400">
        <span className="text-yellow-600 font-bold text-xl">{score} điểm</span>
      </div>

      {/* PAGE 1: INTRO */}
      {gameState === 'intro' && (
        <div className="flex flex-col items-center justify-center animate-pop-in p-8 bg-white/40 backdrop-blur-sm rounded-3xl shadow-2xl border-4 border-white">
            <h1 className="text-5xl md:text-6xl font-bold text-pink-600 mb-8 drop-shadow-md tracking-wide" style={{ textShadow: '2px 2px 0px #fff' }}>
                VÒNG QUAY<br/>KỲ DIỆU
            </h1>
            <div className="w-48 h-48 md:w-64 md:h-64 relative mb-8 animate-[float_3s_ease-in-out_infinite]">
                {/* Representing the Fairy/Baby with a cute combined icon or just the wheel logo */}
                <div className="absolute inset-0 bg-yellow-200 rounded-full opacity-50 blur-xl"></div>
                <CatIcon className="w-full h-full drop-shadow-xl relative z-10" />
            </div>
            <button 
                onClick={startGame}
                className="bg-gradient-to-b from-green-400 to-green-600 text-white text-2xl md:text-3xl font-bold py-4 px-12 rounded-full shadow-[0_6px_0_#166534] active:shadow-none active:translate-y-2 transition-all hover:brightness-110"
            >
                BẮT ĐẦU CHƠI
            </button>
        </div>
      )}

      {/* PAGE 2: WHEEL INTERFACE */}
      {(gameState === 'idle' || gameState === 'spinning') && (
        <div className="flex flex-col items-center justify-center animate-fade-in w-full">
            <div className="relative mb-8 filter drop-shadow-2xl">
                {/* Wheel Pointer */}
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-20 filter drop-shadow-lg">
                    <svg width="60" height="60" viewBox="0 0 60 60">
                        <path d="M30 60 L10 10 L50 10 Z" fill="#EF4444" stroke="white" strokeWidth="3" />
                        <circle cx="30" cy="15" r="5" fill="white" />
                    </svg>
                </div>
                
                {/* Wheel SVG */}
                <svg 
                    width="100%" 
                    viewBox={`0 0 ${SIZE} ${SIZE}`} 
                    className="max-w-[320px] transition-transform duration-3000 ease-out"
                    style={{ 
                        transform: `rotate(${rotation}deg)`,
                        transition: gameState === 'spinning' ? 'transform 3s cubic-bezier(0.25, 0.1, 0.25, 1)' : 'none'
                    }}
                >
                    <g>{renderSlices()}</g>
                    {/* Center Hub */}
                    <circle cx={CENTER} cy={CENTER} r={30} fill="white" stroke="#E5E7EB" strokeWidth="4" />
                    <circle cx={CENTER} cy={CENTER} r={12} fill="#F59E0B" />
                    <path d={`M ${CENTER-8} ${CENTER-4} L ${CENTER-8} ${CENTER+4} L ${CENTER+10} ${CENTER} Z`} fill="white" transform={`translate(${CENTER},${CENTER}) rotate(0)`} /> 
                    {/* Actually just a star or bolt in middle */}
                    <text x={CENTER} y={CENTER} textAnchor="middle" dominantBaseline="middle" fontSize="20">★</text>
                </svg>
            </div>

            <button 
                onClick={spinWheel}
                disabled={gameState === 'spinning'}
                className={`
                    text-3xl font-bold py-4 px-16 rounded-full shadow-[0_6px_0_rgba(0,0,0,0.2)] transition-all transform
                    ${gameState === 'spinning' 
                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                        : 'bg-red-500 hover:bg-red-600 text-white hover:scale-105 active:translate-y-2 active:shadow-none'}
                `}
            >
                {gameState === 'spinning' ? 'ĐANG QUAY...' : 'QUAY'}
            </button>
        </div>
      )}

      {/* PAGE 3 & 4: RESULT & REWARD OVERLAY */}
      {(gameState === 'result' || gameState === 'reward') && resultIndex !== null && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-md p-4 animate-fade-in">
            <div className="bg-white rounded-[2rem] p-8 w-full max-w-md flex flex-col items-center shadow-2xl relative overflow-hidden border-4 border-blue-200 animate-pop-in">
                
                {/* Reward Effects */}
                {gameState === 'reward' && (
                    <>
                        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                             {[...Array(15)].map((_, i) => (
                                <div key={i} className="absolute animate-[float_2s_ease-in_infinite]" style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                    fontSize: '24px',
                                    animationDelay: `${Math.random()}s`
                                }}>
                                    {['⭐', '🎉', '✨', '🎈'][i % 4]}
                                </div>
                            ))}
                        </div>
                        <div className="absolute top-4 right-4 text-yellow-500 font-bold text-2xl animate-bounce">
                            +10 Điểm
                        </div>
                    </>
                )}

                <h2 className="text-2xl md:text-3xl font-bold text-gray-700 mb-6 text-center">
                    {gameState === 'reward' ? 'Tuyệt Vời!' : 'Chữ gì đây bé ơi?'}
                </h2>

                {/* Letter & Image Card */}
                <div 
                    className={`
                        relative bg-orange-50 rounded-3xl p-8 mb-6 cursor-pointer border-4 transition-all duration-300 w-full
                        ${showHint && gameState !== 'reward' ? 'border-red-400 shadow-[0_0_30px_rgba(248,113,113,0.6)] scale-105' : 'border-orange-200'}
                        ${gameState === 'reward' ? 'border-green-400 bg-green-50' : ''}
                        hover:scale-105 active:scale-95
                    `}
                    onClick={handleLetterInteraction}
                >
                    {/* Visual Hint Arrow */}
                    {showHint && gameState !== 'reward' && (
                        <div className="absolute -right-4 top-1/2 -translate-y-1/2 animate-bounce text-4xl text-red-500 filter drop-shadow-lg">
                            👈
                        </div>
                    )}

                    <div className="flex flex-col items-center">
                        <span className={`text-9xl font-extrabold mb-4 drop-shadow-md ${gameState === 'reward' ? 'text-green-600' : 'text-orange-600'}`}>
                            {alphabet[resultIndex]}
                        </span>
                        
                        {/* Real Image (SVG) if mapped */}
                        {imageMap[alphabet[resultIndex]] && (
                            <div className="flex flex-col items-center mt-2">
                                <div className="w-32 h-32">
                                    {React.createElement(imageMap[alphabet[resultIndex]].icon, { className: "w-full h-full" })}
                                </div>
                                <span className="text-xl font-bold text-gray-600 mt-2">
                                    {imageMap[alphabet[resultIndex]].label}
                                </span>
                            </div>
                        )}
                    </div>
                    
                    <p className="text-center text-gray-500 mt-4 font-medium">
                         {gameState === 'reward' ? 'Đúng rồi!' : '(Chạm vào để đọc)'}
                    </p>
                </div>

                {/* Action Button */}
                {gameState === 'reward' && (
                    <button 
                        onClick={handleReplay}
                        className="w-full bg-green-500 hover:bg-green-600 text-white text-xl font-bold py-4 rounded-xl shadow-lg transition-all hover:-translate-y-1 active:translate-y-0"
                    >
                        QUAY TIẾP
                    </button>
                )}
                
                {gameState === 'result' && (
                    <p className="text-lg text-blue-600 font-medium animate-pulse">
                        {showHint ? "Bé chạm vào hình nhé!" : "Bé nghe thấy chữ gì không?"}
                    </p>
                )}
            </div>
        </div>
      )}

    </div>
  );
};

export default VongQuayPage;