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
            linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px), 
            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }} 
      />
      
      {/* Main content */}
      <div className="relative max-w-3xl w-full px-6 z-10">
        {/* Status indicator */}
      
        
        {/* Title */}
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-indigo-200">
              Finding Your Perfect Flight
            </span>
          </h2>
          <p className="text-blue-200">Searching across multiple airlines to get you the best deals</p>
        </div>
        
        {/* Enhanced Flight Path Animation */}
        <div className="relative h-40 mb-6">
          {/* Particles */}
          <div className="absolute inset-0 pointer-events-none">
            {particlesRef.current.map(particle => (
              <div 
                key={particle.id}
                className="absolute bg-blue-400 rounded-full opacity-80"
                style={{
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  left: particle.x,
                  top: particle.y,
                  animation: `float ${particle.animationDuration} ease-in-out infinite alternate, pulse 2s ease-in-out infinite alternate`,
                  animationDelay: particle.delay
                }}
              />
            ))}
          </div>
          
          {/* Flight path */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
            {/* Cloud elements */}
            <ellipse cx="15" cy="15" rx="5" ry="3" fill="rgba(255,255,255,0.1)" />
            <ellipse cx="70" cy="10" rx="8" ry="4" fill="rgba(255,255,255,0.1)" />
            <ellipse cx="40" cy="20" rx="6" ry="3" fill="rgba(255,255,255,0.1)" />
            <ellipse cx="85" cy="25" rx="7" ry="3" fill="rgba(255,255,255,0.1)" />
            
            {/* Curved path */}
            <path 
              ref={pathRef}
              d="M 5,20 C 20,30 35,10 50,20 S 80,30 95,15" 
              fill="none" 
              stroke="rgba(148, 163, 184, 0.2)" 
              strokeWidth="0.5" 
              strokeDasharray="1 1" 
            />
            
            {/* Flight markers */}
            <circle cx="5" cy="20" r="1" fill="#60a5fa" />
            <circle cx="95" cy="15" r="1" fill="#60a5fa" />
          </svg>

          {/* Airplane */}
          <div 
            className="absolute"
            style={{ 
              left: `${planePosition.x}%`, 
              top: `${planePosition.y}px`, 
              transform: `translate(-50%, -50%) rotate(${planePosition.rotate}deg)`,
              transition: 'left 0.3s ease-out, top 0.3s ease-out, transform 0.5s ease-out'
            }}
          >
            <div className="relative">
              <svg className="w-12 h-12 text-white drop-shadow-lg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21,16V14L13,9V3.5A1.5,1.5,0,0,0,11.5,2h0A1.5,1.5,0,0,0,10,3.5V9L2,14V16L10,13.5V19L8,20.5V22L11.5,21L15,22V20.5L13,19V13.5Z" />
              </svg>
              <div className="absolute -bottom-2 left-0 right-0 flex justify-center">
                <div className="relative w-6 h-12 overflow-hidden">
                  <div className="absolute top-0 w-full flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-blue-300 animate-ping" />
                    <div className="w-1 h-8 bg-gradient-to-b from-blue-300 to-transparent mt-1" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Current airline */}
        <div className="bg-white bg-opacity-5 backdrop-filter backdrop-blur-sm rounded-xl p-6 border border-blue-900 border-opacity-30 mb-4 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              Currently searching:
            </h3>
           
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center p-1 bg-gradient-to-br from-blue-400 to-indigo-600 shadow-md">
              <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-blue-900">
                {currentAirline && (
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${currentAirlineIcon.bgClass} flex items-center justify-center`}>
                    <span className="text-white text-xs font-bold">{currentAirlineIcon.code}</span>
                  </div>
                )}
              </div>
            </div>
            <div>
              <p className="text-white font-medium text-lg">{currentAirline}</p>
              <p className="text-blue-200 text-sm">
               
                {animationPhase === 'finalizing' && 'Finalizing search results'}
                {animationPhase === 'complete' && 'Search complete'}
              </p>
            </div>
          </div>
        </div>

        {/* Next airline to search */}
        <div className="bg-white bg-opacity-5 backdrop-filter backdrop-blur-sm rounded-xl p-6 border border-blue-900 border-opacity-30 shadow-lg mb-4">
          <h3 className="text-lg font-medium text-white mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Next search:
          </h3>
          <div className="flex items-center space-x-3 bg-white bg-opacity-5 rounded-lg p-3 border border-blue-900 border-opacity-20">
            <div className="w-10 h-10 rounded-full flex items-center justify-center p-1 bg-gradient-to-br from-purple-600 to-purple-800 shadow-md">
              <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-purple-900">
                <span className="text-white text-xs font-bold">EM</span>
              </div>
            </div>
            <div>
              <span className="text-white font-medium">Emirates</span>
              <div className="text-xs text-blue-200 mt-1">
                Premium airline with connections worldwide
              </div>
            </div>
          </div>
        </div>

        {/* Information panel */}
        <div className="bg-white bg-opacity-5 backdrop-filter backdrop-blur-sm rounded-xl p-4 border border-blue-900 border-opacity-30 shadow-lg">
          <div className="flex items-center text-xs text-blue-200">
            <svg className="w-4 h-4 mr-1 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Searching across multiple airlines to find the best deals for your trip
          </div>
        </div>

        {/* Loading dots */}
        <div className="mt-10 flex justify-center">
          <div className="flex space-x-3">
            {[0, 200, 400].map(delay => (
              <div 
                key={delay}
                className="w-3 h-3 rounded-full bg-blue-300 animate-bounce" 
                style={{ animationDelay: `${delay}ms` }} 
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Animation styles */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          100% { transform: translateY(-20px); }
        }
        
        @keyframes pulse {
          0% { opacity: 0.3; }
          100% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
});

export default ScrapingAnimation;