import React, { useState } from 'react';
import LearningButton from './components/LearningButton';
import InnerPage from './components/InnerPage';
import ChuHoaPage from './components/ChuHoaPage';
import ChuThuongPage from './components/ChuThuongPage';
import TapVietPage from './components/TapVietPage';
import ThucHanhPage from './components/ThucHanhPage';
import ChonTuPage from './components/ChonTuPage';
import NoiChuPage from './components/NoiChuPage';
import VongQuayPage from './components/VongQuayPage';
import CakeGamePage from './components/CakeGamePage';
import { ChuHoaIcon, ChuThuongIcon, TapVietIcon, ThucHanhIcon, ChonTuIcon, NoiChuIcon, VongQuayIcon, CakeIcon } from './components/icons';
import type { LearningButtonData } from './types';

const learningButtons: LearningButtonData[] = [
    { id: 'hoa', circleColor: '#F9D973', label: 'Chữ Hoa', labelColor: '#F4A261', icon: ChuHoaIcon },
    { id: 'thuong', circleColor: '#C4A4E8', label: 'Chữ Thường', labelColor: '#A881D4', icon: ChuThuongIcon },
    { id: 'tap-viet', circleColor: '#F4A67A', label: 'Tập Viết', labelColor: '#E76F51', icon: TapVietIcon },
    { id: 'thuc-hanh', circleColor: '#B7DF92', label: 'Thực Hành', labelColor: '#8BC34A', icon: ThucHanhIcon },
    { id: 'chon-tu', circleColor: '#A4D8E8', label: 'Chọn Từ', labelColor: '#5B99D4', icon: ChonTuIcon },
    { id: 'noi-chu', circleColor: '#A4E8C5', label: 'Nối Chữ', labelColor: '#4CAF50', icon: NoiChuIcon },
    { id: 'vong-quay', circleColor: '#FFAB91', label: 'Vòng Quay', labelColor: '#FF7043', icon: VongQuayIcon },
    { id: 'tiem-banh', circleColor: '#F8BBD0', label: 'Tiệm Bánh', labelColor: '#EC407A', icon: CakeIcon },
];

const Cloud = ({ className = '', style = {} }: { className?: string, style?: React.CSSProperties }) => (
    <div className={`absolute bg-white/60 filter blur-sm rounded-full ${className}`} style={style}></div>
);

const GrassBackground = () => (
    <div className="absolute bottom-0 left-0 w-full h-[30vh]" style={{ zIndex: 1 }}>
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
            <path fill="#4CAF50" fillOpacity="1" d="M0,256L80,240C160,224,320,192,480,197.3C640,203,800,245,960,250.7C1120,256,1280,224,1360,208L1440,192L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
        </svg>
    </div>
);

function App() {
  const [selectedButton, setSelectedButton] = useState<LearningButtonData | null>(null);

  const handleButtonClick = (button: LearningButtonData) => {
    setSelectedButton(button);
  };

  const handleGoBack = () => {
    setSelectedButton(null);
  };

  const renderPage = () => {
    if (!selectedButton) {
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 lg:gap-10 justify-items-center items-end px-4 pb-24 md:pb-32 max-w-6xl mx-auto">
          {learningButtons.map(button => (
            <LearningButton
              key={button.id}
              circleColor={button.circleColor}
              labelColor={button.labelColor}
              label={button.label}
              Icon={button.icon}
              onClick={() => handleButtonClick(button)}
            />
          ))}
        </div>
      );
    }

    switch (selectedButton.id) {
      case 'hoa':
        return <ChuHoaPage onBack={handleGoBack} />;
      case 'thuong':
        return <ChuThuongPage onBack={handleGoBack} />;
      case 'tap-viet':
        return <TapVietPage onBack={handleGoBack} />;
      case 'thuc-hanh':
        return <ThucHanhPage onBack={handleGoBack} />;
      case 'chon-tu':
        return <ChonTuPage onBack={handleGoBack} />;
      case 'noi-chu':
        return <NoiChuPage onBack={handleGoBack} />;
      case 'vong-quay':
        return <VongQuayPage onBack={handleGoBack} />;
      case 'tiem-banh':
        return <CakeGamePage onBack={handleGoBack} />;
      default:
        return <InnerPage button={selectedButton} onBack={handleGoBack} />;
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-sky-300 to-sky-500 flex flex-col">
      <Cloud className="w-64 h-64 -translate-x-1/3" style={{ top: '5%' }} />
      <Cloud className="w-48 h-48 translate-x-1/3" style={{ top: '15%', right: '0' }} />
      <Cloud className="w-32 h-32 -translate-x-1/4" style={{ top: '30%', left: '5%' }} />
      <Cloud className="w-56 h-56" style={{ top: '25%', left: '40%' }} />

      <header className="relative z-20 text-center py-8 md:py-10 flex-shrink-0">
        <h1 className="text-4xl md:text-6xl font-bold text-white" style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.3)' }}>
          Bé Vui Học Chữ
        </h1>
      </header>

      <main className="relative z-20 flex-grow flex flex-col justify-center">
        {renderPage()}
      </main>

      <GrassBackground />
    </div>
  );
}

export default App;