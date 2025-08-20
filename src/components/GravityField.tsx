import { useEffect, useRef, useState } from "react";

interface GravityParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;
  size: number;
  color: string;
  trail: { x: number; y: number }[];
}

interface GravityFieldProps {
  isActive: boolean;
  mousePosition: { x: number; y: number };
}

export const GravityField = ({ isActive, mousePosition }: GravityFieldProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [particles, setParticles] = useState<GravityParticle[]>([]);
  const animationRef = useRef<number>();

  const colors = [
    '#ff0066', '#6600ff', '#0066ff', '#00ff66', '#ff6600',
    '#ff0099', '#9900ff', '#0099ff', '#99ff00', '#ff9900'
  ];

  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create initial particles
    const initialParticles: GravityParticle[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      mass: Math.random() * 5 + 1,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      trail: [],
    }));

    setParticles(initialParticles);

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      setParticles(prevParticles => {
        return prevParticles.map(particle => {
          // Calculate gravity force from mouse
          const dx = mousePosition.x - particle.x;
          const dy = mousePosition.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance > 0) {
            const force = 500 / (distance * distance); // Inverse square law
            const fx = (dx / distance) * force;
            const fy = (dy / distance) * force;
            
            particle.vx += fx / particle.mass;
            particle.vy += fy / particle.mass;
          }

          // Apply friction
          particle.vx *= 0.99;
          particle.vy *= 0.99;

          // Update position
          particle.x += particle.vx;
          particle.y += particle.vy;

          // Bounce off walls
          if (particle.x <= particle.size || particle.x >= canvas.width - particle.size) {
            particle.vx *= -0.8;
            particle.x = Math.max(particle.size, Math.min(canvas.width - particle.size, particle.x));
          }
          if (particle.y <= particle.size || particle.y >= canvas.height - particle.size) {
            particle.vy *= -0.8;
            particle.y = Math.max(particle.size, Math.min(canvas.height - particle.size, particle.y));
          }

          // Update trail
          particle.trail.push({ x: particle.x, y: particle.y });
          if (particle.trail.length > 20) {
            particle.trail.shift();
          }

          // Draw trail
          ctx.strokeStyle = particle.color;
          ctx.lineWidth = 2;
          ctx.globalAlpha = 0.3;
          ctx.beginPath();
          particle.trail.forEach((point, index) => {
            if (index === 0) {
              ctx.moveTo(point.x, point.y);
            } else {
              ctx.lineTo(point.x, point.y);
            }
          });
          ctx.stroke();

          // Draw particle
          ctx.globalAlpha = 0.8;
          ctx.fillStyle = particle.color;
          ctx.shadowBlur = 20;
          ctx.shadowColor = particle.color;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();

          // Draw glow
          ctx.globalAlpha = 0.2;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
          ctx.fill();

          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1;

          return particle;
        });
      });

      // Draw mouse gravity well
      ctx.globalAlpha = 0.1;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(mousePosition.x, mousePosition.y, 50, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, mousePosition]);

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-40"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
