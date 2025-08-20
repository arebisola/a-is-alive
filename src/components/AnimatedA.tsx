import { useEffect, useRef, useState } from "react";
import { animate } from "animejs";
import { audioEffects } from "@/utils/audioEffects";
import { speechSynthesis } from "@/utils/speechSynthesis";
import { useWebcam } from "@/hooks/useWebcam";
import { usePersonality } from "@/hooks/usePersonality";

interface AnimatedAProps {
  onAnimationComplete?: () => void;
}

export const AnimatedA = ({ onAnimationComplete }: AnimatedAProps) => {
  const aRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [currentShape, setCurrentShape] = useState("A");
  const [isGlitching, setIsGlitching] = useState(false);
  const [rapidClickCount, setRapidClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [showWebcamPrompt, setShowWebcamPrompt] = useState(false);
  
  // Array of shapes the A can morph into
  const shapes = ["A", "Ⱥ", "Λ", "∀", "△", "⚡", "★", "◊", "∎", "⬟", "⟐", "⧊", "α", "∆", "⨳"];
  const chaosShapes = ["☽", "☾", "⚡", "⚛", "☯", "⚕", "⚖", "♆", "⧨", "⧬", "⧭", "⧮", "⧯", "⧰", "⧲"];
  
  // Webcam and personality hooks
  const webcam = useWebcam();
  const personality = usePersonality();

  useEffect(() => {
    if (!aRef.current) return;

    // Initial entrance animation
    animate(aRef.current, {
      scale: [0, 1],
      rotate: [180, 0],
      opacity: [0, 1],
      duration: 2000,
      ease: 'outElastic(1, .8)',
      onComplete: onAnimationComplete
    });

    // Continuous floating animation
    animate(aRef.current, {
      translateY: [-10, 10],
      duration: 3000,
      direction: 'alternate',
      loop: true,
      ease: 'inOutSine'
    });
  }, [onAnimationComplete]);

  const handleHover = () => {
    if (!aRef.current) return;
    setIsHovered(true);
    
    // Update personality
    personality.onHover();
    
    // Play ambient space sound
    audioEffects.playAmbientSpace();
    
    animate(aRef.current, {
      scale: 1.2,
      rotate: '+=15',
      duration: 300,
      ease: 'outQuart'
    });
  };

  const handleLeave = () => {
    if (!aRef.current) return;
    setIsHovered(false);
    
    animate(aRef.current, {
      scale: 1,
      rotate: '-=15',
      duration: 300,
      ease: 'outQuart'
    });
  };

  const handleClick = () => {
    if (!aRef.current) return;
    const now = Date.now();
    
    // Check for rapid clicks (chaos mode)
    if (now - lastClickTime < 500) {
      setRapidClickCount(prev => prev + 1);
    } else {
      setRapidClickCount(0);
    }
    setLastClickTime(now);
    
    setClickCount(prev => prev + 1);
    
    // Activate chaos mode with rapid clicks
    if (rapidClickCount >= 5) {
      personality.onRapidClick();
      activateChaosMode();
      return;
    }
    
    // Update personality
    personality.onClick();
    
    // Random shape morphing
    if (Math.random() > 0.3) {
      const newShape = shapes[Math.floor(Math.random() * shapes.length)];
      setCurrentShape(newShape);
    }
    
    const animations = [
      // Spin and scale with sound
      () => {
        audioEffects.playCosmicWhoosh();
        animate(aRef.current, {
          rotate: '+=360',
          scale: [1, 1.5, 1],
          duration: 800,
          ease: 'outBounce'
        });
      },
      // Shake and glow with glitch sound
      () => {
        audioEffects.playGlitchEffect();
        triggerGlitchEffect();
        animate(aRef.current, {
          translateX: [0, -30, 30, -20, 20, -10, 10, 0],
          duration: 600,
          ease: 'outElastic(1, .6)'
        });
      },
      // Morph and color shift with music
      () => {
        audioEffects.playMusicalSequence();
        animate(aRef.current, {
          scale: [1, 0.5, 2, 1],
          rotate: '+=180',
          duration: 1000,
          ease: 'inOutBack'
        });
      },
      // Speech synthesis with personality
      () => {
        const phrase = personality.getPersonalityPhrase();
        speechSynthesis.speakCrazyPhrase();
        // Sometimes speak personality phrase instead
        if (Math.random() > 0.7) {
          setTimeout(() => {
            const utterance = new SpeechSynthesisUtterance(phrase);
            utterance.rate = 0.8;
            utterance.pitch = 1.2;
            speechSynthesis.synth?.speak(utterance);
          }, 1000);
        }
        animate(aRef.current, {
          scale: [1, 1.3, 0.7, 1.1, 1],
          rotate: '+=90',
          duration: 1200,
          ease: 'outElastic(1, .8)'
        });
      }
    ];

    const randomAnimation = animations[clickCount % animations.length];
    randomAnimation();
  };
  
  const triggerGlitchEffect = () => {
    setIsGlitching(true);
    
    // Rapidly change shapes during glitch
    const glitchInterval = setInterval(() => {
      const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
      setCurrentShape(randomShape);
    }, 50);
    
    setTimeout(() => {
      clearInterval(glitchInterval);
      setIsGlitching(false);
      setCurrentShape("A"); // Return to A
    }, 500);
  };
  
  const activateChaosMode = () => {
    audioEffects.playExplosion();
    speechSynthesis.speakRobotic();
    
    // Rapid shape changes
    let chaosCount = 0;
    const chaosInterval = setInterval(() => {
      const randomShape = chaosShapes[Math.floor(Math.random() * chaosShapes.length)];
      setCurrentShape(randomShape);
      chaosCount++;
      
      if (chaosCount >= 20) {
        clearInterval(chaosInterval);
        setCurrentShape("A");
        setRapidClickCount(0);
      }
    }, 100);
    
    // Crazy animation
    animate(aRef.current, {
      scale: [1, 3, 0.5, 2, 1],
      rotate: '+=720',
      translateX: [0, -100, 100, -50, 50, 0],
      translateY: [0, -100, 100, -50, 50, 0],
      duration: 2000,
      ease: 'outElastic(1, .3)'
        });
  };
  
  // Webcam reactivity effects
  useEffect(() => {
    if (webcam.faceDetection) {
      personality.onFaceDetected();
      
      // Dramatic reaction to face detection
      if (aRef.current) {
        // Change to eye emoji when someone is detected
        setCurrentShape("👁️");
        
        // Pulsing glow effect with sound
        animate(aRef.current, {
          scale: [1, 1.3, 1.1],
          rotate: '+=180',
          duration: 1000,
          ease: 'outElastic(1, .8)'
        });
        
        // Play detection sound
        audioEffects.playAmbientSpace();
        
        // Speak detection phrase
        setTimeout(() => {
          speechSynthesis.speakWhisper();
        }, 500);
        
        // Reset shape after a moment
        setTimeout(() => {
          setCurrentShape("A");
        }, 3000);
      }
    }
  }, [webcam.faceDetection]);

  useEffect(() => {
    if (webcam.isSmiling) {
      personality.onSmileDetected();
      
      // Explosive happy reaction when smiling!
      if (aRef.current) {
        // Change to super happy face
        setCurrentShape("😆");
        
        // Multi-stage celebration animation
        animate(aRef.current, {
          rotate: [0, 360, 720],
          scale: [1, 1.8, 1.3],
          translateY: [0, -60, 0],
          duration: 1500,
          ease: 'outBounce'
        });
        
        // Sound celebration
        audioEffects.playMusicalSequence();
        setTimeout(() => audioEffects.playCosmicWhoosh(), 400);
        setTimeout(() => audioEffects.playExplosion(), 800);
        
        // Excited speech
        setTimeout(() => {
          speechSynthesis.speakCrazyPhrase();
        }, 300);
        
        // Trigger glitch effect for extra fun
        setTimeout(() => {
          triggerGlitchEffect();
        }, 600);
        
        // Reset shape after celebration
        setTimeout(() => {
          setCurrentShape("A");
        }, 4000);
      }
    }
  }, [webcam.isSmiling]);

  // ANGRY reaction
  useEffect(() => {
    if (webcam.isAngry) {
      personality.onAngerDetected?.();

      if (aRef.current) {
        setCurrentShape("😡");

        // Rapid shake & red flash
        animate(aRef.current, {
          translateX: [0, -20, 20, -15, 15, -10, 10, 0],
          backgroundColor: ["#f00", "#fff"],
          duration: 600,
          easing: "easeInOutSine"
        });

        audioEffects.playGlitchEffect();

        setTimeout(() => {
          setCurrentShape("A");
        }, 3000);
      }
    }
  }, [webcam.isAngry]);

  // SAD reaction
  useEffect(() => {
    if (webcam.isSad) {
      personality.onSadDetected?.();

      if (aRef.current) {
        setCurrentShape("😢");

        // Slow droop animation
        animate(aRef.current, {
          translateY: [0, 20, 0],
          scale: [1, 0.8, 1],
          duration: 1200,
          easing: "easeInOutQuad"
        });

        audioEffects.playAmbientSpace();

        setTimeout(() => {
          setCurrentShape("A");
        }, 3000);
      }
    }
  }, [webcam.isSad]);
  
  return (
    <div className="relative animated-a-container">
      <div
        ref={aRef}
        className={`
          text-[6rem] sm:text-[8rem] md:text-[10rem] lg:text-[12rem] xl:text-[14rem] font-black cursor-pointer select-none
          bg-gradient-cosmic bg-clip-text text-transparent
          drop-shadow-[0_0_30px_hsl(var(--a-primary)/0.5)]
          transition-all duration-300
          ${isHovered ? 'drop-shadow-[0_0_50px_hsl(var(--a-glow)/0.8)]' : ''}
          ${isGlitching ? 'animate-pulse filter blur-[1px]' : ''}
          ${rapidClickCount >= 3 ? 'animate-bounce' : ''}
          ${personality.getPersonalityCSS()}
          ${webcam.faceDetection ? 'animate-pulse' : ''}
        `}
        onMouseEnter={handleHover}
        onMouseLeave={handleLeave}
        onClick={handleClick}
        style={{
          fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
          textShadow: isGlitching 
            ? '0 0 50px red, 0 0 100px blue, 0 0 150px green' 
            : '0 0 50px hsl(var(--a-primary))',
          filter: isHovered ? 'brightness(1.2) saturate(1.3)' : 'brightness(1) saturate(1)',
          transform: isGlitching ? 'perspective(400px) rotateY(15deg)' : 'none',
        }}
      >
        {currentShape}
      </div>
      
      {/* Glow effect */}
      <div 
        className="absolute inset-0 bg-gradient-glow opacity-30 blur-xl pointer-events-none"
        style={{
          animation: isHovered ? 'pulse-glow 1s ease-in-out infinite' : 'none'
        }}
      />
      
    </div>
  );
};