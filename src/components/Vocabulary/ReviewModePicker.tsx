import { X, Layers, Headphones, TextCursorInput } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';

export type ReviewMode = 'cards' | 'listen' | 'gap';

const MODES: Array<{ mode: ReviewMode; icon: typeof Layers; title: string; desc: string }> = [
  { mode: 'cards', icon: Layers, title: 'vocabulary.practice.cardsTitle', desc: 'vocabulary.practice.cardsDesc' },
  { mode: 'listen', icon: Headphones, title: 'vocabulary.practice.listenTitle', desc: 'vocabulary.practice.listenDesc' },
  { mode: 'gap', icon: TextCursorInput, title: 'vocabulary.practice.gapTitle', desc: 'vocabulary.practice.gapDesc' },
];

export default function ReviewModePicker({ count, onPick, onClose }: {
  count: number;
  onPick: (mode: ReviewMode) => void;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="fixed inset-0 bg-ink/50 flex items-center justify-center z-50 p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-card border border-border-subtle rounded-2xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-border-subtle flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-ink">{t('vocabulary.practice.pickTitle')}</h2>
            <p className="text-xs text-ink-light">{t('vocabulary.practice.pickCount').replace('{count}', String(count))}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-ink/5 rounded-lg transition-colors" aria-label={t('common.close')}>
            <X size={20} className="text-ink-light" />
          </button>
        </div>
        <div className="p-4 space-y-2">
          {MODES.map(({ mode, icon: Icon, title, desc }) => (
            <button
              key={mode}
              onClick={() => onPick(mode)}
              className="w-full flex items-center gap-3 p-3 rounded-xl border border-border-subtle hover:border-clay-soft/60 hover:bg-clay-soft/5 text-start transition-colors"
            >
              <span className="w-10 h-10 shrink-0 rounded-lg bg-clay-soft/10 text-clay-soft flex items-center justify-center">
                <Icon size={20} />
              </span>
              <span>
                <span className="block font-medium text-ink">{t(title)}</span>
                <span className="block text-xs text-ink-light">{t(desc)}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
