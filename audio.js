/**
 * Web Audio API Sound Synthesizer for ARROWS: Puzzle Escape
 * Zero external audio files required, instant, low-latency, and procedurally tuned.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.isMuted = false;
    this.volume = 0.8;
    this.isAmbientActive = false;
    this.ambientNodes = [];
    
    // Pentatonic scale frequencies for combo progression (C5 to C7)
    this.scale = [
      523.25, // C5
      587.33, // D5
      659.25, // E5
      783.99, // G5
      880.00, // A5
      1046.50, // C6
      1174.66, // D6
      1318.51, // E6
      1567.98, // G6
      1760.00, // A6
      2093.00  // C7
    ];
  }

  init() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return;
    }

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    } catch (e) {
      console.warn('Web Audio API not supported in this browser.', e);
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && !this.isMuted) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime, 0.05);
    }
    return this.isMuted;
  }

  /**
   * Escape whoosh sound: Bandpass filtered noise sweep
   */
  playWhoosh() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.3;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(600, t);
    filter.frequency.exponentialRampToValueAtTime(3200, t + 0.25);
    filter.Q.setValueAtTime(3.5, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.35, t + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(t);
    noise.stop(t + 0.3);
  }

  /**
   * Ascending Crystal Chime for unblocked arrow escapes and combos
   */
  playChime(combo = 1) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const noteIndex = Math.min(this.scale.length - 1, (combo - 1) % this.scale.length);
    const baseFreq = this.scale[noteIndex];

    // Primary bell tone
    const osc1 = this.ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(baseFreq, t);

    // Harmonic overtone for shimmering crystal timbre
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(baseFreq * 2.005, t);

    const gain1 = this.ctx.createGain();
    gain1.gain.setValueAtTime(0.4, t);
    gain1.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);

    const gain2 = this.ctx.createGain();
    gain2.gain.setValueAtTime(0.18, t);
    gain2.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);

    osc1.connect(gain1);
    gain1.connect(this.masterGain);

    osc2.connect(gain2);
    gain2.connect(this.masterGain);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.46);
    osc2.stop(t + 0.36);

    // Also trigger flight whoosh
    this.playWhoosh();
  }

  /**
   * Bump / Collision sound: Snappy wooden/rubber mallet click
   */
  playBonk() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(35, t + 0.12);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

    // Click transient
    const clickOsc = this.ctx.createOscillator();
    clickOsc.type = 'square';
    clickOsc.frequency.setValueAtTime(380, t);
    clickOsc.frequency.exponentialRampToValueAtTime(60, t + 0.04);

    const clickGain = this.ctx.createGain();
    clickGain.gain.setValueAtTime(0.3, t);
    clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    osc.connect(gain);
    gain.connect(this.masterGain);

    clickOsc.connect(clickGain);
    clickGain.connect(this.masterGain);

    osc.start(t);
    clickOsc.start(t);
    osc.stop(t + 0.16);
    clickOsc.stop(t + 0.06);
  }

  /**
   * Victory Fanfare: Celebratory Major 7th arpeggio chord with golden shimmer
   */
  playVictory() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const arpeggio = [523.25, 659.25, 783.99, 987.77, 1046.50, 1318.51]; // C E G B C E

    arpeggio.forEach((freq, idx) => {
      const delay = idx * 0.08;
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + delay);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0, t);
      gain.gain.setValueAtTime(0.35, t + delay);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + delay + 0.8);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t + delay);
      osc.stop(t + delay + 0.85);
    });
  }

  /**
   * Soft UI Click
   */
  playClick() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(400, t + 0.04);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.05);
  }

  /**
   * Soft Undo Swoosh
   */
  playUndo() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(580, t + 0.12);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.15);
  }

  /**
   * Ambient Drone Synthesizer: Soothing, meditative background chord pad
   */
  startAmbientDrone() {
    if (this.isAmbientActive || !this.ctx) return;
    this.init();
    this.isAmbientActive = true;

    const baseFreqs = [130.81, 196.00, 246.94, 293.66]; // C3, G3, B3, D4
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, this.ctx.currentTime);

    // LFO for slow breathing filter sweep
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime); // 8 second cycle
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(180, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    const droneGain = this.ctx.createGain();
    droneGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    droneGain.gain.linearRampToValueAtTime(0.06, this.ctx.currentTime + 3);

    filter.connect(droneGain);
    droneGain.connect(this.masterGain);

    const oscs = baseFreqs.map(f => {
      const osc = this.ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, this.ctx.currentTime);
      osc.connect(filter);
      osc.start();
      return osc;
    });

    this.ambientNodes = [lfo, lfoGain, filter, droneGain, ...oscs];
  }

  stopAmbientDrone() {
    if (!this.isAmbientActive) return;
    this.ambientNodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (e) {}
    });
    this.ambientNodes = [];
    this.isAmbientActive = false;
  }

  toggleAmbientDrone(enable) {
    if (enable) {
      this.startAmbientDrone();
    } else {
      this.stopAmbientDrone();
    }
  }
}

// Global Sound Instance
window.soundEngine = new SoundEngine();
