import { useTranslation } from '../../i18n/useTranslation';

const STEPS = ['listen', 'read', 'chunk', 'shadow', 'record'] as const;

/** How to shadow, step by step — shown under the Shadowing section's lessons. */
export default function ShadowingMethod() {
  const { t } = useTranslation();
  return (
    <div className="rounded-xl border border-border-subtle p-4">
      <h3 className="font-semibold text-ink mb-2">{t('english.shadowing.methodTitle')}</h3>
      <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        {STEPS.map((s, i) => (
          <li key={s} className="flex gap-2 text-sm">
            <span className="w-5 h-5 shrink-0 rounded-full bg-clay-soft/15 text-clay-soft text-xs flex items-center justify-center">{i + 1}</span>
            <span className="text-ink-light">{t(`english.shadowing.step.${s}`)}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
