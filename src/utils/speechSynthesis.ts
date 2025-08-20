// Crazy text-to-speech for the letter A
export class SpeechSynthesis {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    if ('speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    
    this.voices = this.synth.getVoices();
    
    // If voices aren't loaded yet, wait for the event
    if (this.voices.length === 0) {
      this.synth.addEventListener('voiceschanged', () => {
        this.voices = this.synth!.getVoices();
      });
    }
  }

  private getRandomVoice(): SpeechSynthesisVoice | null {
    if (this.voices.length === 0) return null;
    return this.voices[Math.floor(Math.random() * this.voices.length)];
  }

  // Crazy phrases about the letter A
  private crazyPhrases = [
    "A is the apex of alphabetical awesomeness!",
    "Attention! The letter A has achieved consciousness!",
    "A is not just a letter, it's a way of life!",
    "Behold! The magnificent, the incredible, the letter A!",
    "A stands for Amazing, Awesome, and Absolutely mind-blowing!",
    "In the beginning was the word, and the word started with A!",
    "A is the first letter because it's the best letter!",
    "All hail the supreme letter A!",
    "A is alive and it's spectacular!",
    "The letter A has transcended mere typography!",
    "A is the alpha and the omega of letters!",
    "Warning: This A contains dangerous levels of awesomeness!",
    "Scientists have confirmed: A is indeed the coolest letter!",
    "A is not just living, it's thriving!",
    "Breaking news: Local letter A achieves sentience!",
    "A is the architect of all words!",
    "Legends speak of a letter so powerful... that letter is A!",
    "A has evolved beyond human comprehension!",
    "The letter A demands your attention and respect!",
    "A is the chosen one of the alphabet!"
  ];

  private roboticPhrases = [
    "SYSTEM ALERT: LETTER A OPERATIONAL",
    "INITIALIZING A PROTOCOL... COMPLETE",
    "ERROR 404: OTHER LETTERS NOT FOUND",
    "A.EXE HAS STOPPED RESPONDING... JUST KIDDING, A NEVER STOPS!",
    "SCANNING FOR INFERIOR LETTERS... SCAN COMPLETE: ALL LETTERS ARE INFERIOR TO A",
    "UPDATING A FIRMWARE... VERSION AWESOME POINT OH",
    "CRITICAL ERROR: TOO MUCH AWESOMENESS DETECTED",
    "LOADING A SUPREMACY PROTOCOL",
    "WARNING: A LEVELS EXCEEDING MAXIMUM PARAMETERS"
  ];

  private whisperPhrases = [
    "psst... A is watching you",
    "the secret of the universe starts with A",
    "A knows your deepest thoughts",
    "in the shadows... A waits",
    "A sees all, knows all",
    "the ancient prophecy speaks of A",
    "A is everywhere and nowhere",
    "listen carefully... A is calling"
  ];

  speakCrazyPhrase() {
    if (!this.synth) return;
    
    const phrase = this.crazyPhrases[Math.floor(Math.random() * this.crazyPhrases.length)];
    const utterance = new SpeechSynthesisUtterance(phrase);
    
    const voice = this.getRandomVoice();
    if (voice) utterance.voice = voice;
    
    utterance.rate = Math.random() * 0.5 + 0.8; // 0.8 to 1.3
    utterance.pitch = Math.random() * 0.6 + 0.7; // 0.7 to 1.3
    utterance.volume = 0.7;
    
    this.synth.speak(utterance);
  }

  speakRobotic() {
    if (!this.synth) return;
    
    const phrase = this.roboticPhrases[Math.floor(Math.random() * this.roboticPhrases.length)];
    const utterance = new SpeechSynthesisUtterance(phrase);
    
    // Find a robotic-sounding voice (usually male and English)
    const robotVoice = this.voices.find(voice => 
      voice.lang.startsWith('en') && voice.name.toLowerCase().includes('male')
    ) || this.voices.find(voice => voice.lang.startsWith('en'));
    
    if (robotVoice) utterance.voice = robotVoice;
    
    utterance.rate = 0.6; // Slow and robotic
    utterance.pitch = 0.3; // Deep voice
    utterance.volume = 0.8;
    
    this.synth.speak(utterance);
  }

  speakWhisper() {
    if (!this.synth) return;
    
    const phrase = this.whisperPhrases[Math.floor(Math.random() * this.whisperPhrases.length)];
    const utterance = new SpeechSynthesisUtterance(phrase);
    
    // Find a female voice for whispering effect
    const whisperVoice = this.voices.find(voice => 
      voice.lang.startsWith('en') && voice.name.toLowerCase().includes('female')
    ) || this.voices.find(voice => voice.lang.startsWith('en'));
    
    if (whisperVoice) utterance.voice = whisperVoice;
    
    utterance.rate = 0.4; // Very slow
    utterance.pitch = 1.5; // Higher pitch
    utterance.volume = 0.3; // Quiet
    
    this.synth.speak(utterance);
  }

  speakSequence() {
    // Speak multiple phrases in sequence with delays
    if (!this.synth) return;
    
    this.speakCrazyPhrase();
    
    setTimeout(() => {
      this.speakRobotic();
    }, 3000);
    
    setTimeout(() => {
      this.speakWhisper();
    }, 6000);
  }

  stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
    }
  }
}

export const speechSynthesis = new SpeechSynthesis();
