import { useEffect, useRef } from "react";
// @ts-ignore
import anime from "animejs";

export const GeometricBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create geometric shapes
    const shapes = ['triangle', 'circle', 'square'];
    const shapeElements: HTMLDivElement[] = [];

    for (let i = 0; i < 8; i++) {
      const shape = document.createElement('div');
      const shapeType = shapes[Math.floor(Math.random() * shapes.length)];
      
      shape.className = `
        absolute opacity-10 pointer-events-none
        border-2 border-a-primary/20
      `;
      
      // Shape-specific styling
      switch (shapeType) {
        case 'circle':
          shape.style.width = '100px';
          shape.style.height = '100px';
          shape.style.borderRadius = '50%';
          break;
        case 'triangle':
          shape.style.width = '0';
          shape.style.height = '0';
          shape.style.borderLeft = '50px solid transparent';
          shape.style.borderRight = '50px solid transparent';
          shape.style.borderBottom = '87px solid hsl(var(--a-primary) / 0.1)';
          shape.style.border = 'none';
          break;
        case 'square':
          shape.style.width = '80px';
          shape.style.height = '80px';
          shape.style.transform = 'rotate(45deg)';
          break;
      }
      
      // Random position
      shape.style.left = Math.random() * 100 + 'vw';
      shape.style.top = Math.random() * 100 + 'vh';
      
      containerRef.current.appendChild(shape);
      shapeElements.push(shape);
    }

    // Animate shapes
    shapeElements.forEach((shape, index) => {
      anime({
        targets: shape,
        translateX: () => anime.random(-100, 100),
        translateY: () => anime.random(-100, 100),
        rotate: '+=360',
        scale: [0.8, 1.2, 0.8],
        opacity: [0.05, 0.15, 0.05],
        duration: () => anime.random(8000, 15000),
        delay: index * 1000,
        direction: 'alternate',
        loop: true,
        easing: 'easeInOutQuad'
      });
    });

    // Cleanup
    return () => {
      shapeElements.forEach(shape => {
        if (shape.parentNode) {
          shape.parentNode.removeChild(shape);
        }
      });
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: -2 }}
    />
  );
};