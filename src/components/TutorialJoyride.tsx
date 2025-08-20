import Joyride, { CallBackProps, STATUS, Step, Placement } from 'react-joyride';
import { useState, useEffect } from 'react';

interface TutorialJoyrideProps {
  onComplete?: () => void;
  triggerTutorial?: boolean;
  onTriggerComplete?: () => void;
}

export const TutorialJoyride = ({ onComplete, triggerTutorial, onTriggerComplete }: TutorialJoyrideProps) => {
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const isMobile = window.innerWidth < 768;

  // Check if user has seen the tutorial before
  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('a-is-alive-tutorial-seen');
    if (!hasSeenTutorial) {
      // Start tutorial after 3 seconds to let the A animation complete
      setTimeout(() => {
        setStepIndex(0); // Reset to first step
        setRun(true);
      }, 3000);
    }
  }, []);

  // Handle manual tutorial trigger
  useEffect(() => {
    if (triggerTutorial) {
      setStepIndex(0); // Reset to first step
      setRun(true);
      onTriggerComplete?.();
    }
  }, [triggerTutorial, onTriggerComplete]);

  const stopTutorial = () => {
    setRun(false);
    localStorage.setItem('a-is-alive-tutorial-seen', 'true');
  };

  const baseSteps = [
    {
      target: '.animated-a-container',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2">Welcome to A is Alive! 🎉</h3>
          <p className="mb-2">This is your interactive letter A - it has its own personality and responds to your actions!</p>
          <p className="text-sm text-gray-600">Let's take a quick tour to show you how to interact with it.</p>
        </div>
      ),
      placement: 'bottom' as Placement,
      disableBeacon: true,
    },
    {
      target: '.animated-a-container',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2">{isMobile ? 'Tap the A!' : 'Click the A!'} 🖱️</h3>
          <p className="mb-2">Each {isMobile ? 'tap' : 'click'} triggers different animations, sounds, and shape transformations.</p>
          <p className="text-sm text-gray-600">The A has multiple personalities that change based on how you interact with it!</p>
        </div>
      ),
      placement: 'bottom' as Placement,
    },
    {
      target: '.animated-a-container',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2">{isMobile ? 'Touch for Magic!' : 'Hover for Magic!'} ✨</h3>
          <p className="mb-2">{isMobile ? 'Touch' : 'Hover over'} the A to see it glow and hear cosmic sounds.</p>
          <p className="text-sm text-gray-600">The A loves attention and will react when you interact with it!</p>
        </div>
      ),
      placement: 'bottom' as Placement,
    },
    {
      target: '.personality-indicator',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2">Personality System 🧠</h3>
          <p className="mb-2">Watch the A's mood and stats change as you interact!</p>
          <p className="text-sm text-gray-600">Energy ⚡, Happiness 😊, Chaos 🌪️, and Attention 👁️ levels all affect its behavior.</p>
        </div>
      ),
      placement: 'bottom' as Placement,
    }
  ];

  const desktopCameraStep = {
    target: '.webcam-controls',
    content: (
      <div>
        <h3 className="text-lg font-bold mb-2">Camera Magic 📷</h3>
        <p className="mb-2">Click the camera button to let A see you!</p>
        <p className="mb-2">It can detect your face and react to your smiles! 😊</p>
        <p className="text-sm text-gray-600">Don't worry - everything is processed locally on your device.</p>
      </div>
    ),
    placement: 'left' as Placement,
  };

  const mobileCameraStep = {
    target: 'body',
    content: (
      <div>
        <h3 className="text-lg font-bold mb-2">Camera Not Available 📷</h3>
        <p className="mb-2">Camera features are not available on mobile devices.</p>
        <p className="mb-2">For the full experience with face detection and smile reactions, try using a desktop or laptop! 💻</p>
        <p className="text-sm text-gray-600">But don't worry - A is still amazing on mobile!</p>
      </div>
    ),
    placement: 'center' as Placement,
  };

  const finalSteps = [
    {
      target: '.animated-a-container',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2">Secret Features! 🤫</h3>
          <p className="mb-2">Try {isMobile ? 'tapping' : 'clicking'} rapidly (5+ times) for chaos mode!</p>
          {!isMobile && <p className="mb-2">Use the Konami Code: ↑↑↓↓←→←→BA for ultra chaos!</p>}
          <p className="text-sm text-gray-600">Stay still for 30 seconds to activate screensaver mode.</p>
        </div>
      ),
      placement: 'bottom' as Placement,
    },
    {
      target: 'body',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2">You're Ready! 🚀</h3>
          <p className="mb-2">Turn up your volume for the full audio experience!</p>
          <p className="mb-2">Now go ahead and play with your new AI companion!</p>
          <p className="text-sm text-gray-600">The A is waiting for you to bring it to life...</p>
        </div>
      ),
      placement: 'center' as Placement,
    },
  ];

  // Combine steps, with different camera step for mobile vs desktop
  const steps: Step[] = [...baseSteps, ...(isMobile ? [mobileCameraStep] : [desktopCameraStep]), ...finalSteps];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type, index, action } = data;

    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      stopTutorial();
      onComplete?.();
      return;
    }

    // Handle step navigation properly
    if (type === 'step:after') {
      if (action === 'next') {
        setStepIndex(index + 1);
      } else if (action === 'prev') {
        setStepIndex(index - 1);
      }
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      stepIndex={stepIndex}
      callback={handleJoyrideCallback}
      continuous={true}
      showProgress={true}
      showSkipButton={true}
      disableOverlayClose={true}
      hideBackButton={false}
      hideCloseButton={false}
      styles={{
        options: {
          primaryColor: '#8b5cf6',
          backgroundColor: '#1f2937',
          textColor: '#f9fafb',
          arrowColor: '#1f2937',
          overlayColor: 'rgba(0, 0, 0, 0.7)',
          width: '320px',
        },
        tooltip: {
          borderRadius: '12px',
          padding: '16px',
          maxWidth: '320px',
          fontSize: '14px',
        },
        tooltipContainer: {
          textAlign: 'left',
        },
        tooltipContent: {
          padding: '8px 0',
        },
        buttonNext: {
          backgroundColor: '#8b5cf6',
          borderRadius: '8px',
          padding: '8px 16px',
          fontSize: '14px',
        },
        buttonBack: {
          color: '#9ca3af',
          marginRight: '10px',
          fontSize: '14px',
        },
        buttonSkip: {
          color: '#9ca3af',
          fontSize: '14px',
        },
      }}
      floaterProps={{
        disableAnimation: false,
        styles: {
          floater: {
            filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))',
          },
        },
        options: {
          preventOverflow: {
            enabled: true,
            boundariesElement: 'viewport',
            padding: 16,
          },
          flip: {
            enabled: true,
          },
          offset: {
            enabled: true,
            offset: '0, 8px',
          },
        },
      }}
      locale={{
        back: '← Back',
        close: 'Close',
        last: 'Let\'s Go! 🎉',
        next: 'Next →',
        skip: 'Skip Tour',
      }}
    />
  );
};