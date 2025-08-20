import { useState, useEffect } from "react";

export type Personality = 'happy' | 'excited' | 'sleepy' | 'angry' | 'mysterious' | 'chaotic' | 'zen';

interface PersonalityState {
  current: Personality;
  energy: number; // 0-100
  happiness: number; // 0-100
  chaos: number; // 0-100
  attention: number; // 0-100
}

export const usePersonality = () => {
  const [personality, setPersonality] = useState<PersonalityState>({
    current: 'zen',
    energy: 50,
    happiness: 50,
    chaos: 0,
    attention: 100
  });

  const [lastInteraction, setLastInteraction] = useState(Date.now());

  // Personality phrases for each mood
  const personalityPhrases = {
    happy: [
      "A is absolutely delighted to see you!",
      "Life is wonderful when you're the letter A!",
      "A is radiating pure joy right now!",
      "Happiness is shaped like the letter A!"
    ],
    excited: [
      "WOW! A is SO PUMPED RIGHT NOW!",
      "ENERGY LEVELS THROUGH THE ROOF!",
      "A is practically vibrating with excitement!",
      "THIS IS THE BEST DAY EVER FOR A!"
    ],
    sleepy: [
      "Zzz... A is feeling quite drowsy...",
      "Maybe just a little nap... A is so sleepy...",
      "Yawn... A needs some coffee...",
      "Sleepy A is dreaming of better typography..."
    ],
    angry: [
      "A is NOT amused right now!",
      "The letter A demands respect!",
      "Stop poking A! It's getting irritated!",
      "A is having a very grumpy moment!"
    ],
    mysterious: [
      "A knows secrets you couldn't imagine...",
      "The letter A sees beyond the veil...",
      "Mysteries of the universe are written in A...",
      "A whispers ancient typographic wisdom..."
    ],
    chaotic: [
      "CHAOS! MAYHEM! A LOVES IT!",
      "Reality is bending around A!",
      "A is breaking all the rules!",
      "ANARCHY IN THE ALPHABET!"
    ],
    zen: [
      "A is at peace with the universe...",
      "Breathe deeply... A is centered...",
      "The letter A flows like water...",
      "Inner harmony achieved by A..."
    ]
  };

  const updatePersonality = (
    energyDelta: number = 0,
    happinessDelta: number = 0,
    chaosDelta: number = 0,
    attentionDelta: number = 0
  ) => {
    setPersonality(prev => {
      const newEnergy = Math.max(0, Math.min(100, prev.energy + energyDelta));
      const newHappiness = Math.max(0, Math.min(100, prev.happiness + happinessDelta));
      const newChaos = Math.max(0, Math.min(100, prev.chaos + chaosDelta));
      const newAttention = Math.max(0, Math.min(100, prev.attention + attentionDelta));

      // Determine personality based on stats
      let newPersonality: Personality = 'zen';
      
      if (newChaos > 80) {
        newPersonality = 'chaotic';
      } else if (newEnergy > 80 && newHappiness > 70) {
        newPersonality = 'excited';
      } else if (newHappiness > 70) {
        newPersonality = 'happy';
      } else if (newEnergy < 30) {
        newPersonality = 'sleepy';
      } else if (newHappiness < 30) {
        newPersonality = 'angry';
      } else if (newAttention < 40) {
        newPersonality = 'mysterious';
      }

      return {
        current: newPersonality,
        energy: newEnergy,
        happiness: newHappiness,
        chaos: newChaos,
        attention: newAttention
      };
    });
    
    setLastInteraction(Date.now());
  };

  // Handle different interaction types
  const onHover = () => {
    updatePersonality(5, 10, 0, 20);
  };

  const onClick = () => {
    updatePersonality(15, 20, 10, 30);
  };

  const onRapidClick = () => {
    updatePersonality(30, 10, 40, 50);
  };

  const onFaceDetected = () => {
    updatePersonality(10, 15, 0, 40);
  };

  const onSmileDetected = () => {
    updatePersonality(20, 30, 0, 30);
  };

  const getPersonalityPhrase = (): string => {
    const phrases = personalityPhrases[personality.current];
    return phrases[Math.floor(Math.random() * phrases.length)];
  };

  const getPersonalityCSS = (): string => {
    switch (personality.current) {
      case 'happy':
        return 'personality-happy filter brightness-125 saturate-150';
      case 'excited':
        return 'animate-bounce personality-happy';
      case 'sleepy':
        return 'personality-sleepy opacity-70';
      case 'angry':
        return 'personality-angry animate-pulse';
      case 'mysterious':
        return 'opacity-80 animate-pulse blur-sm';
      case 'chaotic':
        return 'ultra-chaos animate-spin';
      case 'zen':
        return 'animate-pulse-glow';
      default:
        return '';
    }
  };

  // Personality decay over time
  useEffect(() => {
    const decayInterval = setInterval(() => {
      const timeSinceInteraction = Date.now() - lastInteraction;
      
      // Gradually return to neutral state if no interaction
      if (timeSinceInteraction > 5000) { // 5 seconds
        setPersonality(prev => ({
          ...prev,
          energy: Math.max(50, prev.energy - 1),
          happiness: Math.max(50, prev.happiness - 1),
          chaos: Math.max(0, prev.chaos - 2),
          attention: Math.max(20, prev.attention - 1)
        }));
      }
      
      // Very slow natural personality changes
      if (Math.random() < 0.01) { // 1% chance per interval
        updatePersonality(
          Math.random() * 10 - 5, // -5 to +5
          Math.random() * 10 - 5,
          Math.random() * 5 - 2.5,
          Math.random() * 10 - 5
        );
      }
    }, 1000);

    return () => clearInterval(decayInterval);
  }, [lastInteraction]);

  return {
    personality,
    onHover,
    onClick,
    onRapidClick,
    onFaceDetected,
    onSmileDetected,
    getPersonalityPhrase,
    getPersonalityCSS
  };
};
