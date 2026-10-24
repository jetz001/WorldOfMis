import type { SoundPreset } from '../types/ghost';

class SpookyAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private ambientGain: GainNode | null = null;
  private ambientOsc1: OscillatorNode | null = null;
  private ambientOsc2: OscillatorNode | null = null;
  private ambientFilter: BiquadFilterNode | null = null;
  private activePresetSource: AudioNode | null = null;

  constructor() {
    // Lazily initialized on first user interaction to satisfy browser autoplay policy
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(muted ? 0 : 0.08, this.ctx.currentTime);
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Starts subtle eerie ambient drone in the background
   */
  public startAmbient() {
    if (this.ambientOsc1) return; // already started
    this.initContext();
    if (!this.ctx) return;

    try {
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(this.isMuted ? 0 : 0.08, this.ctx.currentTime);

      this.ambientFilter = this.ctx.createBiquadFilter();
      this.ambientFilter.type = 'lowpass';
      this.ambientFilter.frequency.setValueAtTime(180, this.ctx.currentTime);

      // Osc 1: Deep fundamental tone (55 Hz - A1)
      this.ambientOsc1 = this.ctx.createOscillator();
      this.ambientOsc1.type = 'sawtooth';
      this.ambientOsc1.frequency.setValueAtTime(55, this.ctx.currentTime);

      // Osc 2: Detuned haunting fifth (82.4 Hz)
      this.ambientOsc2 = this.ctx.createOscillator();
      this.ambientOsc2.type = 'sine';
      this.ambientOsc2.frequency.setValueAtTime(82.4, this.ctx.currentTime);

      // Slow LFO for filter breath
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime); // 8-second cycle
      lfoGain.gain.setValueAtTime(60, this.ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(this.ambientFilter.frequency);
      lfo.start();

      this.ambientOsc1.connect(this.ambientFilter);
      this.ambientOsc2.connect(this.ambientFilter);
      this.ambientFilter.connect(this.ambientGain);
      this.ambientGain.connect(this.ctx.destination);

      this.ambientOsc1.start();
      this.ambientOsc2.start();
    } catch (e) {
      console.warn('AudioContext not allowed yet:', e);
    }
  }

  /**
   * Plays realistic Radio Garden-style Shortwave Radio Static Tuning sweep
   */
  public playRadioTuning() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const bufferSize = this.ctx.sampleRate * 0.45; // 450ms burst
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      // White noise with bursts
      data[i] = (Math.random() * 2 - 1) * (0.8 + 0.2 * Math.sin(i / 150));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    // Resonant bandpass sweep (like dialing a radio frequency)
    const bandpass = this.ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.Q.setValueAtTime(4.0, this.ctx.currentTime);
    bandpass.frequency.setValueAtTime(800, this.ctx.currentTime);
    bandpass.frequency.exponentialRampToValueAtTime(2400, this.ctx.currentTime + 0.2);
    bandpass.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.45);

    // Subtle radio tone blip (heterodyne whistle)
    const whistle = this.ctx.createOscillator();
    whistle.type = 'sine';
    whistle.frequency.setValueAtTime(1400, this.ctx.currentTime);
    whistle.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.35);

    const whistleGain = this.ctx.createGain();
    whistleGain.gain.setValueAtTime(0.04, this.ctx.currentTime);
    whistleGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);

    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.45);

    noise.connect(bandpass);
    bandpass.connect(masterGain);

    whistle.connect(whistleGain);
    whistleGain.connect(masterGain);

    masterGain.connect(this.ctx.destination);

    noise.start();
    whistle.start();
    whistle.stop(this.ctx.currentTime + 0.45);
  }

  /**
   * Plays unique sound atmospheric preset for a clicked pin
   */
  public playPresetSound(preset: SoundPreset) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    this.stopPresetSound();

    const now = this.ctx.currentTime;
    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(0.2, now);
    gainNode.connect(this.ctx.destination);

    switch (preset) {
      case 'temple_bell': {
        // Deep singing Buddhist bronze temple bell chime
        const freqs = [220, 440, 580, 880];
        freqs.forEach((freq, idx) => {
          const osc = this.ctx!.createOscillator();
          const oscGain = this.ctx!.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq + (idx * 2), now);

          oscGain.gain.setValueAtTime(0.15 / (idx + 1), now);
          oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);

          osc.connect(oscGain);
          oscGain.connect(gainNode);
          osc.start(now);
          osc.stop(now + 3.5);
        });
        break;
      }

      case 'water_spirit': {
        // Mysterious rippling aquatic tones
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.linearRampToValueAtTime(260, now + 1.2);
        osc.frequency.linearRampToValueAtTime(110, now + 2.5);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, now);

        gainNode.gain.setValueAtTime(0.22, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

        osc.connect(filter);
        filter.connect(gainNode);
        osc.start(now);
        osc.stop(now + 2.5);
        break;
      }

      case 'jungle_curse': {
        // Deep ominous tribal rumble
        const osc = this.ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(65, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 2.0);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(160, now);

        gainNode.gain.setValueAtTime(0.3, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 2.2);

        osc.connect(filter);
        filter.connect(gainNode);
        osc.start(now);
        osc.stop(now + 2.2);
        break;
      }

      case 'whisper':
      case 'creepy_wind':
      default: {
        // Breathy ghostly wind
        const bufferSize = this.ctx.sampleRate * 2.5;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * 0.4;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.Q.setValueAtTime(6, now);
        filter.frequency.setValueAtTime(350, now);
        filter.frequency.linearRampToValueAtTime(600, now + 1.2);
        filter.frequency.linearRampToValueAtTime(250, now + 2.5);

        gainNode.gain.setValueAtTime(0.18, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

        noise.connect(filter);
        filter.connect(gainNode);
        noise.start(now);
        noise.stop(now + 2.5);
        break;
      }
    }
  }

  public stopPresetSound() {
    if (this.activePresetSource) {
      try {
        (this.activePresetSource as unknown as { stop: () => void }).stop();
      } catch {
        // ignore
      }
      this.activePresetSource = null;
    }
  }
}

export const audioEngine = new SpookyAudioEngine();
