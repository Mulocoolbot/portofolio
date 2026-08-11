// Web Audio API Synthesizer & Spatial Sound Effects Engine for Synaptic Portfolio
class SoundFX {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;

  // Audio Buffers
  private openSaberBuffer: AudioBuffer | null = null;
  private openSaberReversedBuffer: AudioBuffer | null = null;
  private neuronTransitionBuffer: AudioBuffer | null = null;
  private neuronSwingBuffer: AudioBuffer | null = null;
  private idleBuffer: AudioBuffer | null = null;

  // Idle Loop Nodes
  private idleSourceNode: AudioBufferSourceNode | null = null;
  private idleGainNode: GainNode | null = null;
  private idleAudioEl: HTMLAudioElement | null = null;
  private isIdlePlaying: boolean = false;

  // Throttles & Preload Flags
  private isPreloaded: boolean = false;
  private lastSwingTime: number = 0;

  constructor() {
    // Initialized on first user interaction or when needed
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  public setEnabled(val: boolean) {
    this.enabled = val;
    if (val) {
      this.startIdle();
    } else {
      this.stopIdle();
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  // Preload and decode all custom WAV sound assets into Web Audio memory
  public preloadAll() {
    if (this.isPreloaded || typeof window === 'undefined') return;
    this.isPreloaded = true;
    this.initCtx();

    // 1. Open Saber (Forward & Reversed)
    this.loadBuffer('/sounds/open_saber.wav', (buffer) => {
      this.openSaberBuffer = buffer;
      if (this.ctx) {
        // Create reversed audio buffer for transition from neuron back to overview
        const rev = this.ctx.createBuffer(
          buffer.numberOfChannels,
          buffer.length,
          buffer.sampleRate
        );
        for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
          const forwardData = buffer.getChannelData(channel);
          const revData = rev.getChannelData(channel);
          for (let i = 0; i < buffer.length; i++) {
            revData[i] = forwardData[buffer.length - 1 - i];
          }
        }
        this.openSaberReversedBuffer = rev;
      }
    });

    // 2. Neuron Transition (Neuron to Neuron)
    this.loadBuffer('/sounds/neurontransition.wav', (buffer) => {
      this.neuronTransitionBuffer = buffer;
    });

    // 3. Neuron Swing (Interaction / Rotation)
    this.loadBuffer('/sounds/neuronswing.wav', (buffer) => {
      this.neuronSwingBuffer = buffer;
    });

    // 4. Idle Ambient Hum (Continuous Background Loop)
    this.loadBuffer('/sounds/idle.wav', (buffer) => {
      this.idleBuffer = buffer;
      if (this.enabled && !this.isIdlePlaying) {
        this.startIdle();
      }
    });
  }

  private loadBuffer(url: string, onDecoded: (buffer: AudioBuffer) => void) {
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.arrayBuffer();
      })
      .then((arrayBuffer) => {
        this.initCtx();
        if (this.ctx) {
          return this.ctx.decodeAudioData(arrayBuffer);
        }
        throw new Error('No AudioContext');
      })
      .then((decoded) => {
        onDecoded(decoded);
      })
      .catch(() => {
        // Fetch/decode will fallback gracefully if needed
      });
  }

  // ── 1. Idle Background Hum (12% volume, loops continuously) ───────
  public startIdle() {
    if (!this.enabled || this.isIdlePlaying || typeof window === 'undefined') return;
    try {
      this.initCtx();
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      if (this.ctx && this.idleBuffer) {
        this.stopIdle();
        const source = this.ctx.createBufferSource();
        const gain = this.ctx.createGain();

        source.buffer = this.idleBuffer;
        source.loop = true;
        gain.gain.setValueAtTime(0.12, this.ctx.currentTime); // 12% ambient volume

        source.connect(gain);
        gain.connect(this.ctx.destination);

        source.start(0);
        this.idleSourceNode = source;
        this.idleGainNode = gain;
        this.isIdlePlaying = true;
      } else {
        // HTMLAudioElement Fallback
        if (!this.idleAudioEl) {
          this.idleAudioEl = new Audio('/sounds/idle.wav');
          this.idleAudioEl.loop = true;
          this.idleAudioEl.volume = 0.12;
        }
        this.idleAudioEl.play().then(() => {
          this.isIdlePlaying = true;
        }).catch(() => {
          // Blocked until gesture
        });
      }
    } catch {
      // Audio not permitted
    }
  }

  public stopIdle() {
    if (this.idleSourceNode) {
      try {
        this.idleSourceNode.stop();
        this.idleSourceNode.disconnect();
      } catch {
        // ignore
      }
      this.idleSourceNode = null;
    }
    if (this.idleAudioEl) {
      try {
        this.idleAudioEl.pause();
        this.idleAudioEl.currentTime = 0;
      } catch {
        // ignore
      }
    }
    this.isIdlePlaying = false;
  }

  // ── 2. Neuron Swing SFX (Played 1x per drag rotation interaction, 12% volume) ──
  public playNeuronSwing() {
    if (!this.enabled) return;
    this.playBufferDirect(this.neuronSwingBuffer, '/sounds/neuronswing.wav', 0.12);
  }

  // ── 3. Neuron Transition SFX (Played when user moves from neuron to neuron, 12% volume) ──
  public playNeuronTransition() {
    if (!this.enabled) return;
    this.playBufferDirect(this.neuronTransitionBuffer, '/sounds/neurontransition.wav', 0.12);
  }

  // ── 4. Open Saber Forward (Played when user transitions Overview -> Neuron, 12% volume) ──
  public playOpenSaber() {
    if (!this.enabled) return;
    this.playBufferDirect(this.openSaberBuffer, '/sounds/open_saber.wav', 0.12);
  }

  // ── 5. Open Saber Reversed (Played when user transitions Neuron -> Overview, 12% volume) ──
  public playOpenSaberReversed() {
    if (!this.enabled) return;
    if (this.openSaberReversedBuffer) {
      this.playBufferDirect(this.openSaberReversedBuffer, '/sounds/open_saber.wav', 0.12);
    } else {
      // Fallback
      this.playBufferDirect(this.openSaberBuffer, '/sounds/open_saber.wav', 0.12);
    }
  }

  // Helper to play decoded buffer with fallback to Audio element (12% volume)
  private playBufferDirect(buffer: AudioBuffer | null, fallbackUrl: string, volume: number = 0.12) {
    try {
      this.initCtx();
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      if (this.ctx && buffer) {
        const source = this.ctx.createBufferSource();
        const gainNode = this.ctx.createGain();

        source.buffer = buffer;
        gainNode.gain.setValueAtTime(volume, this.ctx.currentTime);

        source.connect(gainNode);
        gainNode.connect(this.ctx.destination);

        source.start(0);
      } else {
        const audio = new Audio(fallbackUrl);
        audio.volume = volume;
        audio.play().catch(() => {});
      }
    } catch {
      // Audio not permitted
    }
  }

  // ── UI Micro-Sound Effects (Clicks, Hovers, Success) ──────────────────
  public playClick() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(750, now);
      osc.frequency.exponentialRampToValueAtTime(1600, now + 0.06);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      // ignore
    }
  }

  public playHover() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(360, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.035);

      gain.gain.setValueAtTime(0.10, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.035);
    } catch {
      // ignore
    }
  }

  public playSuccess() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      const now = this.ctx.currentTime;
      freqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0.12, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.22);
      });
    } catch {
      // ignore
    }
  }
}

export const soundFX = new SoundFX();
