/** Short generated chimes (no audio files) via the Web Audio API. */
let ctx: AudioContext | null = null;

function audio(): AudioContext | null {
  try {
    ctx ??= new AudioContext();
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

export function playChime(kind: 'focus-end' | 'break-end' = 'focus-end') {
  const ac = audio();
  if (!ac) return;
  const notes = kind === 'focus-end' ? [659.25, 783.99, 1046.5] : [1046.5, 783.99, 659.25];
  notes.forEach((freq, i) => {
    const t = ac.currentTime + i * 0.22;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.25, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
    osc.connect(gain).connect(ac.destination);
    osc.start(t);
    osc.stop(t + 0.65);
  });
}

/** Unlocks audio on a user gesture so later chimes can play in background tabs. */
export function primeAudio() {
  audio();
}
