import { useEffect, useRef } from "react";

// @ts-ignore
const anime = require('animejs');

export const ParticleField = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create particles
    const particleCount = 30;
    const particles: HTMLDivElement[] = [];

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = `
        absolute w-2 h-2 rounded-full opacity-60
        pointer-events-none
      `;
      
      // Random colors from our theme
      const colors = [
        'hsl(var(--a-primary))',
        'hsl(var(--a-secondary))',
        'hsl(var(--a-accent))',
        'hsl(var(--a-glow))'
      ];
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      particle.style.boxShadow = '0 0 10px currentColor';
      
      // Random starting position
      particle.style.left = Math.random() * 100 + 'vw';
      particle.style.top = Math.random() * 100 + 'vh';
      
      containerRef.current.appendChild(particle);
      particles.push(particle);
    }

    // Animate particles
    particles.forEach((particle, index) => {
      anime({
        targets: particle,
        translateX: () => anime.random(-200, 200),
        translateY: () => anime.random(-200, 200),
        scale: [0.5, 1.5, 0.5],
        opacity: [0.3, 0.8, 0.3],
        rotate: () => anime.random(0, 360),
        duration: () => anime.random(3000, 6000),
        delay: index * 100,
        direction: 'alternate',
        loop: true,
        easing: 'easeInOutSine'
      });
    });

    // Cleanup
    return () => {
      particles.forEach(particle => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      });
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: -1 }}
    />
  );
};