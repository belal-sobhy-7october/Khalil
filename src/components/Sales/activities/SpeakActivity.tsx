import { useEffect, useMemo, useRef, useState } from 'react';
import { Download, Mic, Square } from 'lucide-react';
import { getSpeak } from '../../../data/sales/plan';
import type { Lang } from '../../../data/sales/types';
import type { Take } from '../../../lib/callCenter/recordings';
import { speakFeedbackPrompt } from '../../../lib/sales/prompts';
import { listSalesTakes, saveSalesTake } from '../../../lib/sales/recordings';
import { useRecorder } from '../../../lib/useRecorder';
import { useAppStore } from '../../../store/appStore';
import { AiButtons, SpeakButton } from '../ui';
import { primaryBtn, secondaryBtn } from '../../CallCenter/ui';
import { pick } from '../../../lib/sales/text';

const clock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

/** The takes saved on this device for a prompt, oldest first; `version` reloads them. */
function useTakes(speakId: string | undefined, version: number): Take[] {
  const userId = useAppStore((st) => st.session?.user?.id);
  const [takes, setTakes] = useState<Take[]>([]);
  useEffect(() => {
    if (!userId || !speakId) return;
    let alive = true;
    void listSalesTakes(userId, speakId).then((list) => alive && setTakes(list));
    return () => {
      alive = false;
    };
  }, [userId, speakId, version]);
  return takes;
}

function TakePlayer({ take, label, lang }: { take: Take; label: string; lang: Lang }) {
  const src = useMemo(() => URL.createObjectURL(take.blob), [take.blob]);
  useEffect(() => () => URL.revokeObjectURL(src), [src]);
  return (
    <div className="space-y-0.5">
      <div className="text-[11px] text-ink-light">
        {label} · {new Date(take.createdAt).toLocaleDateString(lang === 'en' ? 'en-GB' : 'ar-EG')}
      </div>
      <audio src={src} controls className="w-full max-w-md" />
    </div>
  );
}

/** Say it out loud and record it (on the device only), with a timer against the target length. */
export default function SpeakActivity({ refId, lang, onDone }: { refId: string; lang: Lang; onDone: () => void }) {
  const s = getSpeak(refId);
  const { recording, url, error, start, stop } = useRecorder();
  const [seconds, setSeconds] = useState(0);
  const [took, setTook] = useState<number | null>(null);
  const startedAt = useRef(0);
  const userId = useAppStore((st) => st.session?.user?.id);
  const [version, setVersion] = useState(0);
  const takes = useTakes(s?.id, version);
  const before = useTakes(s?.compareWith, 0)[0];

  // A finished recording is saved on the device (the first take and the latest five).
  useEffect(() => {
    if (!url || !userId || !s) return;
    void saveSalesTake(userId, s.id, url).then(() => setVersion((v) => v + 1));
  }, [url, userId, s]);

  useEffect(() => {
    if (!recording) return;
    startedAt.current = Date.now();
    const timer = window.setInterval(() => setSeconds(Math.floor((Date.now() - startedAt.current) / 1000)), 250);
    return () => window.clearInterval(timer);
  }, [recording]);

  if (!s) return null;
  const finish = () => {
    stop();
    setTook(seconds);
    onDone();
  };
  return (
    <div className="space-y-3">
      <p className="text-sm text-ink leading-relaxed">{s.prompt}</p>
      <ol className="list-decimal ps-5 text-sm text-ink-light space-y-0.5">
        {s.structure.map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ol>
      <div className="flex flex-wrap items-center gap-3">
        {recording ? (
          <button type="button" onClick={finish} className={`${primaryBtn} bg-red-500 hover:bg-red-600`}>
            <Square size={13} /> {pick(lang, 'وقّف', 'Stop')} · {clock(seconds)}
          </button>
        ) : (
          <button type="button" onClick={() => void start().then(() => setSeconds(0))} className={primaryBtn}>
            <Mic size={13} /> {url ? pick(lang, 'سجّل تاني', 'Record again') : pick(lang, 'سجّل', 'Record')}
          </button>
        )}
        <span className="text-xs text-ink-light tabular-nums">
          {pick(lang, `الهدف: حوالي ${s.seconds} ثانية`, `Target: about ${s.seconds} seconds`)}
        </span>
      </div>
      {error && <p className="text-xs text-red-600">{pick(lang, 'المايك مش متاح. اسمح بيه من المتصفح، أو قولها بصوت عالي وعلّم إنها خلصت.', 'The microphone is not available. Allow it in the browser, or just say it out loud and mark it done.')}</p>}
      {url && !recording && (
        <div className="space-y-1.5">
          <audio src={url} controls className="w-full max-w-md" />
          <div className="flex flex-wrap items-center gap-3 text-xs text-ink-light">
            {took !== null && (
              <span className="tabular-nums">
                {pick(lang, `${took} ثانية`, `${took} seconds`)}
                {took > s.seconds * 1.3 ? pick(lang, ' · أطول من الهدف: اختصر', ' · longer than the target: cut it down') : ''}
                {took < s.seconds * 0.5 ? pick(lang, ' · قصير: زوّد مثال', ' · short: add an example') : ''}
              </span>
            )}
            <a href={url} download={`${s.id}.webm`} className={secondaryBtn}>
              <Download size={13} /> {pick(lang, 'نزّل التسجيل', 'Download')}
            </a>
          </div>
          <p className="text-[11px] text-ink-light">{pick(lang, 'التسجيل بيتحفظ على جهازك بس (أول مرة وآخر 5 مرات)، مش في الحساب.', 'Saved on this device only (your first take and the latest five), not in your account.')}</p>
        </div>
      )}
      {(before || takes.length > 0) && !recording && (
        <div className="space-y-2 rounded-xl border border-border-subtle p-3">
          <div className="text-xs font-semibold text-ink-light">{pick(lang, 'تسجيلاتك على الجهاز ده', 'Your recordings on this device')}</div>
          {before && <TakePlayer take={before} label={pick(lang, 'تسجيل أول يوم (قبل)', 'Your day-one recording (before)')} lang={lang} />}
          {takes[0] && <TakePlayer take={takes[0]} label={pick(lang, 'أول مرة هنا', 'First take')} lang={lang} />}
          {takes.length > 1 && <TakePlayer take={takes[takes.length - 1]} label={pick(lang, 'آخر مرة', 'Latest take')} lang={lang} />}
        </div>
      )}
      {s.model && (
        <details>
          <summary className="cursor-pointer text-xs text-ink-light hover:text-ink">{pick(lang, 'شوف نموذج بعد ما تجرب', 'See a model after your try')}</summary>
          <div className="mt-2 flex items-start gap-1 rounded-xl bg-sage-soft/8 border border-sage-soft/30 p-3">
            <p className="flex-1 text-sm text-ink leading-relaxed">{s.model}</p>
            {lang === 'en' && <SpeakButton text={s.model} />}
          </div>
        </details>
      )}
      <details>
        <summary className="cursor-pointer text-xs text-ink-light hover:text-ink">{pick(lang, 'خد رأي الـ AI (اكتب اللي قلته)', 'Get AI feedback (type what you said)')}</summary>
        <div className="mt-2">
          <AiButtons prompt={speakFeedbackPrompt(s, lang)} lang={lang} />
        </div>
      </details>
    </div>
  );
}
