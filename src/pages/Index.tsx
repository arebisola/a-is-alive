import { useState, useEffect } from "react";
import { AnimatedA } from "@/components/AnimatedA";
import { ParticleField } from "@/components/ParticleField";
import { GeometricBackground } from "@/components/GeometricBackground";
import { MouseTrail } from "@/components/MouseTrail";
import { ScreensaverMode } from "@/components/ScreensaverMode";
import { GravityField } from "@/components/GravityField";
import { TutorialJoyride } from "@/components/TutorialJoyride";
import { useKonamiCode } from "@/hooks/useKonamiCode";
import { useWebcam } from "@/hooks/useWebcam";
import { usePersonality } from "@/hooks/usePersonality";
import { audioEffects } from "@/utils/audioEffects";
import { speechSynthesis } from "@/utils/speechSynthesis";

const Index = () => {
  const [showSubtext, setShowSubtext] = useState(false);
  const [isUltraChaosMode, setIsUltraChaosMode] = useState(false);
  const [isScreensaverMode, setIsScreensaverMode] = useState(false);
  const [isGravityMode, setIsGravityMode] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [showTutorial, setShowTutorial] = useState(false);
  
  // Initialize webcam and personality hooks
  const webcam = useWebcam();
  const personality = usePersonality();
  
  // Track mouse position for gravity effects with throttling
  useEffect(() => {
    let lastUpdate = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      // Throttle mouse position updates to reduce performance impact
      if (now - lastUpdate > 16) { // ~60fps
        setMousePosition({ x: e.clientX, y: e.clientY });
        lastUpdate = now;
      }
      setLastActivity(now);
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Auto-activate screensaver after inactivity
  useEffect(() => {
    const checkInactivity = setInterval(() => {
      if (Date.now() - lastActivity > 30000 && !isScreensaverMode) { // 30 seconds
        setIsScreensaverMode(true);
      }
    }, 1000);

    return () => clearInterval(checkInactivity);
  }, [lastActivity, isScreensaverMode]);

  const getDominantEmotion = (emotions: any) => {
    if (!emotions) return null;
    return Object.keys(emotions).reduce((a, b) => emotions[a] > emotions[b] ? a : b);
  };

  const dominantEmotion = getDominantEmotion(webcam.emotions);

  // Konami code for ultra chaos mode
  useKonamiCode(() => {
    setIsUltraChaosMode(true);
    setIsGravityMode(true);
    audioEffects.playExplosion();
    speechSynthesis.speakSequence();
    
    // Ultra chaos mode lasts for 30 seconds
    setTimeout(() => {
      setIsUltraChaosMode(false);
      setIsGravityMode(false);
    }, 30000);
  });

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden px-4 py-8 pb-20">
      {/* Background layers */}
      <GeometricBackground />
      <ParticleField />
      
      {/* Fixed positioned controls */}
      <div className="fixed top-4 right-4 z-50 hidden sm:block webcam-controls">
        <button
          onClick={() => webcam.isActive ? webcam.stopWebcam() : webcam.startWebcam()}
          disabled={webcam.isLoading}
          className="px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-sm font-medium hover:scale-105 transition-transform backdrop-blur-sm bg-opacity-90 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {webcam.isLoading 
            ? '🔄 Loading...' 
            : webcam.isActive 
              ? '📷 Stop Camera' 
              : '📷 Start Camera'
          }
        </button>
        {webcam.isActive && (
          <div className={`mt-2 text-sm text-center text-white rounded px-2 py-1 transition-all duration-300 ${
            webcam.faceDetection 
              ? 'bg-green-500/50 backdrop-blur-sm animate-pulse border border-green-300' 
              : 'bg-black/30 backdrop-blur-sm'
          }`}>
            {webcam.faceDetection 
              ? `👁️ I SEE YOU! (${Math.round(webcam.faceDetection.confidence * 100)}%) - ${dominantEmotion ? `You look ${dominantEmotion}!` : 'Try expressing yourself!'}`
              : '🤖 AI Scanning... (Keep neutral face first for calibration)'}
          </div>
        )}
      </div>
      
      {/* Fixed positioned side elements - using actual screen edges */}
      <div className="fixed bottom-4 sm:bottom-8 left-2 sm:left-4 z-50">
        <div className="text-left p-2 sm:p-3 bg-black/30 backdrop-blur-sm rounded-lg border border-white/20 shadow-lg">
          <p className="font-medium text-white text-sm sm:text-base">🌙 Screensaver</p>
          <p className="text-xs text-white/60">30s inactivity</p>
        </div>
      </div>
      
      <div className="fixed bottom-4 sm:bottom-8 right-2 sm:right-4 z-50">
        <div className="text-right p-2 sm:p-3 bg-black/30 backdrop-blur-sm rounded-lg border border-white/20 shadow-lg">
          <p className="font-medium text-white text-sm sm:text-base">🎵 Audio Effects</p>
          <p className="text-xs text-white/60">Turn up volume</p>
        </div>
      </div>
      
      <div className="fixed top-16 sm:top-20 right-2 sm:right-4 z-50">
        <div className="text-right p-2 sm:p-3 bg-black/30 backdrop-blur-sm rounded-lg border border-white/20 shadow-lg">
          <p className="font-medium text-white text-sm sm:text-base">📷 Camera</p>
          <p className="text-xs text-white/60">Facial expressions</p>
        </div>
      </div>
      
      <div className="fixed top-4 left-4 z-50 personality-indicator">
        <div className="text-sm font-medium text-white mb-2 bg-black/30 backdrop-blur-sm rounded-lg px-3 py-2">
          {personality.personality.current.toUpperCase()}
        </div>
        <div className="flex space-x-2 text-sm bg-black/30 backdrop-blur-sm rounded-lg px-3 py-2">
          <span>⚡{Math.round(personality.personality.energy)}</span>
          <span>😊{Math.round(personality.personality.happiness)}</span>
          <span>🌪️{Math.round(personality.personality.chaos)}</span>
          <span>👁️{Math.round(personality.personality.attention)}</span>
        </div>
      </div>
      
      {/* Main content container with better spacing */}
      <div className="flex-1 flex flex-col items-center justify-center text-center z-10 w-full max-w-4xl mx-auto pb-8">
        {/* Letter A section */}
        <div className="flex-shrink-0 mb-6">
          <AnimatedA onAnimationComplete={() => setShowSubtext(true)} />
        </div>
        
        {/* Text content section - with improved hierarchy and spacing */}
        {showSubtext && (
          <div className="flex-shrink-0 space-y-4 sm:space-y-6 animate-fade-in max-w-lg mx-auto">
            <h2 className={`text-lg sm:text-xl md:text-2xl font-light text-foreground/90 tracking-widest ${isUltraChaosMode ? 'animate-pulse text-rainbow' : ''}`}>
              IS ALIVE{isUltraChaosMode ? ' AND UNLEASHED!' : ''}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {isUltraChaosMode 
                ? "🌟 ULTRA CHAOS MODE ACTIVATED! 🌟 The A has transcended all limits!"
                : "Click the A to witness its transformations. Hover to see it glow. Try rapid clicking for chaos mode!"
              }
            </p>
            {!isUltraChaosMode && (
              <div className="text-xs text-muted-foreground/70 leading-relaxed pt-4 border-t border-muted-foreground/20 max-w-2xl">
                <p className="text-center font-medium mb-4">🎮 Secret: Try the Konami Code (↑↑↓↓←→←→BA)</p>
                

                
                <div className="flex justify-center">
                  <button
                    onClick={() => setShowTutorial(true)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-md text-sm font-medium hover:scale-105 transition-transform shadow-lg"
                  >
                    ❓ Show Tutorial
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Crazy effects */}
      <MouseTrail />
      <GravityField isActive={isGravityMode} mousePosition={mousePosition} />
      <ScreensaverMode 
        isActive={isScreensaverMode} 
        onExit={() => {
          setIsScreensaverMode(false);
          setLastActivity(Date.now());
        }} 
      />
      
      {/* Ambient lighting effects */}
      <div className={`fixed inset-0 bg-gradient-glow pointer-events-none ${
        isUltraChaosMode 
          ? 'opacity-60 animate-ping bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500' 
          : 'opacity-20 animate-pulse-glow'
      }`} />
      
      {/* Ultra chaos mode overlay */}
      {isUltraChaosMode && (
        <div className="fixed inset-0 pointer-events-none z-30">
          <div className="w-full h-full bg-gradient-to-r from-red-500/20 via-transparent to-blue-500/20 animate-spin" style={{ animationDuration: '2s' }} />
          <div className="absolute top-4 left-4 right-4 text-center z-40">
            <div className="text-sm sm:text-lg font-bold text-white animate-bounce bg-black/30 backdrop-blur-sm rounded-lg px-3 py-1 mx-auto inline-block">
              ⚡ ULTRA CHAOS MODE ⚡
            </div>
            <div className="text-xs sm:text-sm text-white/80 mt-2 bg-black/20 backdrop-blur-sm rounded px-2 py-1 mx-auto inline-block">
              Reality is breaking down... A is achieving ultimate consciousness!
            </div>
          </div>
        </div>
      )}
      
      {/* Tutorial Joyride */}
      <TutorialJoyride triggerTutorial={showTutorial} onTriggerComplete={() => setShowTutorial(false)} />
    </div>
  );
};

export default Index;
