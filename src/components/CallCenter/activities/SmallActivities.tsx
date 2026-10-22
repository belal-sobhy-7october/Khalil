import { useState } from 'react';
import { BookOpen, BookmarkPlus, ExternalLink, Mic, Save } from 'lucide-react';
import { getPhraseSet, getWeek } from '../../../data/callCenter';
import { EFSET_URL } from '../../../data/callCenter/plan';
import { efsetLevel, latestEfset } from '../../../lib/callCenter/progress';
import { openFlashcards } from '../../../lib/callCenter/navigation';
import { getToday } from '../../../store/dateHelpers';
import { useCallCenter } from '../CallCenterContext';
import { useAddToFlashcards } from '../useFlashcards';
import { ArabicNote, NeedsInternet, primaryBtn, secondaryBtn } from '../ui';

/** The weekly review (`L1-W2`), or the review before a level exam (`L1-mistakes`). */
export function ReviewActivity({ refId, onGoTab }: { refId: string; onGoTab: (tab: 'voice' | 'interview' | 'tests') => void }) {
  const week = getWeek(refId);
  const { mistakes } = useCallCenter();
  const flash = useAddToFlashcards();
  const phrases = week ? week.content.phraseSets.flatMap((id) => getPhraseSet(id)?.phrases ?? []) : [];
  return (
    <div className="space-y-3">
      {week ? (
        <>
          <ArabicNote>يوم المراجعة: ضيف جمل الأسبوع للـ flashcards وراجعها، وبعدين سجّل تاني أضعف إجابة عندك، وبعدها امتحان الأسبوع.</ArabicNote>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => void flash.add(`Call Center: ${week.title}`, phrases)} className={secondaryBtn}>
              <BookmarkPlus size={13} /> Add the week's {phrases.length} phrases to flashcards
            </button>
            <button type="button" onClick={openFlashcards} className={secondaryBtn}>
              <BookOpen size={13} /> Open my flashcards
            </button>
            <button type="button" onClick={() => onGoTab('voice')} className={secondaryBtn}>
              <Mic size={13} /> Re-record in Voice Studio
            </button>
          </div>
          {flash.status && <p className="text-[11px] text-sage-soft-dark">{flash.status}</p>}
        </>
      ) : (
        <ArabicNote>قبل الامتحان: راجع الغلطات اللي اتجمعت من امتحاناتك، وشغّل أضعف تسجيلاتك تاني.</ArabicNote>
      )}
      {mistakes.length > 0 && (
        <div>
          <div className="text-xs font-medium text-ink-light mb-1.5">Your latest mistakes</div>
          <ul className="space-y-1 text-sm">
            {mistakes.slice(0, week ? 6 : 15).map((m) => (
              <li key={m.id} className="rounded-lg bg-ink/3 px-3 py-1.5">
                <span className="text-red-600/90 dark:text-red-400 line-through decoration-1">{m.wrong || '(no answer)'}</span>
                <span className="text-ink-light"> → </span>
                <span className="text-sage-soft-dark">{m.right}</span>
              </li>
            ))}
          </ul>
          <button type="button" onClick={() => onGoTab('tests')} className="mt-1.5 text-xs text-clay-soft hover:underline">
            See the whole mistake log
          </button>
        </div>
      )}
    </div>
  );
}

/** EF SET: take the free test online, then save the score here. */
export function EfsetActivity({ onDone }: { onDone: () => void }) {
  const { settings, setSettings } = useCallCenter();
  const [score, setScore] = useState('');
  const last = latestEfset(settings);
  const value = Number(score);
  const valid = score !== '' && value >= 0 && value <= 100;
  return (
    <div className="space-y-3">
      <ArabicNote>اختبار مجاني 50 دقيقة (قراءة واستماع) وبيديك شهادة CEFR تحطها في الـ CV واللينكدإن. خده دلوقتي وبعد ليفل 3 وبعد ليفل 5.</ArabicNote>
      <div className="flex flex-wrap items-center gap-2">
        <a href={EFSET_URL} target="_blank" rel="noopener noreferrer" className={primaryBtn}>
          <ExternalLink size={13} /> Open EF SET
        </a>
        <NeedsInternet />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <label htmlFor="efset-score" className="text-sm text-ink">
          Your score (0–100)
        </label>
        <input
          id="efset-score"
          type="number"
          min={0}
          max={100}
          value={score}
          onChange={(e) => setScore(e.target.value)}
          className="w-24 rounded-lg border border-border-subtle bg-transparent px-2 py-1 text-sm text-ink tabular-nums"
        />
        <button
          type="button"
          disabled={!valid}
          onClick={() => {
            setSettings((s) => ({ ...s, efset: [...s.efset, { date: getToday(), score: Math.round(value) }] }));
            setScore('');
            onDone();
          }}
          className={`${secondaryBtn} disabled:opacity-50`}
        >
          <Save size={13} /> Save
        </button>
        {valid && <span className="text-xs text-ink-light">= {efsetLevel(value)}</span>}
      </div>
      {last !== null && (
        <p className="text-xs text-ink-light">
          Last saved: {last} ({efsetLevel(last)})
        </p>
      )}
    </div>
  );
}
