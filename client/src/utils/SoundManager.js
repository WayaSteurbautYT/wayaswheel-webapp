// Sound Manager for wheel spinning effects and music
class SoundManager {
  constructor() {
    this.sounds = {};
    this.audioFiles = {};
    this.music = null;
    this.musicEnabled = false;
    this.musicVolume = 0.3; // Lower default for background music
    this.sfxVolume = 0.5; // Lower default for SFX
    this.enabled = true;
    this.audioContext = null;
    this.initialized = false;
    this.soundLibrary = {
      spin: this.createSpinSound(),
      stop: this.createStopSound(),
      click: this.createClickSound(),
      win: this.createWinSound(),
      doom: this.createDoomSound(),
      horror: this.createHorrorSound(),
      mystery: this.createMysterySound(),
      victory: this.createVictorySound(),
      elimination: this.createEliminationSound(),
      hover: this.createHoverSound(),
      transition: this.createTransitionSound()
    };
    // External audio URLs (using free sound libraries)
    this.audioUrls = {
      click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
      spin: 'https://assets.mixkit.co/active_storage/sfx/2005/2005-preview.mp3',
      stop: 'https://assets.mixkit.co/active_storage/sfx/2575/2575-preview.mp3',
      win: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3',
      doom: 'https://assets.mixkit.co/active_storage/sfx/2002/2002-preview.mp3',
      hover: 'https://assets.mixkit.co/active_storage/sfx/2567/2567-preview.mp3',
      background: 'https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3'
    };
  }

  init() {
    if (this.initialized) return;
    
    try {
      // Create audio context for Web Audio API
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.initialized = true;
      this.createSounds();
    } catch (error) {
      console.warn('Audio not supported:', error);
      this.enabled = false;
    }
  }

  createSounds() {
    // Sounds are now in soundLibrary
    this.sounds = { ...this.soundLibrary };
  }

  createSpinSound() {
    // Create a whoosh/spinning sound
    return () => {
      if (!this.enabled || !this.audioContext) return;
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(100, this.audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.1);
    };
  }

  createStopSound() {
    // Create a thud/stop sound
    return () => {
      if (!this.enabled || !this.audioContext) return;
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      const filter = this.audioContext.createBiquadFilter();
      
      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(150, this.audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.05);
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, this.audioContext.currentTime);
      
      gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.05);
    };
  }

  createClickSound() {
    // Create a click sound
    return () => {
      if (!this.enabled || !this.audioContext) return;
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
      
      gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.01);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.01);
    };
  }

  createWinSound() {
    // Create a celebration sound
    return () => {
      if (!this.enabled || !this.audioContext) return;
      
      const notes = [523.25, 659.25, 783.99]; // C, E, G
      
      notes.forEach((frequency, index) => {
        setTimeout(() => {
          const oscillator = this.audioContext.createOscillator();
          const gainNode = this.audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(this.audioContext.destination);
          
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
          
          gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
          
          oscillator.start(this.audioContext.currentTime);
          oscillator.stop(this.audioContext.currentTime + 0.3);
        }, index * 100);
      });
    };
  }

  createDoomSound() {
    return () => {
      if (!this.enabled || !this.audioContext) return;
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.5);
      
      gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.5);
    };
  }

  createHorrorSound() {
    return () => {
      if (!this.enabled || !this.audioContext) return;
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      const filter = this.audioContext.createBiquadFilter();
      
      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(80, this.audioContext.currentTime);
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, this.audioContext.currentTime);
      filter.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.3);
      
      gainNode.gain.setValueAtTime(0.12, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.3);
    };
  }

  createMysterySound() {
    return () => {
      if (!this.enabled || !this.audioContext) return;
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(880, this.audioContext.currentTime + 0.2);
      oscillator.frequency.exponentialRampToValueAtTime(220, this.audioContext.currentTime + 0.4);
      
      gainNode.gain.setValueAtTime(0.08, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.4);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.4);
    };
  }

  createVictorySound() {
    return () => {
      if (!this.enabled || !this.audioContext) return;
      
      const notes = [523.25, 587.33, 659.25, 698.46, 783.99, 880]; // C major arpeggio
      
      notes.forEach((frequency, index) => {
        setTimeout(() => {
          const oscillator = this.audioContext.createOscillator();
          const gainNode = this.audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(this.audioContext.destination);
          
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
          
          gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.4);
          
          oscillator.start(this.audioContext.currentTime);
          oscillator.stop(this.audioContext.currentTime + 0.4);
        }, index * 80);
      });
    };
  }

  createEliminationSound() {
    return () => {
      if (!this.enabled || !this.audioContext) return;
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(300, this.audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.2);
      
      gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.2);
    };
  }

  playMusic(type = 'ambient') {
    if (!this.musicEnabled || !this.audioContext) return;
    
    this.stopMusic();
    
    // Try external background music first
    if (this.audioUrls.background) {
      this.playExternalAudio('background');
      return;
    }
    
    // Fallback to generated ambient music
    const musicOscillators = [];
    const baseFrequencies = {
      ambient: [110, 165, 220],
      tense: [100, 150, 200],
      victory: [130, 195, 260]
    };
    
    const frequencies = baseFrequencies[type] || baseFrequencies.ambient;
    
    frequencies.forEach((freq, index) => {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      const panner = this.audioContext.createStereoPanner();
      
      oscillator.connect(gainNode);
      gainNode.connect(panner);
      panner.connect(this.audioContext.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
      
      // Slow frequency modulation for ambient effect
      oscillator.frequency.linearRampToValueAtTime(freq * 1.1, this.audioContext.currentTime + 4);
      oscillator.frequency.linearRampToValueAtTime(freq, this.audioContext.currentTime + 8);
      
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.03 * this.musicVolume, this.audioContext.currentTime + 1);
      
      // Pan slightly left/right
      panner.pan.setValueAtTime((index - 1) * 0.5, this.audioContext.currentTime);
      
      oscillator.start(this.audioContext.currentTime);
      musicOscillators.push({ oscillator, gainNode });
    });
    
    this.music = { oscillators: musicOscillators };
  }

  stopMusic() {
    if (this.music) {
      if (this.music.source) {
        // External audio
        this.music.source.stop();
      } else if (this.music.oscillators) {
        // Generated audio
        this.music.oscillators.forEach(({ oscillator, gainNode }) => {
          gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.5);
          setTimeout(() => oscillator.stop(), 500);
        });
      }
      this.music = null;
    }
  }

  toggleMusic() {
    this.musicEnabled = !this.musicEnabled;
    if (this.musicEnabled) {
      this.playMusic();
    } else {
      this.stopMusic();
    }
    return this.musicEnabled;
  }

  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume / 100));
  }

  setSfxVolume(volume) {
    this.sfxVolume = Math.max(0, Math.min(1, volume / 100));
  }

  getSoundLibrary() {
    return Object.keys(this.soundLibrary);
  }

  // AI-accessible method to generate custom sounds
  generateCustomSound(type, parameters = {}) {
    if (!this.enabled || !this.audioContext) return;
    
    const { frequency = 440, duration = 0.1, type: waveType = 'sine' } = parameters;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.type = waveType;
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    
    gainNode.gain.setValueAtTime(0.1 * this.sfxVolume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  play(soundName) {
    if (!this.enabled) return;
    
    // Resume audio context if suspended (for autoplay policies)
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    
    // Try external audio first, fallback to generated sound
    if (this.audioUrls[soundName]) {
      this.playExternalAudio(soundName);
    } else if (this.sounds[soundName]) {
      this.sounds[soundName]();
    }
  }

  async loadExternalAudio(soundName) {
    if (this.audioFiles[soundName]) return this.audioFiles[soundName];
    
    try {
      const response = await fetch(this.audioUrls[soundName]);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      this.audioFiles[soundName] = audioBuffer;
      return audioBuffer;
    } catch (error) {
      console.warn(`Failed to load audio ${soundName}:`, error);
      return null;
    }
  }

  async playExternalAudio(soundName) {
    if (!this.audioContext) return;
    
    const audioBuffer = await this.loadExternalAudio(soundName);
    if (!audioBuffer) return;
    
    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();
    
    source.buffer = audioBuffer;
    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    const volume = soundName === 'background' ? this.musicVolume : this.sfxVolume;
    gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
    
    source.start(this.audioContext.currentTime);
    
    if (soundName === 'background') {
      this.music = { source, gainNode };
      source.loop = true;
    }
  }

  createHoverSound() {
    return () => {
      if (!this.enabled || !this.audioContext) return;
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime);
      
      gainNode.gain.setValueAtTime(0.03, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.05);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.05);
    };
  }

  createTransitionSound() {
    return () => {
      if (!this.enabled || !this.audioContext) return;
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(300, this.audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(600, this.audioContext.currentTime + 0.15);
      
      gainNode.gain.setValueAtTime(0.05, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.15);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.15);
    };
  }

  setEnabled(enabled) {
    this.enabled = enabled;
  }

  isEnabled() {
    return this.enabled;
  }
}

// Export singleton instance
const soundManagerInstance = new SoundManager();
export default soundManagerInstance;
