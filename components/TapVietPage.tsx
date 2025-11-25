
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSpeechSynthesis } from './useSpeechSynthesis';
import { useAudio } from './useAudio';

// Alphabet in lowercase (chữ in thường) - Removed m, n, ơ, p, r, s, u, ư, v, x, y
const ALPHABET = [
  'a', 'ă', 'â', 'b', 'c', 'd', 'đ', 'e', 'ê', 'g', 'h', 'i', 'k', 'l',
  'o', 'ô', 'q', 't'
];

const COLORS = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];

interface Point {
  x: number;
  y: number;
}

interface Stroke {
  points: Point[]; // The ideal path
  id: number;
}

// --- Geometry Helpers for Smooth Curves ---

const toRad = (deg: number) => deg * Math.PI / 180;

const createLine = (p1: Point, p2: Point, steps = 20): Point[] => {
  const pts = [];
  for(let i=0; i<=steps; i++) {
    const t = i/steps;
    pts.push({
      x: p1.x + (p2.x - p1.x) * t,
      y: p1.y + (p2.y - p1.y) * t
    });
  }
  return pts;
};

// Create an elliptical arc. 
// angles in degrees. 0 = East, 90 = South, 180 = West, 270 = North.
const createArc = (cx: number, cy: number, rx: number, ry: number, startDeg: number, endDeg: number, steps = 40): Point[] => {
  const pts = [];
  // Calculate total sweep to handle wrapping if needed, but simple lerp is usually enough for stroke segments
  const sweep = endDeg - startDeg;
  
  for(let i=0; i<=steps; i++) {
    const t = i/steps;
    const deg = startDeg + sweep * t;
    const rad = toRad(deg);
    pts.push({
      x: cx + rx * Math.cos(rad),
      y: cy + ry * Math.sin(rad)
    });
  }
  return pts;
};

// A hook stroke: Vertical line down, then curving up-right at the bottom.
// x, yTop: Start of vertical line
// height: Total height
// width: Width of the hook curve
const createHook = (x: number, yTop: number, height: number, width: number, steps = 30): Point[] => {
    const r = width;
    const straightHeight = height - r;
    const yBottomStraight = yTop + straightHeight;
    
    // Straight part
    const line = createLine({x, y: yTop}, {x, y: yBottomStraight}, Math.floor(steps * 0.6));
    
    // Curve part: From (x, yBottomStraight) curving to (x+r, yTop+height)
    // Arc center is (x+r, yBottomStraight). Start 180 (Left), End 90 (Bottom).
    const arc = createArc(x + r, yBottomStraight, r, r, 180, 90, Math.floor(steps * 0.4));
    
    return [...line, ...arc];
};

// --- Letter Definitions (0-100 Coordinate System) ---

const LETTER_PATHS: Record<string, Stroke[]> = {
  'a': [
    {
        // Stroke 1: Oval body. Center (45, 55). 
        id: 1,
        points: createArc(45, 55, 20, 20, -45, 315) // Start top-right, go CCW full circle
    },
    {
        // Stroke 2: Vertical hook. Starts (65, 35) goes down to (65, 75) with hook.
        id: 2,
        points: createHook(65, 35, 40, 10) // x=65, y=35, h=40 (ends 75), hook radius 10
    }
  ],
  'ă': [
    { id: 1, points: createArc(45, 55, 20, 20, -45, 315) },
    { id: 2, points: createHook(65, 35, 40, 10) },
    { 
        // Breve (bowl up). 
        id: 3, 
        points: createArc(55, 20, 12, 8, 150, 30) // Arc from left to right upwards
    }
  ],
  'â': [
    { id: 1, points: createArc(45, 55, 20, 20, -45, 315) },
    { id: 2, points: createHook(65, 35, 40, 10) },
    { 
        // Hat Up
        id: 3, 
        points: createLine({x: 40, y: 25}, {x: 55, y: 10})
    },
    {
        // Hat Down
        id: 4,
        points: createLine({x: 55, y: 10}, {x: 70, y: 25})
    }
  ],
  'b': [
    {
        // Stroke 1: Vertical line from top
        id: 1,
        points: createLine({x: 30, y: 10}, {x: 30, y: 75})
    },
    {
        // Stroke 2: Belly. Semi-ellipse attached to the line.
        // Starts at intersection (30, 40), curves up-right-down-left to (30, 75)
        id: 2,
        // We simulate the "p" or "b" curve.
        // Arc center (30, 57.5). Rx=25, Ry=17.5.
        // Start -90 (top) to 90 (bottom).
        points: createArc(30, 57.5, 25, 17.5, -90, 90)
    }
  ],
  'c': [
    {
        // Stroke 1: Open circle.
        id: 1,
        // Start Top-Right (-45), curve Top Left (-135), Down Left (-225), Bottom Right (-315)
        // Using negative degrees to go CCW.
        points: createArc(50, 50, 25, 25, -45, -315)
    }
  ],
  'd': [
    {
        // Stroke 1: Oval body (same as a)
        id: 1,
        points: createArc(45, 55, 20, 20, -45, 315)
    },
    {
        // Stroke 2: Tall vertical line + small tail
        id: 2,
        points: createHook(65, 10, 65, 10) // x=65, y=10, h=65 (ends 75), r=10
    }
  ],
  'đ': [
    { id: 1, points: createArc(45, 55, 20, 20, -45, 315) },
    { id: 2, points: createHook(65, 10, 65, 10) },
    {
        // Bar - Moved up to y=25 to avoid touching the circle
        id: 3,
        points: createLine({x: 55, y: 25}, {x: 75, y: 25})
    }
  ],
  'e': [
      {
          // Stroke 1: The loop.
          id: 1,
          points: [
              ...createLine({x: 28, y: 52}, {x: 72, y: 52}),
              ...createArc(50, 52, 22, 22, 0, -320)
          ]
      }
  ],
   'ê': [
      {
         id: 1,
         points: [
             ...createLine({x: 28, y: 52}, {x: 72, y: 52}),
             ...createArc(50, 52, 22, 22, 0, -320)
         ]
      },
       { id: 2, points: createLine({x: 40, y: 22}, {x: 50, y: 12}) },
       { id: 3, points: createLine({x: 50, y: 12}, {x: 60, y: 22}) }
  ],
  'g': [
    {
        // Nét 1: Cong kín (Oval body)
        id: 1,
        points: createArc(45, 40, 20, 20, -45, 315)
    },
    {
        // Nét 2: Khuyết dưới (Lower loop)
        // Starts at top-right of oval (65, 20), goes down, loops left
        id: 2,
        points: [
            ...createLine({x: 65, y: 20}, {x: 65, y: 70}),
            ...createArc(45, 70, 20, 20, 0, 180)
        ]
    }
  ],
  'h': [
    {
        // Nét 1: Nét sổ thẳng (Tall vertical line)
        id: 1,
        points: createLine({x: 30, y: 10}, {x: 30, y: 85})
    },
    {
        // Nét 2: Nét móc hai đầu (Curve and Hook)
        id: 2,
        points: [
            // Curve up from vertical line intersection
            // 180 (West) -> 270 (North/Top) -> 360 (East) to form an Arch
            ...createArc(50, 55, 20, 20, 180, 360), 
            // Vertical down + Hook
            ...createHook(70, 55, 30, 10) // Starts (70,55), ends at y=85 with hook
        ]
    }
  ],
  'i': [
    {
        // Nét 1: Sổ thẳng ngắn (Short vertical line)
        id: 1,
        points: createLine({x: 50, y: 35}, {x: 50, y: 75})
    },
    {
        // Nét 2: Dấu chấm (Dot) - Draw as a small circle
        id: 2,
        points: createArc(50, 20, 3, 3, 0, 360)
    }
  ],
  'k': [
    {
        // Nét 1: Sổ thẳng (Vertical line)
        id: 1,
        points: createLine({x: 35, y: 10}, {x: 35, y: 85})
    },
    {
        // Nét 2: Nét xiên trái (Upper diagonal)
        // From right go in to the line
        id: 2,
        points: createLine({x: 65, y: 35}, {x: 35, y: 60})
    },
    {
        // Nét 3: Nét xiên phải (Lower diagonal)
        // From center go out to right leg
        id: 3,
        points: createLine({x: 35, y: 60}, {x: 70, y: 85})
    }
  ],
  'o': [
      {
          // Stroke 1: Perfect circle/oval
          id: 1,
          points: createArc(50, 50, 22, 22, -45, 315)
      }
  ],
  'ô': [
      { id: 1, points: createArc(50, 50, 22, 22, -45, 315) },
      { id: 2, points: createLine({x: 40, y: 25}, {x: 50, y: 10}) },
      { id: 3, points: createLine({x: 50, y: 10}, {x: 60, y: 25}) }
  ],
  'q': [
    {
        // Nét 1: Cong kín (Oval)
        id: 1,
        points: createArc(45, 50, 20, 20, -45, 315)
    },
    {
        // Nét 2: Sổ thẳng (Vertical line)
        id: 2,
        points: createLine({x: 65, y: 30}, {x: 65, y: 90})
    }
  ],
  't': [
    {
        // Nét 1: Nét hất (Diagonal up)
        // Adjusted to be cleaner: Start at mid-line (y=50) to top of unit (y=35)
        id: 1,
        points: createLine({x: 35, y: 50}, {x: 50, y: 35})
    },
    {
        // Nét 2: Móc ngược (Vertical hook with curve up)
        id: 2,
        points: [
          ...createLine({x: 50, y: 15}, {x: 50, y: 75}),
          ...createArc(60, 75, 10, 10, 180, 0)
        ]
    },
    {
        // Nét 3: Nét ngang (Horizontal bar)
        id: 3,
        points: createLine({x: 38, y: 35}, {x: 62, y: 35})
    }
  ]
};


// Placeholder for others
const DEFAULT_PATH: Stroke[] = [
    { id: 1, points: createLine({x: 50, y: 20}, {x: 50, y: 80}) }
];

const STROKE_THRESHOLD = 30; 

interface TapVietPageProps {
  onBack: () => void;
}

const TapVietPage: React.FC<TapVietPageProps> = ({ onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentStrokeIndex, setCurrentStrokeIndex] = useState(0);
  const [drawnPath, setDrawnPath] = useState<Point[]>([]); 
  const [completedPaths, setCompletedPaths] = useState<Point[][]>([]);
  const [penColor, setPenColor] = useState(COLORS[1]);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const { speak } = useSpeechSynthesis();
  const { playClap } = useAudio();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDrawingRef = useRef(false);

  const currentLetter = ALPHABET[currentIndex];
  const targetStrokes = LETTER_PATHS[currentLetter] || DEFAULT_PATH;

  useEffect(() => {
    resetCanvasState();
    speak(`Con nhìn này! Viết chữ ${currentLetter} nhé!`);
  }, [currentIndex, currentLetter, speak]);

  const resetCanvasState = () => {
    setCompletedPaths([]);
    setDrawnPath([]);
    setCurrentStrokeIndex(0);
    setIsCompleted(false);
    setErrorMsg(null);
    drawCanvas();
  };

  const getScaledPoint = (p: Point, width: number, height: number) => ({
    x: (p.x / 100) * width,
    y: (p.y / 100) * height
  });

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = container.offsetWidth;
    const height = container.offsetHeight;

    if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
    }

    ctx.clearRect(0, 0, width, height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Draw Guide Paths
    targetStrokes.forEach((stroke, idx) => {
        const isCurrent = idx === currentStrokeIndex;
        const isDone = idx < currentStrokeIndex;

        ctx.beginPath();
        if (isDone) {
            ctx.strokeStyle = '#4ade80';
            ctx.lineWidth = 24;
            ctx.setLineDash([]);
            ctx.shadowBlur = 0;
        } else if (isCurrent) {
            ctx.strokeStyle = '#94a3b8'; // Slate 400
            ctx.lineWidth = 28;
            ctx.setLineDash([1, 10]); // Dots
            ctx.shadowColor = "rgba(0,0,0,0.1)";
            ctx.shadowBlur = 5;
        } else {
             ctx.strokeStyle = '#e2e8f0';
             ctx.lineWidth = 24;
             ctx.setLineDash([]);
             ctx.shadowBlur = 0;
        }

        stroke.points.forEach((p, i) => {
            const sp = getScaledPoint(p, width, height);
            if (i === 0) ctx.moveTo(sp.x, sp.y);
            else ctx.lineTo(sp.x, sp.y);
        });
        ctx.stroke();
        ctx.shadowBlur = 0; // Reset shadow
        
        if (isCurrent && !isCompleted) {
            const startP = getScaledPoint(stroke.points[0], width, height);
            
            // Draw start indicator
            ctx.beginPath();
            ctx.fillStyle = '#F59E0B';
            ctx.arc(startP.x, startP.y, 20, 0, Math.PI * 2);
            ctx.fill();
            
            // Pulse ring
            ctx.beginPath();
            ctx.strokeStyle = '#F59E0B';
            ctx.lineWidth = 3;
            ctx.arc(startP.x, startP.y, 28, 0, Math.PI * 2);
            ctx.stroke();

            ctx.fillStyle = 'white';
            ctx.font = 'bold 24px Quicksand';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText((idx + 1).toString(), startP.x, startP.y + 1);
        }
    });

    // Draw User's Completed Paths (Ink style)
    ctx.setLineDash([]);
    ctx.shadowColor = "rgba(0,0,0,0.2)";
    ctx.shadowBlur = 4;
    
    completedPaths.forEach(path => {
        if (path.length < 2) return;
        ctx.beginPath();
        ctx.strokeStyle = penColor;
        ctx.lineWidth = 24;
        path.forEach((p, i) => {
            if (i === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
        });
        ctx.stroke();
    });

    // Draw Current Active Drawing Path
    if (drawnPath.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = penColor;
        ctx.lineWidth = 24;
        drawnPath.forEach((p, i) => {
            if (i === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
        });
        ctx.stroke();
    }

  }, [targetStrokes, currentStrokeIndex, completedPaths, drawnPath, penColor, isCompleted]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);


  const validateStroke = (userPath: Point[], targetStroke: Stroke, width: number, height: number) => {
      let offTrackCount = 0;
      let maxDist = 0;
      
      // Only check sample points to improve perf
      const step = Math.max(1, Math.floor(userPath.length / 50));

      for (let i = 0; i < userPath.length; i += step) {
          const p = userPath[i];
          let minDistance = Infinity;
          
          // Check against all segments of target stroke
          for (let j = 0; j < targetStroke.points.length - 1; j++) {
             const p1 = getScaledPoint(targetStroke.points[j], width, height);
             const p2 = getScaledPoint(targetStroke.points[j+1], width, height);
             const dist = distToSegment(p, p1, p2);
             if (dist < minDistance) minDistance = dist;
          }
          
          if (minDistance > maxDist) maxDist = minDistance;

          if (minDistance > STROKE_THRESHOLD + 15) {
             offTrackCount++;
          }
      }

      // Allow some deviation (20% of points)
      if (offTrackCount > (userPath.length / step) * 0.2) { 
          return { valid: false, reason: 'lem' };
      }

      const startTarget = getScaledPoint(targetStroke.points[0], width, height);
      const endTarget = getScaledPoint(targetStroke.points[targetStroke.points.length - 1], width, height);
      
      const startUser = userPath[0];
      const endUser = userPath[userPath.length - 1];

      const distStart = Math.hypot(startUser.x - startTarget.x, startUser.y - startTarget.y);
      const distEnd = Math.hypot(endUser.x - endTarget.x, endUser.y - endTarget.y);

      if (distStart > 60) return { valid: false, reason: 'wrong_start' }; 
      if (distEnd > 60) return { valid: false, reason: 'incomplete' };

      return { valid: true };
  };

  function distToSegment(p: Point, v: Point, w: Point) {
    const l2 = (v.x - w.x)**2 + (v.y - w.y)**2;
    if (l2 === 0) return Math.hypot(p.x - v.x, p.y - v.y);
    let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(p.x - (v.x + t * (w.x - v.x)), p.y - (v.y + t * (w.y - v.y)));
  }

  const handlePointerDown = (e: React.PointerEvent) => {
      if (isCompleted) return;
      e.preventDefault();
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      isDrawingRef.current = true;
      setDrawnPath([{ x, y }]);
      setErrorMsg(null);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
      if (!isDrawingRef.current || isCompleted) return;
      e.preventDefault();
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setDrawnPath(prev => [...prev, { x, y }]);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
      if (!isDrawingRef.current || isCompleted) return;
      isDrawingRef.current = false;
      
      const canvas = canvasRef.current;
      if (!canvas || drawnPath.length < 5) {
          setDrawnPath([]);
          return;
      }

      const width = canvas.width;
      const height = canvas.height;
      const currentTarget = targetStrokes[currentStrokeIndex];

      const result = validateStroke(drawnPath, currentTarget, width, height);

      if (result.valid) {
          const newCompleted = [...completedPaths, drawnPath];
          setCompletedPaths(newCompleted);
          setDrawnPath([]);
          
          if (currentStrokeIndex + 1 >= targetStrokes.length) {
              setIsCompleted(true);
              setScore(prev => prev + 10);
              playClap();
              speak("Xuất sắc! Bé viết đẹp quá!");
              setTimeout(handleNext, 2000);
          } else {
              setCurrentStrokeIndex(prev => prev + 1);
              speak("Tiếp tục nét tiếp theo nào!");
          }
      } else {
          if (result.reason === 'lem') {
              setErrorMsg("Bé viết lem rồi!");
              speak("Bé viết lem ra ngoài rồi, viết lại nhé!");
          } else if (result.reason === 'wrong_start') {
              setErrorMsg("Bắt đầu từ số " + (currentStrokeIndex + 1) + " nhé!");
              speak("Bé nhìn số " + (currentStrokeIndex + 1) + " để bắt đầu nhé!");
          } else {
              setErrorMsg("Bé viết chưa hết nét!");
              speak("Bé kéo dài thêm chút nữa nhé!");
          }
          
          containerRef.current?.classList.add('animate-shake');
          setTimeout(() => containerRef.current?.classList.remove('animate-shake'), 500);
          setDrawnPath([]);
      }
  };

  const handleNext = () => {
      setCurrentIndex(prev => (prev + 1) % ALPHABET.length);
  };
  
  const handlePrev = () => {
      setCurrentIndex(prev => (prev - 1 + ALPHABET.length) % ALPHABET.length);
  };

  return (
    <div className="relative z-20 flex flex-col items-center justify-center h-full p-4 animate-fade-in w-full max-w-4xl mx-auto font-quicksand select-none">
       <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
        }
        .animate-shake { animation: shake 0.4s ease-in-out; }
      `}</style>

      <button
        className="absolute top-0 left-4 md:left-0 bg-white/80 text-gray-700 font-bold py-2 px-4 rounded-full shadow-lg hover:bg-white transition-all duration-300 ease-in-out flex items-center"
        onClick={onBack}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="ml-2 hidden sm:inline">Quay Lại</span>
      </button>

      <div className="bg-white/90 p-6 rounded-3xl shadow-2xl w-full max-w-md md:max-w-lg flex flex-col items-center border-4 border-blue-200">
        <h1 className="text-3xl font-bold text-blue-600 mb-4 flex items-center gap-2">
           Tập Viết: <span className="text-6xl text-pink-500 font-bold" style={{fontFamily: "'Quicksand', sans-serif"}}>{currentLetter}</span>
        </h1>
        
        <div className="flex justify-between w-full px-4 mb-4">
             <button onClick={handlePrev} className="bg-gray-200 hover:bg-gray-300 rounded-full p-2 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
             <div className="text-xl font-bold text-yellow-600 bg-yellow-100 px-4 py-1 rounded-full flex items-center gap-2">
                ⭐ {score}
            </div>
             <button onClick={handleNext} className="bg-gray-200 hover:bg-gray-300 rounded-full p-2 transition-colors">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>

        <div 
            ref={containerRef}
            className="relative w-full aspect-square bg-white border-4 border-double border-blue-200 rounded-3xl shadow-inner cursor-crosshair touch-none overflow-hidden"
            style={{ 
                backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
                backgroundSize: '20px 20px'
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
        >
            <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
            
            {/* Error Message Toast */}
            {errorMsg && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-2 rounded-full font-bold shadow-lg animate-shake z-20 whitespace-nowrap">
                    {errorMsg}
                </div>
            )}
            
             {/* Success Overlay */}
            {isCompleted && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-10">
                    <div className="text-center animate-bounce">
                        <div className="text-7xl mb-4">🌟</div>
                        <div className="text-4xl font-bold text-green-600 drop-shadow-sm">Tuyệt Vời!</div>
                    </div>
                </div>
            )}
        </div>
        
        <p className="mt-6 text-lg text-gray-600 text-center font-medium bg-blue-50 px-4 py-2 rounded-xl">
            {isCompleted ? "Bé đã hoàn thành!" : `Hãy tô theo nét số ${currentStrokeIndex + 1} màu xám nhé!`}
        </p>
      </div>
    </div>
  );
};

export default TapVietPage;
