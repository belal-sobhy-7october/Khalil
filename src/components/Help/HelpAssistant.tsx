import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, ArrowLeft, Compass, ExternalLink, MessageCircle, Search, X } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { useDialog } from '../../lib/useDialog';
import { searchHelp } from '../../lib/helpSearch';
import { HELP_TOPICS, type HelpTopic } from '../../data/help';
import { whatsappLink } from '../../lib/contact';
import { guideAvailable, useGuide } from '../../lib/guide';
import { openSettingsTab } from '../Settings/settingsTabs';
import Mascot from '../Guide/Mascot';

function openPart(topic: HelpTopic) {
  if (!topic.open) return;
  if ('settings' in topic.open) openSettingsTab(topic.open.settings);
  else window.dispatchEvent(new CustomEvent('khalil:navigate', { detail: topic.open.section }));
}

/**
 * "Ask Khalil": a button with his face that opens short answers about using
 * Khalil, searched on the device (no AI, no key, works offline). An answer can
 * open the part it talks about; the tour and WhatsApp are at the bottom.
 */
export default function HelpAssistant() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label={t('help.button')}
          title={t('help.button')}
          data-guide="help"
          className="fixed bottom-[5.25rem] end-7 z-30 w-10 h-10 rounded-full shadow-lg ring-2 ring-card hover:scale-105 transition-transform"
        >
          <Mascot pose="avatar" size={40} />
        </button>
      )}
      {open && <HelpPanel onClose={() => setOpen(false)} />}
    </>
  );
}

function HelpPanel({ onClose }: { onClose: () => void }) {
  const { t, language, isRTL } = useTranslation();
  const dialog = useDialog(onClose);
  const startGuide = useGuide((g) => g.start);
  const [query, setQuery] = useState('');
  const [chosen, setChosen] = useState<HelpTopic | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const results = useMemo(() => searchHelp(query), [query]);
  const lang = language === 'ar' ? 'ar' : 'en';
  const Back = isRTL ? ArrowRight : ArrowLeft;

  useEffect(() => {
    if (!chosen) input.current?.focus();
  }, [chosen]);

  return (
    <div
      {...dialog.props}
      className="fixed z-[60] inset-x-3 bottom-3 sm:inset-x-auto sm:end-6 sm:bottom-6 sm:w-[24rem] max-h-[80svh] flex flex-col rounded-2xl border border-border-subtle bg-card shadow-2xl overflow-hidden"
      data-testid="help-panel"
    >
      <div className="flex items-center gap-3 p-4 border-b border-border-subtle">
        <Mascot pose="avatar" size={40} />
        <div className="flex-1 min-w-0">
          <h2 id={dialog.titleId} className="text-base font-bold text-ink">{t('help.title')}</h2>
          <p className="text-xs text-ink-light">{t('help.subtitle')}</p>
        </div>
        <button onClick={onClose} aria-label={t('common.close')} className="w-8 h-8 rounded-full text-ink-light hover:text-ink hover:bg-ink/5 flex items-center justify-center">
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {chosen ? (
          <div>
            <button onClick={() => setChosen(null)} className="mb-3 flex items-center gap-1 text-xs text-ink-light hover:text-ink">
              <Back size={13} /> {t('common.back')}
            </button>
            <div className="flex gap-3">
              <Mascot pose="explain" size={96} className="hidden min-[380px]:block" />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-ink">{chosen.q[lang]}</h3>
                <p className="mt-2 text-sm text-ink-light leading-relaxed">{chosen.a[lang]}</p>
              </div>
            </div>
            {chosen.open && (
              <button
                onClick={() => {
                  openPart(chosen);
                  onClose();
                }}
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-clay-soft text-white text-sm font-medium hover:bg-clay-soft-dark"
              >
                <ExternalLink size={15} /> {t('help.open')}
              </button>
            )}
          </div>
        ) : (
          <>
            <label className="relative block">
              <Search size={15} className="absolute top-1/2 -translate-y-1/2 start-3 text-ink-lighter pointer-events-none" />
              <input
                ref={input}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('help.placeholder')}
                aria-label={t('help.placeholder')}
                className="w-full ps-9 pe-3 py-2 rounded-xl bg-ink/5 border border-border-subtle text-base sm:text-sm text-ink placeholder-ink-lighter focus:outline-none focus:ring-2 focus:ring-clay-soft/30"
              />
            </label>
            <p className="mt-4 mb-2 text-xs text-ink-lighter">{query.trim() ? t('help.results') : t('help.popular')}</p>
            {results.length ? (
              <ul className="space-y-1.5">
                {results.map((topic) => (
                  <li key={topic.id}>
                    <button
                      onClick={() => setChosen(topic)}
                      className="w-full text-start px-3 py-2 rounded-xl bg-ink/[0.03] hover:bg-ink/[0.07] border border-border-subtle text-sm text-ink"
                    >
                      {topic.q[lang]}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-ink-light leading-relaxed">{t('help.none')}</p>
            )}
            {!query.trim() && (
              <details className="mt-4">
                <summary className="cursor-pointer text-xs text-clay-soft">{t('help.all')}</summary>
                <ul className="mt-2 space-y-1">
                  {HELP_TOPICS.filter((x) => !x.popular).map((topic) => (
                    <li key={topic.id}>
                      <button onClick={() => setChosen(topic)} className="w-full text-start px-3 py-1.5 rounded-lg hover:bg-ink/5 text-sm text-ink-light hover:text-ink">
                        {topic.q[lang]}
                      </button>
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </>
        )}
      </div>

      <div className="flex flex-wrap gap-2 p-3 border-t border-border-subtle">
        {guideAvailable() && (
          <button
            onClick={() => {
              onClose();
              startGuide();
            }}
            className="flex-1 min-w-[9rem] flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-ink/5 hover:bg-ink/10 text-xs text-ink"
          >
            <Compass size={14} /> {t('guide.replay')}
          </button>
        )}
        <a
          href={whatsappLink(t('contact.message'))}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 min-w-[9rem] flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-ink/5 hover:bg-ink/10 text-xs text-ink"
        >
          <MessageCircle size={14} /> {t('contact.button')}
        </a>
      </div>
    </div>
  );
}
