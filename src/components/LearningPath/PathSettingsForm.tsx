import { useTranslation } from '../../i18n/useTranslation';
import {
  LEVELS, LISTENING_LEVELS, MINUTE_CHOICES, READING_LEVELS, SHADOWING_LEVELS, hasBritishCouncil, startsFor,
  type ListeningSource, type PathSettings, type ReadingSource,
} from '../../lib/learningPath';
import { dayTotal } from './format';

function Choice<T extends string>({ name, value, options, onChange }: {
  name: string;
  value: T;
  options: Array<{ value: T; label: string; hint?: string }>;
  onChange: (v: T) => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {options.map((o) => (
        <label
          key={o.value}
          className={`flex items-start gap-2 rounded-xl border p-3 cursor-pointer transition-colors ${
            value === o.value ? 'border-clay-soft/70 bg-clay-soft/8' : 'border-border-subtle hover:bg-ink/3'
          }`}
        >
          <input type="radio" name={name} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} className="mt-1 accent-clay-soft" />
          <span className="min-w-0">
            <span className="block text-sm font-medium text-ink">{o.label}</span>
            {o.hint && <span className="block text-xs text-ink-light">{o.hint}</span>}
          </span>
        </label>
      ))}
    </div>
  );
}

function LevelSelect<T extends string>({ id, label, name, value, options, onChange }: {
  id: string;
  label: string;
  /** What the menu is for, for screen readers (the visible label is shared). */
  name: string;
  value: T;
  options: Array<{ value: T; label: string }>;
  onChange: (v: T) => void;
}) {
  return (
    <label htmlFor={id} className="flex items-center gap-2 text-sm text-ink">
      <span className="text-ink-light">{label}</span>
      <select
        id={id}
        aria-label={name}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="px-2 py-1 rounded-lg bg-ink/5 border border-border-subtle text-sm text-ink focus:outline-none focus:border-clay-soft"
      >
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}

/** Your level, minutes a day, where Listening and Reading come from and where each section starts. */
export default function PathSettingsForm({ settings, onChange }: { settings: PathSettings; onChange: (next: PathSettings) => void }) {
  const { t } = useTranslation();
  const set = <K extends keyof PathSettings>(key: K, value: PathSettings[K]) => onChange({ ...settings, [key]: value });
  const readingSources: Array<{ value: ReadingSource; label: string; hint: string }> = [
    ...(hasBritishCouncil() ? [{ value: 'british-council' as const, label: t('path.source.britishCouncil'), hint: t('path.source.britishCouncilHint') }] : []),
    { value: 'ibrahim-adel', label: t('path.source.ibrahimAdel'), hint: t('path.source.ibrahimAdelHint') },
  ];

  return (
    <div className="space-y-5">
      <fieldset className="space-y-2">
        <legend className="text-sm font-semibold text-ink mb-1">{t('path.settings.yourLevel')}</legend>
        <p className="text-xs text-ink-light">{t('path.settings.yourLevelHint')}</p>
        <div className="flex flex-wrap gap-2" dir="ltr">
          {LEVELS.map((l) => (
            <button
              key={l}
              type="button"
              aria-pressed={settings.level === l}
              onClick={() => onChange({ ...settings, level: l, ...startsFor(l) })}
              className={`px-3 py-1.5 rounded-lg text-sm ${settings.level === l ? 'bg-clay-soft text-white' : 'bg-ink/5 text-ink hover:bg-ink/10'}`}
            >
              <span className="font-semibold">{l}</span> <bdi className="text-xs opacity-80">{t(`path.cefr.${l}`)}</bdi>
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="text-sm font-semibold text-ink mb-2">{t('path.settings.minutes')}</legend>
        <div className="flex flex-wrap items-center gap-2">
          {MINUTE_CHOICES.map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={settings.minutes === m}
              onClick={() => set('minutes', m)}
              className={`px-3 py-1.5 rounded-lg text-sm tabular-nums ${settings.minutes === m ? 'bg-clay-soft text-white' : 'bg-ink/5 text-ink hover:bg-ink/10'}`}
            >
              {t('path.minutes').replace('{n}', String(m))}
            </button>
          ))}
          <span className="text-xs text-ink-light">{t('path.settings.perDay').replace('{total}', dayTotal(settings.minutes, t))}</span>
        </div>
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="text-sm font-semibold text-ink mb-2" dir="ltr">{t('path.settings.listening')}</legend>
        <Choice<ListeningSource>
          name="path-listening"
          value={settings.listening}
          onChange={(v) => set('listening', v)}
          options={[
            { value: 'voa', label: t('path.source.voa'), hint: t('path.source.voaHint') },
            { value: 'ibrahim-adel', label: t('path.source.ibrahimAdel'), hint: t('path.source.ibrahimAdelHint') },
          ]}
        />
        <LevelSelect
          id="path-listening-level"
          label={t('path.settings.level')}
          name={`${t('path.settings.listening')} · ${t('path.settings.level')}`}
          value={settings.listeningLevel}
          onChange={(v) => set('listeningLevel', v)}
          options={LISTENING_LEVELS.map((l) => ({ value: l, label: `VOA · ${t(`path.level.${l}`)}` }))}
        />
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="text-sm font-semibold text-ink mb-2" dir="ltr">{t('path.settings.reading')}</legend>
        <Choice<ReadingSource> name="path-reading" value={readingSources.some((s) => s.value === settings.reading) ? settings.reading : 'ibrahim-adel'} onChange={(v) => set('reading', v)} options={readingSources} />
        <LevelSelect
          id="path-reading-level"
          label={t('path.settings.level')}
          name={`${t('path.settings.reading')} · ${t('path.settings.level')}`}
          value={settings.readingLevel}
          onChange={(v) => set('readingLevel', v)}
          options={READING_LEVELS.map((l) => ({ value: l, label: l }))}
        />
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="text-sm font-semibold text-ink mb-2" dir="ltr">Shadowing</legend>
        <LevelSelect
          id="path-shadowing-level"
          label={t('path.settings.level')}
          name={t('path.settings.shadowing')}
          value={settings.shadowingLevel}
          onChange={(v) => set('shadowingLevel', v)}
          options={SHADOWING_LEVELS.map((l) => ({ value: l, label: `Listening Time · ${l}` }))}
        />
      </fieldset>

      <p className="text-xs text-ink-light">{t('path.settings.hint')}</p>
    </div>
  );
}
