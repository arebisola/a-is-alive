import { useEffect, useRef, useState } from "react";
import { animate } from "animejs";

interface AnimatedAProps {
  onAnimationComplete?: () => void;
}

export const AnimatedA = ({ onAnimationComplete }: AnimatedAProps) => {
  const aRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [clickCount, setClickCount] = useState(0);

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
    setClickCount(prev => prev + 1);
    
    const animations = [
      // Spin and scale
      () => animate(aRef.current, {
        rotate: '+=360',
        scale: [1, 1.5, 1],
        duration: 800,
        ease: 'outBounce'
      }),
      // Shake and glow
      () => animate(aRef.current, {
        translateX: [0, -30, 30, -20, 20, -10, 10, 0],
        duration: 600,
        ease: 'outElastic(1, .6)'
      }),
      // Morph and color shift
      () => animate(aRef.current, {
        scale: [1, 0.5, 2, 1],
        rotate: '+=180',
        duration: 1000,
        ease: 'inOutBack'
      })
    ];

    const randomAnimation = animations[clickCount % animations.length];
    randomAnimation();
  };

  return (
    <div className="relative">
      <div
        ref={aRef}
        className={`
          text-[20rem] font-black cursor-pointer select-none
          bg-gradient-cosmic bg-clip-text text-transparent
          drop-shadow-[0_0_30px_hsl(var(--a-primary)/0.5)]
          transition-all duration-300
          ${isHovered ? 'drop-shadow-[0_0_50px_hsl(var(--a-glow)/0.8)]' : ''}
        `}
        onMouseEnter={handleHover}
        onMouseLeave={handleLeave}
        onClick={handleClick}
        style={{
          fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
          textShadow: '0 0 50px hsl(var(--a-primary))',
          filter: isHovered ? 'brightness(1.2) saturate(1.3)' : 'brightness(1) saturate(1)',
        }}
      >
        A
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