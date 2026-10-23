import { Brain } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { useDueSummary } from '../../lib/useDueSummary';
import { openReview } from '../../lib/openReview';

/** On the day's page: words due for review now, one click from the review. Hidden when nothing is due. */
export default function ReviewNudge() {
  const { t } = useTranslation();
  const { due, hardDue } = useDueSummary();
  if (!due) return null;
  return (
    <div className="mt-4 flex flex-wrap items-center gap-3 p-3 rounded-xl border border-clay-soft/40 bg-clay-soft/5" role="status" data-testid="review-nudge">
      <Brain size={18} className="text-clay-soft shrink-0" />
      <p className="flex-1 min-w-[10rem] text-sm text-ink">
        {t('vocabulary.srs.nudge').replace('{count}', String(due))}
        {hardDue > 0 && <span className="text-red-600 dark:text-red-400"> · {t('vocabulary.srs.nudgeHard').replace('{count}', String(hardDue))}</span>}
      </p>
      <button onClick={openReview} className="px-3 py-1.5 text-sm rounded-lg bg-clay-soft text-white hover:bg-clay-soft-dark transition-colors">
        {t('vocabulary.srs.nudgeAction')}
      </button>
    </div>
  );
}
