import { useState, useEffect } from "react";
import { AnimatedA } from "@/components/AnimatedA";
import { ParticleField } from "@/components/ParticleField";
import { GeometricBackground } from "@/components/GeometricBackground";
import { MouseTrail } from "@/components/MouseTrail";
import { ScreensaverMode } from "@/components/ScreensaverMode";
import { GravityField } from "@/components/GravityField";
import { useKonamiCode } from "@/hooks/useKonamiCode";
import { audioEffects } from "@/utils/audioEffects";
import { speechSynthesis } from "@/utils/speechSynthesis";

const Index = () => {
  const [showSubtext, setShowSubtext] = useState(false);
  const [isUltraChaosMode, setIsUltraChaosMode] = useState(false);
  const [isScreensaverMode, setIsScreensaverMode] = useState(false);
  const [isGravityMode, setIsGravityMode] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [lastActivity, setLastActivity] = useState(Date.now());
  
  // Track mouse position for gravity effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setLastActivity(Date.now());
    };

    document.addEventListener('mousemove', handleMouseMove);
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
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background layers */}
      <GeometricBackground />
      <ParticleField />
      
      {/* Main content */}
      <div className="text-center z-10">
        <AnimatedA onAnimationComplete={() => setShowSubtext(true)} />
        
        {showSubtext && (
          <div className="mt-8 space-y-4 animate-fade-in">
            <h2 className={`text-2xl font-light text-foreground/80 tracking-widest ${isUltraChaosMode ? 'animate-pulse text-rainbow' : ''}`}>
              IS ALIVE{isUltraChaosMode ? ' AND UNLEASHED!' : ''}
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              {isUltraChaosMode 
                ? "🌟 ULTRA CHAOS MODE ACTIVATED! 🌟 The A has transcended all limits!"
                : "Click the A to witness its transformations. Hover to see it glow. Try rapid clicking for chaos mode!"
              }
            </p>
            {!isUltraChaosMode && (
              <div className="text-xs text-muted-foreground/60 space-y-1">
                <p>🎮 Secret: Try the Konami Code (↑↑↓↓←→←→BA)</p>
                <p>🌙 Screensaver activates after 30 seconds of inactivity</p>
                <p>🎵 Turn up your volume for audio effects!</p>
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
          <div className="absolute top-4 left-4 right-4 text-center">
            <div className="text-xl font-bold text-white animate-bounce">
              ⚡ ULTRA CHAOS MODE ⚡
            </div>
            <div className="text-sm text-white/80 mt-2">
              Reality is breaking down... A is achieving ultimate consciousness!
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
