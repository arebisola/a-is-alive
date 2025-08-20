import { useState } from "react";
import { AnimatedA } from "@/components/AnimatedA";
import { ParticleField } from "@/components/ParticleField";
import { GeometricBackground } from "@/components/GeometricBackground";

const Index = () => {
  const [showSubtext, setShowSubtext] = useState(false);

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
            <h2 className="text-2xl font-light text-foreground/80 tracking-widest">
              IS ALIVE
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              Click the A to witness its transformations. Hover to see it glow.
              Every interaction brings new life to this typographic creature.
            </p>
          </div>
        )}
      </div>
      
      {/* Ambient lighting effects */}
      <div className="fixed inset-0 bg-gradient-glow opacity-20 pointer-events-none animate-pulse-glow" />
    </div>
  );
};

export default Index;
