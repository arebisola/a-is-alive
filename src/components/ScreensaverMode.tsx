import { useEffect, useRef, useState } from "react";
import { animate } from "animejs";

interface FlyingA {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  scale: number;
  color: string;
  shape: string;
  element?: HTMLDivElement;
}

interface ScreensaverModeProps {
  isActive: boolean;
  onExit: () => void;
}

export const ScreensaverMode = ({ isActive, onExit }: ScreensaverModeProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [flyingAs, setFlyingAs] = useState<FlyingA[]>([]);
  const animationRef = useRef<number>();
  const lastActivityRef = useRef<number>(Date.now());

  const shapes = ["A", "Ⱥ", "Λ", "∀", "△", "⚡", "★", "◊", "∎", "⬟"];
  const colors = [
    '#ff0066', '#6600ff', '#0066ff', '#00ff66', '#ff6600',
    '#ff0099', '#9900ff', '#0099ff', '#99ff00', '#ff9900'
  ];

  useEffect(() => {
    if (!isActive) return;

    // Create initial flying A's
    const initialAs: FlyingA[] = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      rotation: Math.random() * 360,
      scale: Math.random() * 0.5 + 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
    }));

    setFlyingAs(initialAs);

    // Create DOM elements for each flying A
    if (containerRef.current) {
      initialAs.forEach(flyingA => {
        const element = document.createElement('div');
        element.className = `
          absolute text-6xl font-black pointer-events-none select-none
          bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent
        `;
        element.style.left = flyingA.x + 'px';
        element.style.top = flyingA.y + 'px';
        element.style.transform = `rotate(${flyingA.rotation}deg) scale(${flyingA.scale})`;
        element.style.color = flyingA.color;
        element.style.textShadow = `0 0 20px ${flyingA.color}`;
        element.textContent = flyingA.shape;
        
        containerRef.current?.appendChild(element);
        flyingA.element = element;
      });
    }

    // Animation loop
    const animate = () => {
      setFlyingAs(prevAs => {
        return prevAs.map(flyingA => {
          if (!flyingA.element) return flyingA;

          // Update position
          let newX = flyingA.x + flyingA.vx;
          let newY = flyingA.y + flyingA.vy;
          let newVx = flyingA.vx;
          let newVy = flyingA.vy;

          // Bounce off walls
          if (newX <= 0 || newX >= window.innerWidth - 100) {
            newVx = -newVx;
            newX = Math.max(0, Math.min(window.innerWidth - 100, newX));
          }
          if (newY <= 0 || newY >= window.innerHeight - 100) {
            newVy = -newVy;
            newY = Math.max(0, Math.min(window.innerHeight - 100, newY));
          }

          // Update rotation
          const newRotation = (flyingA.rotation + 2) % 360;

          // Update DOM element
          flyingA.element.style.left = newX + 'px';
          flyingA.element.style.top = newY + 'px';
          flyingA.element.style.transform = `rotate(${newRotation}deg) scale(${flyingA.scale})`;

          // Occasionally change shape and color
          if (Math.random() > 0.995) {
            const newShape = shapes[Math.floor(Math.random() * shapes.length)];
            const newColor = colors[Math.floor(Math.random() * colors.length)];
            flyingA.element.textContent = newShape;
            flyingA.element.style.color = newColor;
            flyingA.element.style.textShadow = `0 0 20px ${newColor}`;
            
            return {
              ...flyingA,
              x: newX,
              y: newY,
              vx: newVx,
              vy: newVy,
              rotation: newRotation,
              shape: newShape,
              color: newColor,
            };
          }

          return {
            ...flyingA,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
            rotation: newRotation,
          };
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      // Clean up DOM elements
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [isActive]);

  // Handle user activity to exit screensaver
  useEffect(() => {
    if (!isActive) return;

    const handleActivity = () => {
      onExit();
    };

    const events = ['mousedown', 'mousemove', 'keydown', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [isActive, onExit]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 overflow-hidden">
      <div ref={containerRef} className="relative w-full h-full" />
      
      {/* Screensaver info */}
      <div className="absolute bottom-8 right-8 text-white/50 text-sm">
        A is alive - Screensaver Mode
        <br />
        Move mouse or press any key to exit
      </div>
      
      {/* Subtle background animation */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20 animate-pulse" />
      </div>
    </div>
  );
};
