import { ArrowDown, ArrowUp, CheckCircle2, Eye, EyeOff, LayoutList, ListChecks } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { COMPLETED_RULES, useTasksSettings, type TasksSettings } from '../../lib/tasksSettings';
import { Segmented, SettingCard, Toggle } from './controls';

/** Settings of the Tasks & Habits page: its parts, finished tasks, and what today's tasks list. */
export default function TasksSettingsPanel() {
  const { t } = useTranslation();
  const [settings, setSettings] = useTasksSettings();
  const patch = (p: Partial<TasksSettings>) => setSettings((prev) => ({ ...prev, ...p }));

  const move = (index: number, by: -1 | 1) =>
    setSettings((prev) => {
      const sections = [...prev.sections];
      const to = index + by;
      if (to < 0 || to >= sections.length) return prev;
      [sections[index], sections[to]] = [sections[to], sections[index]];
      return { ...prev, sections };
    });
  const toggleHidden = (index: number) =>
    setSettings((prev) => ({ ...prev, sections: prev.sections.map((s, i) => (i === index ? { id: s.id, ...(s.hidden ? {} : { hidden: true }) } : s)) }));

  return (
    <div className="space-y-4">
      <SettingCard icon={<LayoutList size={18} className="text-clay-soft" />} title={t('settings.page.title')} hint={t('settings.page.hint')}>
        <ol className="space-y-1.5">
          {settings.sections.map((s, i) => {
            const name = t(`settings.page.parts.${s.id}`);
            return (
              <li key={s.id} className={`flex items-center gap-2 rounded-lg border border-border-subtle px-3 py-2 ${s.hidden ? 'opacity-60' : ''}`}>
                <span className="w-5 text-xs text-ink-lighter tabular-nums">{i + 1}</span>
                <span className="flex-1 min-w-0 text-sm text-ink">{name}</span>
                <button onClick={() => move(i, -1)} disabled={i === 0} className="p-1.5 rounded-md text-ink-light hover:bg-ink/5 disabled:opacity-30" aria-label={`${t('settings.moveUp')}: ${name}`}>
                  <ArrowUp size={14} />
                </button>
                <button onClick={() => move(i, 1)} disabled={i === settings.sections.length - 1} className="p-1.5 rounded-md text-ink-light hover:bg-ink/5 disabled:opacity-30" aria-label={`${t('settings.moveDown')}: ${name}`}>
                  <ArrowDown size={14} />
                </button>
                <button
                  onClick={() => toggleHidden(i)}
                  aria-pressed={!s.hidden}
                  className="p-1.5 rounded-md text-ink-light hover:bg-ink/5"
                  aria-label={`${t(s.hidden ? 'settings.show' : 'settings.hide')}: ${name}`}
                  title={t(s.hidden ? 'settings.show' : 'settings.hide')}
                >
                  {s.hidden ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </li>
            );
          })}
        </ol>
      </SettingCard>

      <SettingCard icon={<CheckCircle2 size={18} className="text-clay-soft" />} title={t('settings.completed.title')} hint={t('settings.completed.hint')}>
        <div role="radiogroup" aria-label={t('settings.completed.title')} className="space-y-1.5">
          {COMPLETED_RULES.map((rule) => (
            <button
              key={rule}
              role="radio"
              aria-checked={settings.completed === rule}
              onClick={() => patch({ completed: rule })}
              className={`w-full text-start rounded-lg border px-3 py-2 transition-colors ${settings.completed === rule ? 'border-clay-soft bg-clay-soft/8' : 'border-border-subtle hover:bg-ink/3'}`}
            >
              <span className="flex items-center gap-2 text-sm text-ink">
                <span className={`w-3.5 h-3.5 rounded-full border-2 shrink-0 ${settings.completed === rule ? 'border-clay-soft bg-clay-soft' : 'border-ink/25'}`} />
                {t(`settings.completed.rules.${rule}.name`)}
              </span>
              <span className="block text-xs text-ink-light ms-5.5">{t(`settings.completed.rules.${rule}.hint`)}</span>
            </button>
          ))}
        </div>
      </SettingCard>

      <SettingCard icon={<ListChecks size={18} className="text-clay-soft" />} title={t('settings.today.title')} hint={t('settings.today.hint')}>
        <div className="space-y-3">
          <Toggle checked={settings.todayWird} onChange={(v) => patch({ todayWird: v })} label={t('settings.today.wird')} hint={t('settings.today.wirdHint')} />
          <Toggle checked={settings.todayHabits} onChange={(v) => patch({ todayHabits: v })} label={t('settings.today.habits')} hint={t('settings.today.habitsHint')} />
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm text-ink">{t('settings.today.position')}</span>
            <Segmented
              label={t('settings.today.position')}
              value={settings.recurringPosition}
              onChange={(v) => patch({ recurringPosition: v })}
              options={[
                { value: 'top', label: t('settings.today.positionTop') },
                { value: 'bottom', label: t('settings.today.positionBottom') },
              ]}
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm text-ink">{t('settings.today.doneRecurring')}</span>
            <Segmented
              label={t('settings.today.doneRecurring')}
              value={settings.doneRecurring}
              onChange={(v) => patch({ doneRecurring: v })}
              options={[
                { value: 'stay', label: t('settings.today.doneStay') },
                { value: 'hide', label: t('settings.today.doneHide') },
              ]}
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm text-ink">{t('settings.today.prayerTick')}</span>
            <Segmented
              label={t('settings.today.prayerTick')}
              value={settings.prayerTick}
              onChange={(v) => patch({ prayerTick: v })}
              options={[
                { value: 'jamaah', label: t('wird.state.jamaah') },
                { value: 'alone', label: t('wird.state.alone') },
              ]}
            />
          </div>
        </div>
      </SettingCard>
    </div>
  );
}
