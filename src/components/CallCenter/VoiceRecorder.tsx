import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle, Download, Loader2, Mic, Square, Star, Trash2 } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { analyzeRecording, LONG_PAUSE_SECONDS, wordsPerMinute, type VoiceStats } from '../../lib/callCenter/audio';
import { deleteTake, listTakes, saveTake, takeFileName, type Take } from '../../lib/callCenter/recordings';
import { liveTranscriptSupported, startTranscript } from '../../lib/callCenter/voice';
import { useOnline } from '../../lib/offline';
import { clockLength } from '../../lib/courseProgress';
import { newId } from '../../lib/callCenter/progress';
import { useCallCenter } from './CallCenterContext';
import { Pill, primaryBtn, secondaryBtn } from './ui';

const MAX_SECONDS = 300;
const TRANSCRIPT_PREF = 'khalil-cc-transcript';

function preferredMime(): string | undefined {
  if (typeof MediaRecorder === 'undefined') return undefined;
  return ['audio/webm;codecs=opus', 'audio/mp4', 'audio/webm'].find((m) => MediaRecorder.isTypeSupported?.(m));
}

function readTranscriptPref(): boolean {
  try {
    const v = localStorage.getItem(TRANSCRIPT_PREF);
    if (v) return v === '1';
  } catch {
    // ignore
  }
  // Running recognition next to the recorder can fail on phones: on by default on computers only.
  return typeof navigator !== 'undefined' && !/Android|iPhone|iPad/i.test(navigator.userAgent);
}

const countWords = (text: string) => text.split(/\s+/).filter(Boolean).length;

/** What the numbers say, recruiter-style. */
function verdicts(stats: VoiceStats, wpm: number | null, target?: [number, number]) {
  const out: Array<{ ok: boolean; text: string }> = [];
  if (target) {
    const [min, max] = target;
    out.push({
      ok: stats.seconds >= min && stats.seconds <= max + 5,
      text: `Length ${clockLength(stats.seconds)} (aim for ${clockLength(min)}–${clockLength(max)})`,
    });
  }
  out.push({
    ok: stats.longPauses === 0,
    text: stats.longPauses
      ? `${stats.longPauses} long pause${stats.longPauses > 1 ? 's' : ''} (longest ${stats.longestPause}s): fill them with a short phrase or a breath`
      : `No pause longer than ${LONG_PAUSE_SECONDS}s`,
  });
  if (stats.leadIn > 2) out.push({ ok: false, text: `${stats.leadIn}s of silence before you start: start talking right away` });
  if (wpm !== null) {
    out.push({
      ok: wpm >= 120 && wpm <= 170,
      text: wpm < 120 ? `${wpm} words/min: a little slow, aim for 130–160` : wpm > 170 ? `${wpm} words/min: too fast, slow down to 130–160` : `${wpm} words/min: a good pace`,
    });
  }
  if (stats.tooQuiet) out.push({ ok: false, text: 'Very quiet: speak up, or hold the phone closer' });
  if (stats.clipped) out.push({ ok: false, text: 'The sound is distorted: hold the phone a little further away' });
  return out;
}

function TakeAudio({ take }: { take: Take }) {
  const url = useMemo(() => URL.createObjectURL(take.blob), [take.blob]);
  useEffect(() => () => URL.revokeObjectURL(url), [url]);
  return <audio src={url} controls className="h-8 w-full max-w-xs" />;
}

function download(take: Take) {
  const url = URL.createObjectURL(take.blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = takeFileName(take);
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Record an answer or a voice note: saved on this device, measured (length,
 * long pauses, pace), with your first take kept to compare against.
 */
export default function VoiceRecorder({ promptId, target, onTake, history = true }: {
  /** Where the takes are kept: a voice prompt id, `q:<question>`, … */
  promptId: string;
  /** Target length in seconds. */
  target?: [number, number];
  onTake?: (take: Take) => void;
  /** List the earlier takes. */
  history?: boolean;
}) {
  const userId = useAppStore((s) => s.session?.user?.id) ?? 'local';
  const { saveVoice } = useCallCenter();
  const online = useOnline();
  const [takes, setTakes] = useState<Take[]>([]);
  const [version, setVersion] = useState(0);
  const [recording, setRecording] = useState(false);
  const [busy, setBusy] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [live, setLive] = useState('');
  const [useTranscript, setUseTranscript] = useState(readTranscriptPref);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const transcriptRef = useRef<{ stop: () => Promise<string> } | null>(null);
  const startedRef = useRef(0);

  useEffect(() => {
    let alive = true;
    void listTakes(userId, promptId).then((t) => alive && setTakes(t));
    return () => {
      alive = false;
    };
  }, [userId, promptId, version]);

  useEffect(() => {
    if (!recording) return;
    const id = window.setInterval(() => {
      const s = Math.floor((Date.now() - startedRef.current) / 1000);
      setElapsed(s);
      if (s >= MAX_SECONDS) recorderRef.current?.stop();
    }, 250);
    return () => window.clearInterval(id);
  }, [recording]);

  // Stop the microphone if the screen closes mid-recording.
  useEffect(
    () => () => {
      if (recorderRef.current?.state === 'recording') recorderRef.current.stop();
      void transcriptRef.current?.stop();
    },
    []
  );

  const canTranscribe = online && liveTranscriptSupported();

  const start = useCallback(async () => {
    setError(null);
    setLive('');
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
    } catch {
      setError('The microphone is blocked. Allow it in the browser settings, then try again.');
      return;
    }
    const mimeType = preferredMime();
    const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => e.data.size && chunks.push(e.data);
    recorder.onstop = async () => {
      stream.getTracks().forEach((t) => t.stop());
      setRecording(false);
      setBusy(true);
      const transcript = (await transcriptRef.current?.stop()) ?? '';
      transcriptRef.current = null;
      const blob = new Blob(chunks, { type: recorder.mimeType || mimeType || 'audio/webm' });
      const stats = await analyzeRecording(blob);
      const take: Take = { id: newId(), userId, promptId, createdAt: new Date().toISOString(), blob, stats, ...(transcript ? { transcript } : {}) };
      await saveTake(take);
      saveVoice({
        promptId,
        seconds: Math.round(stats?.seconds ?? 0),
        longPauses: stats?.longPauses ?? 0,
        ...(transcript && stats ? { wpm: wordsPerMinute(countWords(transcript), stats.speechSeconds) } : {}),
      });
      setBusy(false);
      setVersion((v) => v + 1);
      onTake?.(take);
    };
    recorderRef.current = recorder;
    startedRef.current = Date.now();
    setElapsed(0);
    recorder.start();
    setRecording(true);
    if (useTranscript && canTranscribe) transcriptRef.current = startTranscript(setLive);
  }, [userId, promptId, saveVoice, onTake, useTranscript, canTranscribe]);

  const stop = () => recorderRef.current?.stop();

  const toggleTranscript = () => {
    const next = !useTranscript;
    setUseTranscript(next);
    try {
      localStorage.setItem(TRANSCRIPT_PREF, next ? '1' : '0');
    } catch {
      // ignore
    }
  };

  const latest = takes.at(-1);
  const first = takes.length > 1 ? takes[0] : null;
  const latestWpm = latest?.transcript && latest.stats ? wordsPerMinute(countWords(latest.transcript), latest.stats.speechSeconds) : null;
  const inTarget = target && elapsed >= target[0] && elapsed <= target[1];

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {recording ? (
          <button type="button" onClick={stop} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500 text-white animate-pulse">
            <Square size={13} /> Stop · <span className="tabular-nums">{clockLength(elapsed)}</span>
          </button>
        ) : (
          <button type="button" onClick={() => void start()} disabled={busy} className={primaryBtn}>
            {busy ? <Loader2 size={13} className="animate-spin" /> : <Mic size={13} />} {takes.length ? 'Record again' : 'Record'}
          </button>
        )}
        {recording && target && (
          <span className={`text-xs tabular-nums ${inTarget ? 'text-sage-soft-dark' : 'text-ink-light'}`}>
            target {clockLength(target[0])}–{clockLength(target[1])}
          </span>
        )}
        {canTranscribe && !recording && (
          <label className="inline-flex items-center gap-1.5 py-1 text-xs text-ink-light cursor-pointer">
            <input type="checkbox" checked={useTranscript} onChange={toggleTranscript} className="accent-clay-soft" />
            Live transcript (for words/min)
          </label>
        )}
      </div>
      {recording && useTranscript && live && <p className="text-xs text-ink-light italic" dir="ltr">{live}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}

      {latest && (
        <div className="rounded-xl bg-ink/3 p-3 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <TakeAudio take={latest} />
            <button type="button" onClick={() => download(latest)} className={secondaryBtn}>
              <Download size={13} /> Download
            </button>
          </div>
          {latest.stats ? (
            <ul className="space-y-1">
              {verdicts(latest.stats, latestWpm, target).map((v) => (
                <li key={v.text} className={`flex items-start gap-1.5 text-xs ${v.ok ? 'text-sage-soft-dark' : 'text-ink'}`}>
                  {v.ok ? <span aria-hidden="true">✓</span> : <AlertTriangle size={13} className="shrink-0 mt-px text-clay-soft" />}
                  {v.text}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-ink-light">Saved. (This browser can't measure the recording.)</p>
          )}
          {latest.transcript && (
            <p className="text-xs text-ink-light" dir="ltr">
              <span className="font-medium text-ink">What the transcript heard: </span>
              {latest.transcript}
            </p>
          )}
        </div>
      )}

      {history && takes.length > 1 && (
        <details className="group">
          <summary className="cursor-pointer text-xs text-ink-light hover:text-ink">
            Your takes ({takes.length}) {first && '· compare with your first one'}
          </summary>
          <ul className="mt-2 space-y-2">
            {[...takes].reverse().map((t, i) => (
              <li key={t.id} className="flex flex-wrap items-center gap-2 text-xs text-ink-light">
                {t === takes[0] ? (
                  <Pill tone="accent">
                    <Star size={11} /> First
                  </Pill>
                ) : (
                  i === 0 && <Pill tone="good">Latest</Pill>
                )}
                <span className="tabular-nums">{new Date(t.createdAt).toLocaleDateString()}</span>
                {t.stats && (
                  <span className="tabular-nums">
                    {clockLength(t.stats.seconds)} · {t.stats.longPauses} long pause{t.stats.longPauses === 1 ? '' : 's'}
                  </span>
                )}
                <TakeAudio take={t} />
                <button type="button" onClick={() => download(t)} aria-label="Download this take" className="p-1 hover:text-clay-soft">
                  <Download size={13} />
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await deleteTake(t.id);
                    setVersion((v) => v + 1);
                  }}
                  aria-label="Delete this take"
                  className="p-1 hover:text-red-500"
                >
                  <Trash2 size={13} />
                </button>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
