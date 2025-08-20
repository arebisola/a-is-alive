import { useEffect, useRef, useState } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export const MouseTrail = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();
  const mousePos = useRef({ x: 0, y: 0 });
  const isMouseMoving = useRef(false);
  const lastParticleTime = useRef(0);

  const rainbowColors = [
    '#ff0000', // Red
    '#ff7f00', // Orange
    '#ffff00', // Yellow
    '#00ff00', // Green
    '#0000ff', // Blue
    '#4b0082', // Indigo
    '#9400d3', // Violet
    '#ff1493', // Deep Pink
    '#00ffff', // Cyan
    '#ff69b4', // Hot Pink
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse move handler with throttling
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      isMouseMoving.current = true;

      // Throttle particle creation to improve performance
      const now = Date.now();
      if (now - lastParticleTime.current < 50) return; // Throttle to 20fps for particle creation
      lastParticleTime.current = now;

      // Create new particles less frequently
      if (Math.random() > 0.8) {
        const newParticle: Particle = {
          x: e.clientX,
          y: e.clientY,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
          life: 60,
          maxLife: 60,
          color: rainbowColors[Math.floor(Math.random() * rainbowColors.length)],
          size: Math.random() * 4 + 1, // Smaller particles
        };

        particlesRef.current = [...particlesRef.current.slice(-30), newParticle]; // Keep only last 30 particles
      }
    };

    const handleMouseStop = () => {
      isMouseMoving.current = false;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseStop);

    // Optimized animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update particles directly without state
      particlesRef.current = particlesRef.current
        .map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          vx: particle.vx * 0.98, // Slight friction
          vy: particle.vy * 0.98 + 0.1, // Gravity
          life: particle.life - 1,
        }))
        .filter(particle => particle.life > 0);

      // Draw particles with optimized rendering
      particlesRef.current.forEach(particle => {
        const opacity = particle.life / particle.maxLife;
        const size = particle.size * opacity;

        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.fillStyle = particle.color;
        
        // Simple particle without expensive shadow effects
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseStop);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
