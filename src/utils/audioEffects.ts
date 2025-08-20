// Crazy audio effects for the letter A
export class AudioEffects {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  constructor() {
    this.initAudio();
  }

  private initAudio() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.value = 0.3; // Keep it reasonable
    } catch (error) {
      console.warn('Audio not supported:', error);
    }
  }

  private resumeAudio() {
    if (this.audioContext?.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  // Cosmic whoosh sound
  playCosmicWhoosh() {
    this.resumeAudio();
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.masterGain!);

    // Sweeping frequency for whoosh effect
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.5);

    // Filter sweep
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, this.audioContext.currentTime);
    filter.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.5);

    // Volume envelope
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.2, this.audioContext.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.5);
  }

  // Glitch effect sound
  playGlitchEffect() {
    this.resumeAudio();
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const distortion = this.audioContext.createWaveShaper();

    // Create distortion curve
    const samples = 44100;
    const curve = new Float32Array(samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < samples; i++) {
      const x = (i * 2) / samples - 1;
      curve[i] = ((3 + 50) * x * 20 * deg) / (Math.PI + 50 * Math.abs(x));
    }
    distortion.curve = curve;
    distortion.oversample = '4x';

    oscillator.connect(distortion);
    distortion.connect(gainNode);
    gainNode.connect(this.masterGain!);

    // Rapid frequency changes for glitch
    oscillator.type = 'square';
    const now = this.audioContext.currentTime;
    
    for (let i = 0; i < 10; i++) {
      const time = now + (i * 0.02);
      const freq = Math.random() * 1000 + 200;
      oscillator.frequency.setValueAtTime(freq, time);
    }

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.15, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    oscillator.start(now);
    oscillator.stop(now + 0.2);
  }

  // Musical note sequence
  playMusicalSequence() {
    this.resumeAudio();
    if (!this.audioContext) return;

    // Notes for "A is alive" melody
    const notes = [440, 523.25, 659.25, 783.99, 659.25, 523.25, 440]; // A, C, E, G, E, C, A
    const now = this.audioContext.currentTime;

    notes.forEach((freq, index) => {
      const oscillator = this.audioContext!.createOscillator();
      const gainNode = this.audioContext!.createGain();
      const delay = this.audioContext!.createDelay();

      oscillator.connect(gainNode);
      gainNode.connect(delay);
      delay.connect(this.masterGain!);

      oscillator.type = 'sine';
      oscillator.frequency.value = freq;
      delay.delayTime.value = 0.1;

      const startTime = now + (index * 0.15);
      const duration = 0.2;

      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.1, startTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    });
  }

  // Explosion sound
  playExplosion() {
    this.resumeAudio();
    if (!this.audioContext) return;

    // White noise explosion
    const bufferSize = this.audioContext.sampleRate * 0.3;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();

    source.buffer = buffer;
    source.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.masterGain!);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, this.audioContext.currentTime);
    filter.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.3);

    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

    source.start(this.audioContext.currentTime);
  }

  // Ambient space sound
  playAmbientSpace() {
    this.resumeAudio();
    if (!this.audioContext) return;

    const oscillator1 = this.audioContext.createOscillator();
    const oscillator2 = this.audioContext.createOscillator();
    const gainNode1 = this.audioContext.createGain();
    const gainNode2 = this.audioContext.createGain();
    const masterGain = this.audioContext.createGain();

    oscillator1.connect(gainNode1);
    oscillator2.connect(gainNode2);
    gainNode1.connect(masterGain);
    gainNode2.connect(masterGain);
    masterGain.connect(this.masterGain!);

    oscillator1.type = 'sine';
    oscillator2.type = 'sine';
    oscillator1.frequency.value = 80;
    oscillator2.frequency.value = 120;

    // Slowly evolving frequencies
    const now = this.audioContext.currentTime;
    oscillator1.frequency.setValueAtTime(80, now);
    oscillator1.frequency.linearRampToValueAtTime(85, now + 3);
    oscillator2.frequency.setValueAtTime(120, now);
    oscillator2.frequency.linearRampToValueAtTime(125, now + 3);

    gainNode1.gain.setValueAtTime(0.05, now);
    gainNode2.gain.setValueAtTime(0.03, now);

    oscillator1.start(now);
    oscillator2.start(now);
    oscillator1.stop(now + 3);
    oscillator2.stop(now + 3);
  }
}

export const audioEffects = new AudioEffects();
