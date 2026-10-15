import { useState } from 'react';
import { Check, Sun, Moon, Languages, Bell, Palette, Sparkles } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { useAppStore } from '../../store/appStore';
import { APPEARANCES, useAppearance, type Appearance } from '../../lib/appearance';
import { notificationPermission, requestNotificationPermission } from '../../lib/systemNotify';

function ThemePreview({ a, mode }: { a: Appearance; mode: 'light' | 'dark' }) {
  const v = (mode === 'dark' ? a.dark : a.light) ?? {
    bg: mode === 'dark' ? '#1a1614' : '#f6f4ee',
    card: mode === 'dark' ? '#2f2823' : '#f3efe7',
    ink: mode === 'dark' ? '#e8ddd0' : '#3d2c1e',
    inkLight: '#8c7a6b',
    accent: '#c47860',
    border: '#00000014',
  };
  return (
    <div className="h-24 rounded-lg overflow-hidden p-2.5 flex gap-2" style={{ backgroundColor: v.bg, backgroundImage: a.background?.[mode] }} aria-hidden="true">
      <div className="flex-1 rounded-md p-2 space-y-1.5" style={{ backgroundColor: v.card, border: `1px solid ${v.border}` }}>
        <div className="h-2 w-2/3 rounded-full" style={{ backgroundColor: v.ink }} />
        <div className="h-1.5 w-1/2 rounded-full opacity-60" style={{ backgroundColor: v.inkLight }} />
        <div className="h-4 w-14 rounded-md mt-2" style={{ backgroundColor: v.accent }} />
      </div>
      <div className="w-10 rounded-md flex items-center justify-center" style={{ backgroundColor: v.card, border: `1px solid ${v.border}` }}>
        <div className="w-5 h-5 rounded-full border-2" style={{ borderColor: v.accent }} />
      </div>
    </div>
  );
}

export default function SettingsSection() {
  const { t, language, toggleLanguage } = useTranslation();
  const theme = useAppStore((s) => s.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);
  const userId = useAppStore((s) => s.session?.user?.id);
  const appearanceId = useAppearance((a) => a.id);
  const setAppearance = useAppearance((a) => a.set);
  const [permission, setPermission] = useState(notificationPermission);

  const choose = (a: Appearance) => {
    setAppearance(a.id, userId);
    // Themes look best in the mode they were designed for.
    if (a.preferredMode && a.preferredMode !== theme) toggleTheme();
  };

  const palettes = APPEARANCES.filter((a) => a.kind !== 'theme');
  const themes = APPEARANCES.filter((a) => a.kind === 'theme');

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-ink mb-1">{t('settings.title')}</h1>
        <p className="text-sm text-ink-light">{t('settings.subtitle')}</p>
      </div>

      {/* Mode & language */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-xl border border-border-subtle bg-card p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-ink">
            {theme === 'dark' ? <Moon size={18} className="text-clay-soft" /> : <Sun size={18} className="text-clay-soft" />}
            <span className="font-medium">{t('settings.mode')}</span>
          </div>
          <div className="flex p-1 rounded-lg bg-ink/5">
            {(['light', 'dark'] as const).map((m) => (
              <button
                key={m}
                onClick={() => theme !== m && toggleTheme()}
                aria-pressed={theme === m}
                className={`px-3 py-1 rounded-md text-sm ${theme === m ? 'bg-card text-ink shadow-sm' : 'text-ink-light'}`}
              >
                {t(`settings.${m}`)}
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-border-subtle bg-card p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-ink">
            <Languages size={18} className="text-clay-soft" />
            <span className="font-medium">{t('settings.language')}</span>
          </div>
          <button onClick={toggleLanguage} className="px-3 py-1.5 rounded-lg bg-ink/5 text-sm text-ink hover:bg-ink/10">
            {language === 'ar' ? 'English' : 'العربية'}
          </button>
        </div>
      </section>

      {/* Colours */}
      <section className="space-y-3">
        <div>
          <h2 className="text-xl font-semibold text-ink flex items-center gap-2"><Palette size={18} className="text-clay-soft" /> {t('settings.colors')}</h2>
          <p className="text-sm text-ink-light">{t('settings.colorsHint')}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {palettes.map((a) => {
            const active = appearanceId === a.id;
            return (
              <button
                key={a.id}
                onClick={() => choose(a)}
                aria-pressed={active}
                className={`relative rounded-xl overflow-hidden border-2 text-start transition-transform hover:-translate-y-0.5 ${active ? 'border-clay-soft' : 'border-transparent'}`}
              >
                <div className="h-16 flex items-end p-2" style={{ backgroundColor: a.swatches[0] }}>
                  <span className="text-sm font-bold font-amiri" style={{ color: a.swatches[1] }}>{t(`settings.names.${a.id}.dark`)}</span>
                </div>
                <div className="h-16 flex items-end p-2" style={{ backgroundColor: a.swatches[1] }}>
                  <span className="text-sm font-bold font-amiri" style={{ color: a.swatches[0] }}>{t(`settings.names.${a.id}.light`)}</span>
                </div>
                <div className="absolute top-1.5 end-1.5 px-1.5 py-0.5 rounded bg-black/30 text-[9px] text-white font-mono" dir="ltr">{a.swatches[0]}</div>
                {active && (
                  <span className="absolute bottom-1.5 end-1.5 w-6 h-6 rounded-full bg-clay-soft text-white flex items-center justify-center shadow">
                    <Check size={14} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Themes */}
      <section className="space-y-3">
        <div>
          <h2 className="text-xl font-semibold text-ink flex items-center gap-2"><Sparkles size={18} className="text-clay-soft" /> {t('settings.themes')}</h2>
          <p className="text-sm text-ink-light">{t('settings.themesHint')}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {themes.map((a) => {
            const active = appearanceId === a.id;
            return (
              <button
                key={a.id}
                onClick={() => choose(a)}
                aria-pressed={active}
                className={`rounded-xl border-2 bg-card p-2.5 text-start space-y-2 transition-transform hover:-translate-y-0.5 ${active ? 'border-clay-soft' : 'border-border-subtle'}`}
              >
                <ThemePreview a={a} mode={a.preferredMode ?? theme} />
                <div className="flex items-start justify-between gap-2 px-1">
                  <div>
                    <div className="font-semibold text-ink">{t(`settings.names.${a.id}.name`)}</div>
                    <div className="text-xs text-ink-light">{t(`settings.names.${a.id}.desc`)}</div>
                  </div>
                  {active && (
                    <span className="shrink-0 w-6 h-6 rounded-full bg-clay-soft text-white flex items-center justify-center">
                      <Check size={14} />
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Notifications */}
      <section className="rounded-xl border border-border-subtle bg-card p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-ink">
          <Bell size={18} className="text-clay-soft" />
          <div>
            <div className="font-medium">{t('settings.notifications')}</div>
            <div className="text-xs text-ink-light">{t(`settings.notificationState.${permission}`)}</div>
          </div>
        </div>
        {permission === 'default' && (
          <button onClick={async () => setPermission(await requestNotificationPermission())} className="px-3 py-1.5 rounded-lg bg-clay-soft text-white text-sm">
            {t('focus.enableNotifications')}
          </button>
        )}
      </section>
    </div>
  );
}
