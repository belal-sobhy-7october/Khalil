/**
 * Measures a recording on the device (no internet needed): how long you
 * spoke, the silences in the middle (dead air), and whether it's too quiet
 * or distorted — what a recruiter notices first in a voice note.
 */

export interface VoiceStats {
  /** The whole recording, seconds. */
  seconds: number;
  /** From the first word to the last, seconds. */
  speechSeconds: number;
  /** Pauses of 1.5 s or more between words. */
  longPauses: number;
  /** The longest pause between words, seconds. */
  longestPause: number;
  /** Silence before the first word, seconds. */
  leadIn: number;
  tooQuiet: boolean;
  /** The microphone was overloaded (crackling). */
  clipped: boolean;
}

const FRAME_SECONDS = 0.03;
export const LONG_PAUSE_SECONDS = 1.5;

/** Analyzes raw mono samples (-1…1). Pure, so it can be tested. */
export function analyzeSamples(samples: Float32Array, sampleRate: number): VoiceStats {
  const frameSize = Math.max(1, Math.round(sampleRate * FRAME_SECONDS));
  const frames: number[] = [];
  let clippedSamples = 0;
  for (let start = 0; start < samples.length; start += frameSize) {
    let sum = 0;
    const end = Math.min(samples.length, start + frameSize);
    for (let i = start; i < end; i++) {
      const v = samples[i];
      sum += v * v;
      if (Math.abs(v) >= 0.99) clippedSamples += 1;
    }
    frames.push(Math.sqrt(sum / (end - start)));
  }
  const seconds = samples.length / sampleRate;
  const sorted = [...frames].sort((a, b) => a - b);
  const noise = sorted[Math.floor(sorted.length * 0.1)] ?? 0;
  const peak = sorted[Math.floor(sorted.length * 0.98)] ?? 0;
  const threshold = Math.max(0.01, noise * 2.5, peak * 0.12);
  const voiced = frames.map((rms) => rms >= threshold);

  const first = voiced.indexOf(true);
  const last = voiced.lastIndexOf(true);
  const empty = { seconds, speechSeconds: 0, longPauses: 0, longestPause: 0, leadIn: seconds, tooQuiet: true, clipped: false };
  if (first < 0) return empty;

  let longPauses = 0;
  let longestPause = 0;
  let run = 0;
  for (let i = first; i <= last; i++) {
    if (voiced[i]) {
      if (run) {
        const pause = run * FRAME_SECONDS;
        longestPause = Math.max(longestPause, pause);
        if (pause >= LONG_PAUSE_SECONDS) longPauses += 1;
      }
      run = 0;
    } else run += 1;
  }
  return {
    seconds,
    speechSeconds: (last - first + 1) * FRAME_SECONDS,
    longPauses,
    longestPause: Math.round(longestPause * 10) / 10,
    leadIn: Math.round(first * FRAME_SECONDS * 10) / 10,
    tooQuiet: peak < 0.03,
    clipped: clippedSamples / samples.length > 0.001,
  };
}

/** Decodes a recording and analyzes it; null if the browser can't decode it. */
export async function analyzeRecording(blob: Blob): Promise<VoiceStats | null> {
  const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return null;
  const ctx = new Ctx();
  try {
    const buffer = await ctx.decodeAudioData(await blob.arrayBuffer());
    return analyzeSamples(buffer.getChannelData(0), buffer.sampleRate);
  } catch {
    return null;
  } finally {
    void ctx.close();
  }
}

/** Words per minute over the time you were actually speaking. */
export const wordsPerMinute = (words: number, speechSeconds: number) => (speechSeconds > 0 ? Math.round(words / (speechSeconds / 60)) : 0);
