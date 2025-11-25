import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSpeechSynthesis } from './useSpeechSynthesis';
import { useAudio } from './useAudio';

const vietnameseAlphabet = [
  'a', 'ă', 'â', 'b', 'c', 'd', 'đ', 'e', 'ê', 'g', 'h', 'i', 'k', 'l', 'm',
  'n', 'o', 'ô', 'ơ', 'p', 'q', 'r', 's', 't', 'u', 'ư', 'v', 'x', 'y'
];

const phoneticMap: { [key: string]: string } = {
    'a': 'a.', 'ă': 'á.', 'â': 'ớ.', 'b': 'bờ.', 'c': 'cờ.', 'd': 'dờ.', 'đ': 'đờ.', 'e': 'e.', 'ê': 'ê.', 'g': 'gờ.', 'h': 'hờ.', 'i': 'i.', 'k': 'ca.', 'l': 'lờ.', 'm': 'mờ.', 'n': 'nờ.', 'o': 'o.', 'ô': 'ô.', 'ơ': 'ơ.', 'p': 'pờ.', 'q': 'cu.', 'r': 'rờ.', 's': 'sờ.', 't': 'tờ.', 'u': 'u.', 'ư': 'ư.', 'v': 'vờ.', 'x': 'xờ.', 'y': 'y.'
};

const letterColors = [
  '#E53935', '#1E88E5', '#43A047', '#F4511E', '#8E24AA', '#00897B', '#D81B60',
];

interface ChuThuongPageProps {
  onBack: () => void;
}

const ChuThuongPage: React.FC<ChuThuongPageProps> = ({ onBack }) => {
  const [score, setScore] = useState(0);
  const [isTesting, setIsTesting] = useState(false);
  const [currentLetter, setCurrentLetter] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ letter: string, status: 'correct' | 'incorrect' } | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  
  const { speak, cancel } = useSpeechSynthesis();
  const { playClap } = useAudio();
  const readAllTimeouts = useRef<number[]>([]);

  const cleanupReadAll = useCallback(() => {
    readAllTimeouts.current.forEach(clearTimeout);
    readAllTimeouts.current = [];
    cancel();
  }, [cancel]);

  useEffect(() => {
    return () => {
      cleanupReadAll();
    };
  }, [cleanupReadAll]);

  const nextQuestion = useCallback(() => {
    setFeedback(null);
    setShowConfetti(false);
    const randomLetter = vietnameseAlphabet[Math.floor(Math.random() * vietnameseAlphabet.length)];
    setCurrentLetter(randomLetter);
    
    // Voice prompt: "Bé hãy tìm chữ..."
    const phonetic = phoneticMap[randomLetter] || randomLetter;
    setTimeout(() => {
      speak(`Bé hãy tìm chữ ${phonetic}`);
    }, 500);
  }, [speak]);

  const handleTestToggle = () => {
    cleanupReadAll();
    if (isTesting) {
      setIsTesting(false);
      setCurrentLetter(null);
      setFeedback(null);
      setShowConfetti(false);
    } else {
      setIsTesting(true);
      setScore(0);
      nextQuestion();
    }
  };

  const handleLetterClick = (letter: string) => {
    if (!isTesting) {
      speak(phoneticMap[letter]);
      return;
    }

    if (letter === currentLetter) {
      // CORRECT
      setScore(prev => prev + 1);
      setFeedback({ letter, status: 'correct' });
      setShowConfetti(true);
      playClap();
      speak("Đúng rồi! Bé giỏi quá!");
      setTimeout(nextQuestion, 2000);
    } else {
      // INCORRECT
      setFeedback({ letter, status: 'incorrect' });
      speak("Sai rồi, bé chọn lại nhé!");
    }
  };
  
  const readAllLetters = () => {
    if (isTesting) return;
    cleanupReadAll();
    
    vietnameseAlphabet.forEach((letter, index) => {
      const timeoutId = setTimeout(() => {
        speak(phoneticMap[letter] || letter, { cancel: false });
      }, index * 1000);
      readAllTimeouts.current.push(timeoutId as unknown as number);
    });
  };

  const getLetterClassName = (letter: string) => {
    if (!feedback || feedback.letter !== letter) return '';
    if (feedback.status === 'correct') return 'animate-correct scale-125 z-10 shadow-xl';
    if (feedback.status === 'incorrect') return 'animate-incorrect';
    return '';
  };

  return (
    <div className="relative z-20 flex flex-col items-center justify-center h-full p-4 text-center animate-fade-in w-full max-w-5xl mx-auto">
       <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes correct-answer {
          0%, 100% { transform: scale(1); color: #4ade80; }
          50% { transform: scale(1.5); color: #fff; background-color: #4ade80; border-radius: 50%; }
        }
        @keyframes incorrect-answer {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px) rotate(-5deg); }
          75% { transform: translateX(8px) rotate(5deg); }
        }
        @keyframes float-up {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
            100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
        .animate-correct { animation: correct-answer 0.6s ease-out forwards; }
        .animate-incorrect { animation: incorrect-answer 0.3s ease-in-out; color: #f87171 !important; }
      `}</style>

      {/* Confetti Overlay */}
      {showConfetti && (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden rounded-3xl">
              {[...Array(30)].map((_, i) => (
                  <div key={i} className="absolute text-3xl" style={{
                      left: `${Math.random() * 100}%`,
                      bottom: '-20px',
                      animation: `float-up ${1.5 + Math.random()}s linear forwards`,
                      animationDelay: `${Math.random() * 0.5}s`
                  }}>
                      {['🎉', '⭐', '✨', '🎈', '💖'][Math.floor(Math.random() * 5)]}
                  </div>
              ))}
          </div>
      )}

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

      <div className="bg-white/50 p-6 rounded-2xl shadow-xl w-full">
        <h1 className="text-3xl md:text-5xl font-bold text-blue-800 mb-6 min-h-[60px] flex items-center justify-center transition-all" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.1)' }}>
          {isTesting 
             ? <span className="text-pink-600 animate-pulse">Bé tìm chữ: {currentLetter}</span> 
             : "Bảng Chữ Cái Thường"}
        </h1>

        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8 gap-3 md:gap-4">
          {vietnameseAlphabet.map((letter, index) => (
            <div
              key={letter}
              className={`aspect-square flex items-center justify-center text-4xl md:text-5xl font-bold cursor-pointer transition-all duration-200 hover:scale-125 rounded-xl ${getLetterClassName(letter)}`}
              style={{
                color: letterColors[index % letterColors.length],
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                backgroundColor: 'rgba(255,255,255,0.6)'
              }}
              onClick={() => handleLetterClick(letter)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => e.key === 'Enter' && handleLetterClick(letter)}
              aria-label={`Chữ ${letter}`}
            >
              {letter}
            </div>
          ))}
        </div>
        
        <div className="mt-8 flex flex-wrap justify-center items-center gap-x-6 gap-y-4">
          <button onClick={readAllLetters} disabled={isTesting} className="py-3 px-6 text-lg border-none rounded-xl cursor-pointer bg-green-500 text-white font-bold shadow-lg hover:bg-green-600 transition-all duration-200 transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100">
            Đọc Tất Cả
          </button>
          <button onClick={handleTestToggle} className={`py-3 px-6 text-lg border-none rounded-xl cursor-pointer text-white font-bold shadow-lg transition-all duration-200 transform hover:scale-105 ${isTesting ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}>
            {isTesting ? 'Dừng Lại' : 'Kiểm Tra'}
          </button>
          <div className="bg-white/70 py-2 px-5 rounded-xl text-2xl font-bold text-gray-700 shadow-inner border-2 border-yellow-200">
            Điểm: <span className="text-yellow-500 drop-shadow-sm">{score}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChuThuongPage;