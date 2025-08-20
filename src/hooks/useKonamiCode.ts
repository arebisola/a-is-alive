import { useEffect, useState } from "react";

// Classic Konami Code: ↑↑↓↓←→←→BA
const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'KeyB', 'KeyA'
];

export const useKonamiCode = (onSuccess: () => void) => {
  const [sequence, setSequence] = useState<string[]>([]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      setSequence(prevSequence => {
        const newSequence = [...prevSequence, event.code];
        
        // Keep only the last 10 keys (length of Konami code)
        if (newSequence.length > KONAMI_CODE.length) {
          newSequence.shift();
        }
        
        // Check if the sequence matches the Konami code
        if (newSequence.length === KONAMI_CODE.length) {
          const isMatch = newSequence.every((key, index) => key === KONAMI_CODE[index]);
          if (isMatch) {
            onSuccess();
            return []; // Reset sequence after success
          }
        }
        
        return newSequence;
      });
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onSuccess]);

  return sequence;
};
