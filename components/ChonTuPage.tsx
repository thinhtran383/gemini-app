import React, { useState, useEffect } from 'react';
import { useSpeechSynthesis } from './useSpeechSynthesis';
import { useAudio } from './useAudio';

// Data Structure for the game
interface QuestionData {
  id: string;
  word: string;
  missingIndex: number;
  choices: string[];
  imageUrl: string;
  hintContext: string; // Used for the "Con thử xem chữ nào sẽ làm ... nhé"
}

const QUESTIONS: QuestionData[] = [
  {
    id: 'tao',
    word: 'táo',
    missingIndex: 1, // t _ o -> á
    choices: ['a', 'á', 'ơ', 'â'],
    imageUrl: 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=600&q=80', // Real Red Apple
    hintContext: 'quả táo ngon hơn'
  },
  {
    id: 'bong',
    word: 'bóng',
    missingIndex: 1, // b _ n g -> ó
    choices: ['o', 'ô', 'ó', 'ơ'],
    imageUrl: 'https://images.unsplash.com/photo-1510022079733-8b58aca7c4a9?w=600&q=80', // Real Soccer Ball
    hintContext: 'quả bóng đẹp hơn'
  },
  {
    id: 'meo',
    word: 'mèo',
    missingIndex: 1, // m _ o -> è
    choices: ['e', 'ê', 'è', 'é'],
    imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&q=80', // Real Cute Cat
    hintContext: 'chú mèo đáng yêu hơn'
  },
  {
    id: 'ga',
    word: 'gà',
    missingIndex: 1, // g _ -> à
    choices: ['a', 'à', 'á', 'ạ'],
    imageUrl: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=600&q=80', // Real Chicken
    hintContext: 'chú gà gáy to hơn'
  },
  {
    id: 'ca',
    word: 'cá',
    missingIndex: 1,
    choices: ['a', 'á', 'â', 'o'],
    imageUrl: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?w=600&q=80', // Real Goldfish
    hintContext: 'chú cá bơi nhanh hơn'
  },
  {
    id: 'xe',
    word: 'xe',
    missingIndex: 1,
    choices: ['e', 'ê', 'a', 'u'],
    imageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&q=80', // Real Car
    hintContext: 'chiếc xe chạy bon bon'
  },
  {
    id: 'nha',
    word: 'nhà',
    missingIndex: 2,
    choices: ['a', 'à', 'á', 'o'],
    imageUrl: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=600&q=80', // Real House
    hintContext: 'ngôi nhà đẹp hơn'
  },
  {
    id: 'cay',
    word: 'cây',
    missingIndex: 1,
    choices: ['a', 'â', 'ă', 'e'],
    imageUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&q=80', // Real Tree
    hintContext: 'cái cây xanh tốt hơn'
  }
];

interface ChonTuPageProps {
  onBack: () => void;
}

const ChonTuPage: React.FC<ChonTuPageProps> = ({ onBack }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [isAnswered, setIsAnswered] = useState(false);
    const [wrongChoice, setWrongChoice] = useState<string | null>(null);
    const [showThinking, setShowThinking] = useState(false);

    const { speak, cancel } = useSpeechSynthesis();
    const { playClap } = useAudio();

    const currentQuestion = QUESTIONS[currentIndex];
    const correctAnswer = currentQuestion.word[currentQuestion.missingIndex];

    // Initial instruction
    useEffect(() => {
        if (!isAnswered && !showThinking) {
             const t = setTimeout(() => {
                 speak("Bé hãy tìm từ còn thiếu nhé!");
             }, 500);
             return () => clearTimeout(t);
        }
    }, [currentIndex, isAnswered, showThinking, speak]);

    const handleChoiceClick = (choice: string) => {
        if (isAnswered || showThinking) return;

        if (choice === correctAnswer) {
            // CORRECT
            setIsAnswered(true);
            setScore(s => s + 10);
            playClap();
            
            // Success message
            speak(`Xuất sắc! Con đã điền đúng rồi!`, { cancel: false });
            
            // Replay the full sentence (hint context)
            speak(currentQuestion.hintContext, { cancel: false });
        } else {
            // INCORRECT
            setWrongChoice(choice);
            setShowThinking(true);
            
            // Read the wrong choice too? User only said "when correct". 
            // But usually good feedback to hear what they pressed. 
            // Let's just keep existing behavior for wrong choice for now unless asked.
            speak(`Con thử xem chữ nào sẽ làm ${currentQuestion.hintContext} nhé!`);
            
            // Hide modal after delay
            setTimeout(() => {
                setShowThinking(false);
                setWrongChoice(null);
            }, 4000);
        }
    };

    const handleNext = () => {
        cancel(); // Stop any current speech
        if (currentIndex < QUESTIONS.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setIsAnswered(false);
            setWrongChoice(null);
        } else {
            // End of game loop
            setCurrentIndex(0);
            setScore(0);
            setIsAnswered(false);
            setWrongChoice(null);
            speak("Bé đã hoàn thành tất cả các từ! Chúng ta cùng chơi lại nhé!");
        }
    };

    return (
        <div className="relative z-20 flex flex-col items-center justify-center h-full min-h-[80vh] p-4 text-center animate-fade-in w-full max-w-2xl mx-auto font-quicksand">
             <style>{`
                @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes pop { 0% { transform: scale(0.5); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
                @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
                @keyframes float-confetti { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(100px) rotate(360deg); opacity: 0; } }
                .font-quicksand { font-family: 'Quicksand', sans-serif; }
            `}</style>

            {/* Confetti Effect on Success */}
            {isAnswered && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
                    {[...Array(20)].map((_, i) => (
                        <div key={i} className="absolute text-2xl" style={{
                            left: `${Math.random() * 100}%`,
                            top: `-20px`,
                            animation: `float-confetti ${2 + Math.random() * 2}s linear forwards`,
                            animationDelay: `${Math.random() * 0.5}s`
                        }}>
                            {['🎉', '⭐', '✨', '🎈'][Math.floor(Math.random() * 4)]}
                        </div>
                    ))}
                </div>
            )}

            {/* Back & Score */}
            <div className="w-full flex justify-between items-center mb-6">
                <button
                    className="bg-white/80 text-gray-700 font-bold py-2 px-4 rounded-full shadow-lg hover:bg-white transition-all flex items-center"
                    onClick={onBack}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="ml-2 hidden sm:inline">Quay Lại</span>
                </button>
                <div className="bg-yellow-100 border-2 border-yellow-400 text-yellow-700 font-bold px-4 py-1 rounded-full text-xl shadow-md">
                    ⭐ {score}
                </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-[2rem] shadow-2xl w-full border-4 border-white flex flex-col items-center relative">
                
                {/* 1. Large Real Image Display */}
                <div className="w-64 h-52 md:w-80 md:h-64 mb-6 flex items-center justify-center animate-pop relative rounded-2xl overflow-hidden shadow-lg border-4 border-white/50">
                    <img 
                        src={currentQuestion.imageUrl} 
                        alt={currentQuestion.word} 
                        className="w-full h-full object-cover"
                        loading="eager"
                    />
                </div>

                {/* 2. Incomplete Word Blocks */}
                <div className="flex gap-2 md:gap-3 mb-2 justify-center">
                    {currentQuestion.word.split('').map((char, idx) => {
                        const isMissing = idx === currentQuestion.missingIndex;
                        
                        return (
                            <div 
                                key={idx}
                                className={`
                                    w-14 h-16 md:w-16 md:h-20 rounded-xl flex items-center justify-center text-4xl md:text-5xl font-bold transition-all duration-300
                                    ${isMissing 
                                        ? (isAnswered ? 'bg-green-100 border-green-500 text-green-600 scale-110' : 'bg-gray-50 border-2 border-dashed border-blue-400 text-transparent') 
                                        : 'bg-white border-2 border-gray-200 text-gray-800 shadow-sm'}
                                `}
                            >
                                {isMissing && isAnswered ? char : (isMissing ? '?' : char)}
                            </div>
                        );
                    })}
                </div>

                {/* 3. Blurred Hint */}
                <div className="mb-8 relative group">
                    <div 
                        className="text-2xl font-bold text-gray-400 tracking-widest transition-all duration-500 select-none"
                        style={{ filter: isAnswered ? 'none' : 'blur(6px)' }}
                    >
                        {currentQuestion.word}
                    </div>
                </div>

                {/* 4. Choices */}
                {!isAnswered ? (
                     <div className="grid grid-cols-4 gap-3 md:gap-4 w-full">
                        {currentQuestion.choices.map((choice, idx) => {
                            if (choice === wrongChoice) return null; // Hide wrong choice immediately

                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleChoiceClick(choice)}
                                    className="bg-blue-100 hover:bg-blue-200 border-b-4 border-blue-300 text-blue-800 text-3xl md:text-4xl font-bold py-4 rounded-xl shadow-md transition-all active:translate-y-1 active:border-b-0 active:shadow-none h-20 md:h-24 flex items-center justify-center pb-2"
                                >
                                    {choice}
                                </button>
                            );
                        })}
                    </div>
                ) : (
                    <button 
                        onClick={handleNext}
                        className="w-full bg-green-500 hover:bg-green-600 text-white text-2xl font-bold py-4 rounded-xl shadow-[0_4px_0_#15803d] active:shadow-none active:translate-y-1 transition-all animate-pop"
                    >
                        CÂU TIẾP THEO ➜
                    </button>
                )}

                {/* Thinking Face Modal (Incorrect Feedback) */}
                {showThinking && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/95 rounded-[2rem] animate-fade-in">
                        <div className="text-center flex flex-col items-center p-4">
                            <div className="text-8xl mb-4 animate-[shake_0.5s_ease-in-out_infinite]">
                                🤔
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold text-blue-600 mb-2">
                                Bé thử lại nhé!
                            </h3>
                            <p className="text-gray-500 font-medium">
                                Hãy tìm chữ cái đúng nào...
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChonTuPage;