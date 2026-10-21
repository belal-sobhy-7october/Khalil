import { useState } from 'react';
import { getRoleplay } from '../../../data/sales/plan';
import type { Lang } from '../../../data/sales/types';
import { bestRoleplay } from '../../../lib/sales/progress';
import { roleplayPrompt } from '../../../lib/sales/prompts';
import { useSales } from '../SalesContext';
import { AiButtons, Pill } from '../ui';
import { primaryBtn } from '../../CallCenter/ui';
import { pick } from '../../../lib/sales/text';

/** A role-play with an AI customer, then a self-score with its checklist. */
export default function RoleplayActivity({ refId, lang, onDone }: { refId: string; lang: Lang; onDone: () => void }) {
  const r = getRoleplay(refId);
  const { calls, saveCall } = useSales();
  const [ticked, setTicked] = useState<boolean[]>(() => (r ? r.steps.map(() => false) : []));
  const [saved, setSaved] = useState<number | null>(null);
  if (!r) return null;
  const best = bestRoleplay(calls, r.id);
  const percent = Math.round((ticked.filter(Boolean).length / r.steps.length) * 100);
  const rows: Array<[string, string]> = [
    [pick(lang, 'بتبيع', 'You sell'), r.youSell],
    [pick(lang, 'الـ AI هيبقى', 'The AI plays'), r.persona],
    [pick(lang, 'الموقف', 'Situation'), r.situation],
    [pick(lang, 'المطلوب', 'Your goal'), r.goal],
  ];
  return (
    <div className="space-y-4">
      <dl className="grid gap-2">
        {rows.map(([k, v]) => (
          <div key={k} className="rounded-xl bg-ink/3 px-3 py-2">
            <dt className="text-[11px] font-semibold text-ink-light">{k}</dt>
            <dd className="text-sm text-ink">{v}</dd>
          </div>
        ))}
      </dl>
      <div className="space-y-1.5">
        <div className="text-xs font-semibold text-ink-light">{pick(lang, '1. ابدأ الرول بلاي (بالصوت أحسن)', '1. Start the role-play (voice is best)')}</div>
        <AiButtons prompt={roleplayPrompt(r, lang)} lang={lang} />
        <p className="text-[11px] text-ink-light">
          {pick(lang, 'في الآخر قول «تقييم» والـ AI هيقيّمك على كل نقطة.', 'At the end, say "feedback" and the AI scores you on each step.')}
        </p>
      </div>
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-ink-light">{pick(lang, '2. قيّم نفسك: عملت إيه فعلًا؟', '2. Score yourself: what did you actually do?')}</span>
          {best !== null && <Pill tone={best >= 80 ? 'good' : 'neutral'}>{pick(lang, `أحسن نتيجة ${best}%`, `Best ${best}%`)}</Pill>}
        </div>
        <ul className="space-y-1">
          {r.steps.map((s, i) => (
            <li key={s}>
              <label className="flex items-start gap-2 text-sm text-ink cursor-pointer">
                <input
                  type="checkbox"
                  checked={ticked[i]}
                  onChange={() => setTicked((t) => t.map((v, j) => (j === i ? !v : v)))}
                  className="mt-1 accent-sage-soft"
                />
                {s}
              </label>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              saveCall(r.id, percent);
              setSaved(percent);
              onDone();
            }}
            className={primaryBtn}
          >
            {pick(lang, `احفظ النتيجة: ${percent}%`, `Save the score: ${percent}%`)}
          </button>
          {saved !== null && (
            <span className="text-xs text-sage-soft-dark">
              {saved >= 80 ? pick(lang, 'عاش! 💪', 'Great job! 💪') : pick(lang, 'اتحفظت. جرب تاني بكرة وركز على اللي فاتك.', 'Saved. Try again tomorrow and focus on what you missed.')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
