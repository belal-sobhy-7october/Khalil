import { create } from 'zustand';

/** Looping generated background noise for focus (white / pink / brown). */
export type NoiseKind = 'white' | 'pink' | 'brown';

let ctx: AudioContext | null = null;
let source: AudioBufferSourceNode | null = null;
let gain: GainNode | null = null;

function buffer(ac: AudioContext, kind: NoiseKind): AudioBuffer {
  const length = ac.sampleRate * 4;
  const buf = ac.createBuffer(1, length, ac.sampleRate);
  const data = buf.getChannelData(0);
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0, last = 0;
  for (let i = 0; i < length; i++) {
    const white = Math.random() * 2 - 1;
    if (kind === 'white') data[i] = white * 0.5;
    else if (kind === 'brown') {
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.5;
    } else {
      // Paul Kellet's pink noise filter
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.969 * b2 + white * 0.153852;
      b3 = 0.8665 * b3 + white * 0.3104856;
      b4 = 0.55 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.016898;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }
  }
  return buf;
}

export function startNoise(kind: NoiseKind, volume: number) {
  stopNoise();
  try {
    ctx ??= new AudioContext();
    void ctx.resume();
    gain = ctx.createGain();
    gain.gain.value = volume;
    source = ctx.createBufferSource();
    source.buffer = buffer(ctx, kind);
    source.loop = true;
    source.connect(gain).connect(ctx.destination);
    source.start();
  } catch {
    // audio unavailable
  }
}

export function setNoiseVolume(volume: number) {
  if (gain) gain.gain.value = volume;
}

export function stopNoise() {
  try {
    source?.stop();
  } catch {
    // already stopped
  }
  source?.disconnect();
  source = null;
  gain = null;
}

const VOLUME_KEY = 'khalil-noise-volume';

function readVolume(): number {
  try {
    const v = Number(localStorage.getItem(VOLUME_KEY));
    return Number.isFinite(v) && v > 0 && v <= 1 ? v : 0.3;
  } catch {
    return 0.3;
  }
}

interface NoiseState {
  kind: NoiseKind | null;
  volume: number;
  /** Plays `kind`, or stops it if it is already playing. */
  toggle: (kind: NoiseKind) => void;
  setVolume: (volume: number) => void;
  stop: () => void;
}

/**
 * App-wide ambient sound: it keeps playing while you move to other sections
 * (it used to stop when the Focus page closed) and can be stopped from the
 * floating timer.
 */
export const useNoiseStore = create<NoiseState>((set, get) => ({
  kind: null,
  volume: readVolume(),
  toggle: (kind) => {
    if (get().kind === kind) {
      stopNoise();
      set({ kind: null });
    } else {
      startNoise(kind, get().volume);
      set({ kind });
    }
  },
  setVolume: (volume) => {
    setNoiseVolume(volume);
    set({ volume });
    try {
      localStorage.setItem(VOLUME_KEY, String(volume));
    } catch {
      // ignore
    }
  },
  stop: () => {
    stopNoise();
    set({ kind: null });
  },
}));
