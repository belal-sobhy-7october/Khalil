import { useState } from 'react';
import { ArrowDown, ArrowUp, Eye, EyeOff, Moon, Plus, Trash2 } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { BUILTIN_ITEMS, isCustomItem, type WirdItem } from '../../lib/wird';
import { newWirdItem, useWirdItems } from '../../lib/wirdItems';
import { SettingCard, Toggle } from './controls';

/** Ready-made items to add in one tap (named in the app's language). */
const SUGGESTIONS: Array<{ key: string; kind: 'check' | 'count'; goal?: number; unitKey?: string }> = [
  { key: 'dhikr', kind: 'count', goal: 100, unitKey: 'times' },
  { key: 'istighfar', kind: 'count', goal: 100, unitKey: 'times' },
  { key: 'salawat', kind: 'count', goal: 100, unitKey: 'times' },
  { key: 'study', kind: 'count', goal: 30, unitKey: 'minutes' },
  { key: 'duha', kind: 'check' },
  { key: 'witr', kind: 'check' },
  { key: 'sadaqah', kind: 'check' },
  { key: 'fasting', kind: 'check' },
];

const inputClass = 'border border-border-subtle rounded-lg px-2 py-1 text-sm bg-ink/3 text-ink focus:outline-none focus:ring-1 focus:ring-clay-soft/40';

/** The wird's items: add your own, hide or delete, reorder, set goals and what shows in today's tasks. */
export default function WirdSettingsPanel() {
  const { t } = useTranslation();
  const [items, setItems] = useWirdItems();
  const [name, setName] = useState('');
  const [kind, setKind] = useState<'check' | 'count'>('check');
  const [goal, setGoal] = useState('1');
  const [unit, setUnit] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const nameOf = (item: WirdItem) => item.name ?? t(`wird.row.${item.id}`);
  const update = (id: string, p: Partial<WirdItem>) => setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...p } : i)));
  const move = (index: number, by: -1 | 1) =>
    setItems((prev) => {
      const next = [...prev];
      const to = index + by;
      if (to < 0 || to >= next.length) return prev;
      [next[index], next[to]] = [next[to], next[index]];
      return next;
    });
  const remove = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    setConfirmDelete(null);
  };
  const add = (item: WirdItem) => setItems((prev) => [...prev, item]);
  const exists = (n: string) => items.some((i) => nameOf(i).trim() === n.trim());

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || exists(name)) return;
    add(newWirdItem(kind, name, Number(goal) || 1, unit));
    setName('');
    setGoal('1');
    setUnit('');
  };

  return (
    <div className="space-y-4">
      <SettingCard icon={<Moon size={18} className="text-clay-soft" />} title={t('settings.wird.title')} hint={t('settings.wird.hint')}>
        <ol className="space-y-2">
          {items.map((item, i) => {
            const custom = isCustomItem(item);
            const builtin = BUILTIN_ITEMS.find((b) => b.id === item.id);
            const label = nameOf(item);
            const hasGoal = item.kind === 'count' || item.kind === 'rawatib';
            return (
              <li key={item.id} className={`rounded-lg border border-border-subtle p-3 space-y-2 ${item.hidden ? 'opacity-60' : ''}`}>
                <div className="flex items-center gap-2">
                  <div className="flex-1 min-w-0 flex flex-wrap items-center gap-x-2 gap-y-1">
                    {custom ? (
                      <input
                        defaultValue={item.name}
                        onBlur={(e) => e.target.value.trim() && e.target.value.trim() !== item.name && update(item.id, { name: e.target.value.trim().slice(0, 60) })}
                        aria-label={t('settings.wird.name')}
                        className={`${inputClass} flex-1 min-w-[8rem]`}
                        dir="auto"
                      />
                    ) : (
                      <span className="text-sm font-medium text-ink">{label}</span>
                    )}
                    <span className="shrink-0 text-[11px] px-1.5 py-0.5 rounded bg-ink/5 text-ink-light">{t(`settings.wird.kinds.${item.kind}`)}</span>
                  </div>
                  <div className="shrink-0 flex items-center">
                    <button onClick={() => move(i, -1)} disabled={i === 0} className="p-1.5 rounded-md text-ink-light hover:bg-ink/5 disabled:opacity-30" aria-label={`${t('settings.moveUp')}: ${label}`}>
                      <ArrowUp size={14} />
                    </button>
                    <button onClick={() => move(i, 1)} disabled={i === items.length - 1} className="p-1.5 rounded-md text-ink-light hover:bg-ink/5 disabled:opacity-30" aria-label={`${t('settings.moveDown')}: ${label}`}>
                      <ArrowDown size={14} />
                    </button>
                    {custom ? (
                      <button onClick={() => setConfirmDelete(item.id)} className="p-1.5 rounded-md text-ink-light hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30" aria-label={`${t('common.delete')}: ${label}`}>
                        <Trash2 size={14} />
                      </button>
                    ) : (
                      <button
                        onClick={() => update(item.id, { hidden: !item.hidden })}
                        aria-pressed={!item.hidden}
                        className="p-1.5 rounded-md text-ink-light hover:bg-ink/5"
                        aria-label={`${t(item.hidden ? 'settings.show' : 'settings.hide')}: ${label}`}
                        title={t(item.hidden ? 'settings.show' : 'settings.hide')}
                      >
                        {item.hidden ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    )}
                  </div>
                </div>

                {confirmDelete === item.id && (
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-ink">{t('settings.wird.confirmDelete').replace('{name}', label)}</span>
                    <button onClick={() => remove(item.id)} className="px-2 py-1 rounded bg-red-500 text-white hover:bg-red-600">{t('common.delete')}</button>
                    <button onClick={() => setConfirmDelete(null)} className="px-2 py-1 rounded text-ink-light hover:bg-ink/5">{t('common.cancel')}</button>
                  </div>
                )}

                {!item.hidden && (
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    {hasGoal && (
                      <label className="flex items-center gap-1.5 text-xs text-ink-light">
                        {t('settings.wird.goal')}
                        <input
                          key={`${item.id}-${item.goal}`}
                          type="number"
                          min={item.step ?? 1}
                          max={builtin?.max ?? builtin?.goal ?? undefined}
                          step={item.step ?? 1}
                          defaultValue={item.goal ?? 1}
                          onBlur={(e) => {
                            const v = Number(e.target.value);
                            const cap = builtin?.max ?? builtin?.goal;
                            if (v > 0 && v !== item.goal) update(item.id, { goal: cap ? Math.min(v, cap) : v });
                            else e.target.value = String(item.goal ?? 1);
                          }}
                          onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
                          className={`${inputClass} w-20 tabular-nums`}
                        />
                        {custom ? (
                          <input
                            defaultValue={item.unit ?? ''}
                            onBlur={(e) => update(item.id, { unit: e.target.value.trim().slice(0, 30) || undefined })}
                            placeholder={t('settings.wird.unitPlaceholder')}
                            aria-label={t('settings.wird.unit')}
                            className={`${inputClass} w-24`}
                            dir="auto"
                          />
                        ) : (
                          <span>{item.id === 'quran' ? t('wird.juz') : t('wird.unit.rakaat')}</span>
                        )}
                      </label>
                    )}
                    <div className="flex-1 min-w-[12rem]">
                      <Toggle checked={!!item.inToday} onChange={(v) => update(item.id, { inToday: v })} label={t('settings.wird.inToday')} />
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </SettingCard>

      <SettingCard icon={<Plus size={18} className="text-clay-soft" />} title={t('settings.wird.addTitle')} hint={t('settings.wird.addHint')}>
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTIONS.filter((s) => !exists(t(`settings.wird.suggest.${s.key}`))).map((s) => (
            <button
              key={s.key}
              onClick={() => add(newWirdItem(s.kind, t(`settings.wird.suggest.${s.key}`), s.goal, s.unitKey ? t(`settings.wird.units.${s.unitKey}`) : undefined))}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-border-subtle text-sm text-ink hover:bg-ink/5"
            >
              <Plus size={12} /> {t(`settings.wird.suggest.${s.key}`)}
            </button>
          ))}
        </div>
        <form onSubmit={submit} className="flex flex-wrap items-end gap-2">
          <label className="flex flex-col gap-1 text-xs text-ink-light flex-1 min-w-[10rem]">
            {t('settings.wird.name')}
            <input value={name} onChange={(e) => setName(e.target.value)} maxLength={60} placeholder={t('settings.wird.namePlaceholder')} className={inputClass} dir="auto" />
          </label>
          <label className="flex flex-col gap-1 text-xs text-ink-light">
            {t('settings.wird.kind')}
            <select value={kind} onChange={(e) => setKind(e.target.value as 'check' | 'count')} className={inputClass}>
              <option value="check">{t('settings.wird.kinds.check')}</option>
              <option value="count">{t('settings.wird.kinds.count')}</option>
            </select>
          </label>
          {kind === 'count' && (
            <>
              <label className="flex flex-col gap-1 text-xs text-ink-light">
                {t('settings.wird.goal')}
                <input type="number" min={1} value={goal} onChange={(e) => setGoal(e.target.value)} className={`${inputClass} w-20`} />
              </label>
              <label className="flex flex-col gap-1 text-xs text-ink-light">
                {t('settings.wird.unit')}
                <input value={unit} onChange={(e) => setUnit(e.target.value)} maxLength={30} placeholder={t('settings.wird.unitPlaceholder')} className={`${inputClass} w-24`} dir="auto" />
              </label>
            </>
          )}
          <button type="submit" disabled={!name.trim() || exists(name)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-clay-soft text-white text-sm hover:bg-clay-soft-dark disabled:opacity-40">
            <Plus size={14} /> {t('settings.wird.add')}
          </button>
        </form>
      </SettingCard>
    </div>
  );
}
