import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';

interface ScrapingAnimationProps {
  isLoading: boolean;
  airlines?: string[];
}

interface Particle {
  id: number;
  size: number;
  x: string;
  y: string;
  animationDuration: string;
  delay: string;
}

// Constants for better maintainability
const PARTICLE_COUNT = 15;
const MIN_PARTICLE_SIZE = 2;
const MAX_PARTICLE_SIZE = 6;
const MIN_ANIMATION_DURATION = 2;
const MAX_ANIMATION_DURATION = 5;
const INITIAL_DELAY = 1500;
const FINALIZING_DELAY = 1500;
const FRAME_RATE = 16; // ~60fps

const ScrapingAnimation: React.FC<ScrapingAnimationProps> = React.memo(({ 
  isLoading, 
  airlines = ['Qatar Airways', 'Emirates'] 
}) => {
  // State
  const [progress, setProgress] = useState(0);
  const [currentAirlineIndex, setCurrentAirlineIndex] = useState(0);
  const [animationPhase, setAnimationPhase] = useState<'initializing' | 'searching' | 'finalizing' | 'complete'>('initializing');
  const [flightCount, setFlightCount] = useState(0);
  const [planePosition, setPlanePosition] = useState({ x: 0, y: 0, rotate: 0 });
  
  // Refs
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef(0);
  const pathRef = useRef<SVGPathElement | null>(null);

  // Memoized values
  const currentAirline = useMemo(() => airlines[currentAirlineIndex], [airlines, currentAirlineIndex]);
  const nextAirline = useMemo(() => airlines[(currentAirlineIndex + 1) % airlines.length], [airlines, currentAirlineIndex]);

  // Generate particles (memoized with useCallback)
  const generateParticles = useCallback(() => {
    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      id: i,
      size: Math.floor(Math.random() * (MAX_PARTICLE_SIZE - MIN_PARTICLE_SIZE)) + MIN_PARTICLE_SIZE,
      x: `${Math.random() * 100}%`,
      y: `${Math.random() * 30 + 20}px`,
      animationDuration: `${Math.random() * (MAX_ANIMATION_DURATION - MIN_ANIMATION_DURATION) + MIN_ANIMATION_DURATION}s`,
      delay: `${Math.random()}s`
    }));
    particlesRef.current = particles;
  }, []);

  // Handle animation phase changes
  useEffect(() => {
    if (animationPhase === 'searching') {
      generateParticles();
    } else {
      particlesRef.current = [];
    }
  }, [animationPhase, generateParticles]);

  // Generate flight count based on progress
  useEffect(() => {
    if (isLoading && progress > 30 && flightCount === 0) {
      setFlightCount(Math.floor(Math.random() * 15) + 10);
    }
  }, [isLoading, progress, flightCount]);

  // Animate airplane along the path
  const animateAirplane = useCallback(() => {
    if (!pathRef.current) return;
    
    const path = pathRef.current;
    const pathLength = path.getTotalLength();
    const point = path.getPointAtLength(pathLength * (progress / 100));
    
    // Calculate rotation based on the path tangent
    let rotate = 0;
    const delta = 0.01;
    const pointAhead = path.getPointAtLength(Math.min(pathLength * ((progress + delta) / 100), pathLength));
    if (pointAhead.x !== point.x || pointAhead.y !== point.y) {
      rotate = Math.atan2(pointAhead.y - point.y, pointAhead.x - point.x) * (180 / Math.PI);
    }
    
    setPlanePosition({ 
      x: point.x, 
      y: point.y, 
      rotate: rotate
    });
  }, [progress]);

  // Main animation lifecycle
  useEffect(() => {
    if (!isLoading) {
      setProgress(100);
      setAnimationPhase('complete');
      return;
    }

    // Reset animation state
    setAnimationPhase('initializing');
    setProgress(0);
    setCurrentAirlineIndex(0);
    setFlightCount(0);
    lastUpdateTimeRef.current = Date.now();

    const initTimeout = setTimeout(() => {
      setAnimationPhase('searching');
      lastUpdateTimeRef.current = Date.now();
      
      const updateProgress = () => {
        setProgress(prev => {
          const increment = 
            prev < 30 ? Math.random() * 0.5 + 0.1 :
            prev < 70 ? Math.random() * 0.4 + 0.08 :
            Math.random() * 0.25 + 0.05;
          
          const newProgress = prev + increment;
          
          if (newProgress >= 100) {
            if (currentAirlineIndex < airlines.length - 1) {
              setCurrentAirlineIndex(prev => prev + 1);
              return 0;
            } else {
              setAnimationPhase('finalizing');
              setTimeout(() => setAnimationPhase('complete'), FINALIZING_DELAY);
              return 100;
            }
          }
          return newProgress;
        });
      };

      const animate = (timestamp: number) => {
        const elapsed = timestamp - lastUpdateTimeRef.current;
        
        if (elapsed > FRAME_RATE) {
          lastUpdateTimeRef.current = timestamp;
          updateProgress();
          animateAirplane();
        }
        
        animationFrameRef.current = requestAnimationFrame(animate);
      };
      
      animationFrameRef.current = requestAnimationFrame(animate);
    }, INITIAL_DELAY);

    return () => {
      clearTimeout(initTimeout);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isLoading, airlines, currentAirlineIndex, animateAirplane]);

  // Airline icon mapping (memoized)
  const getAirlineIcon = useCallback((name: string) => {
    const airlineLower = name.toLowerCase();
    if (airlineLower.includes('qatar')) {
      return { code: 'QR', bgClass: 'from-purple-700 to-purple-900' };
    }
    if (airlineLower.includes('emirates')) {
      return { code: 'EK', bgClass: 'from-red-600 to-red-800' };
    }
    return { code: name.substring(0, 2).toUpperCase(), bgClass: 'from-blue-600 to-blue-800' };
  }, []);

  const currentAirlineIcon = useMemo(() => 
    currentAirline ? getAirlineIcon(currentAirline) : { code: '', bgClass: '' },
    [currentAirline, getAirlineIcon]
  );
  
  const nextAirlineIcon = useMemo(() => 
    nextAirline ? getAirlineIcon(nextAirline) : { code: '', bgClass: '' },
    [nextAirline, getAirlineIcon]
  );

  if (!isLoading && animationPhase === 'complete') return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 flex flex-col items-center justify-center z-50 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-blue-600 rounded-full mix-blend-screen filter blur-3xl opacity-20" />
        <div className="absolute bottom-1/4 right-1/4 w-56 h-56 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-10" />
        <div className="absolute top-1/3 right-1/3 w-40 h-40 bg-indigo-500 rounded-full mix-blend-screen filter blur-3xl opacity-15" />
      </div>
      
      {/* Grid pattern */}
      <div 
        className="absolute inset-0" 
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
      
      {/* Main content container */}
      <div className="relative z-10 text-center max-w-2xl mx-auto px-6">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="relative w-64 h-2 bg-gray-700 rounded-full mx-auto overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse" />
          </div>
          <p className="text-white/80 text-sm mt-2">{Math.round(progress)}% Complete</p>
        </div>

        {/* Status messages */}
        <div className="mb-6">
          {animationPhase === 'initializing' && (
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Initializing Flight Search</h2>
              <p className="text-blue-200">Setting up search parameters...</p>
            </div>
          )}
          
          {animationPhase === 'searching' && (
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-4">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${currentAirlineIcon.bgClass} flex items-center justify-center text-white font-bold text-sm`}>
                  {currentAirlineIcon.code}
                </div>
                <div className="text-left">
                  <h2 className="text-xl font-semibold text-white">Searching {currentAirline}</h2>
                  <p className="text-blue-200 text-sm">Found {flightCount} flights so far</p>
                </div>
              </div>
              
              {nextAirline && currentAirlineIndex < airlines.length - 1 && (
                <div className="text-xs text-gray-400">
                  Next: {nextAirline}
                </div>
              )}
            </div>
          )}
          
          {animationPhase === 'finalizing' && (
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Finalizing Results</h2>
              <p className="text-blue-200">Processing and organizing flight data...</p>
            </div>
          )}
        </div>

        {/* Animated flight path */}
        <div className="relative w-80 h-40 mx-auto mb-6">
          <svg className="w-full h-full" viewBox="0 0 320 160">
            <path
              ref={pathRef}
              d="M 20 80 Q 80 20 160 80 T 300 80"
              stroke="rgba(59, 130, 246, 0.3)"
              strokeWidth="2"
              fill="none"
              strokeDasharray="5,5"
              className="animate-pulse"
            />
            
            {/* Animated airplane */}
            <g
              transform={`translate(${planePosition.x}, ${planePosition.y}) rotate(${planePosition.rotate})`}
              className="transition-transform duration-100"
            >
              <path
                d="M -8 0 L 8 0 L 4 -4 L 0 -8 L -4 -4 Z"
                fill="#3B82F6"
                className="drop-shadow-lg"
              />
            </g>
          </svg>
        </div>

        {/* Floating particles during search */}
        {animationPhase === 'searching' && (
          <div className="absolute inset-0 pointer-events-none">
            {particlesRef.current.map((particle) => (
              <div
                key={particle.id}
                className="absolute bg-blue-400 rounded-full animate-bounce opacity-60"
                style={{
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  left: particle.x,
                  top: particle.y,
                  animationDuration: particle.animationDuration,
                  animationDelay: particle.delay,
                }}
              />
            ))}
          </div>
        )}

        {/* Loading spinner */}
        <div className="flex justify-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    </div>
  );
});

ScrapingAnimation.displayName = 'ScrapingAnimation';

export default ScrapingAnimation;