import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../i18n/useTranslation';
import { useAppStore } from '../../store/appStore';
import { useDialog } from '../../lib/useDialog';
import { useGuide } from '../../lib/guide';
import { isGuestSession, useGuest } from '../../lib/guest';
import { GUIDE_PARTS, nextPartStart, stepsFor } from './steps';
import Mascot from './Mascot';

interface Box {
  top: number;
  left: number;
  width: number;
  height: number;
}

const PAD = 6;

/** Where the step's target is on the screen, followed while the page scrolls or moves. */
function useTargetBox(selector: string | undefined, stepKey: string): Box | null {
  const [found, setFound] = useState<{ key: string; box: Box } | null>(null);
  useLayoutEffect(() => {
    if (!selector) return;
    let frame = 0;
    let scrolled = false;
    const started = Date.now();
    const follow = () => {
      // The first one shown (a part can be on the page twice, one for phones and one for wider screens).
      const el = [...document.querySelectorAll(selector)].find((e) => e.getBoundingClientRect().width > 0);
      const rect = el?.getBoundingClientRect();
      if (el && rect) {
        if (!scrolled) {
          scrolled = true;
          // Near the top, under the header, so the card at the bottom leaves it in view.
          const fixed = getComputedStyle(el).position === 'fixed' || !!el.closest('header');
          if (!fixed) window.scrollTo({ top: rect.top + window.scrollY - 76, behavior: 'smooth' });
        }
        setFound((prev) =>
          prev && prev.key === stepKey && prev.box.top === rect.top && prev.box.left === rect.left && prev.box.width === rect.width && prev.box.height === rect.height
            ? prev
            : { key: stepKey, box: { top: rect.top, left: rect.left, width: rect.width, height: rect.height } }
        );
      } else if (Date.now() - started > 4000) {
        // Not on the page (hidden in the settings, or still loading): the step just has no light.
        return;
      }
      frame = requestAnimationFrame(follow);
    };
    // A moment for the section to open first.
    const timer = window.setTimeout(() => (frame = requestAnimationFrame(follow)), 150);
    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(frame);
    };
  }, [selector, stepKey]);
  return selector && found?.key === stepKey ? found.box : null;
}

/**
 * Khalil's tour: a card with the character and one short step at a time,
 * lighting up what it talks about. "Skip this part" goes to the next part,
 * "Skip the tour" (or Escape) ends it.
 */
export default function GuideTour({ onNavigate }: { onNavigate: (section: string) => void }) {
  const { t } = useTranslation();
  const finish = useGuide((g) => g.finish);
  const browsing = useGuest((g) => g.browsing);
  const guest = useAppStore((s) => isGuestSession(s.session));
  const steps = useMemo(() => stepsFor(browsing ? 'browsing' : guest ? 'guest' : 'member'), [browsing, guest]);
  const [index, setIndex] = useState(0);
  const step = steps[Math.min(index, steps.length - 1)];
  const dialog = useDialog(finish);
  const box = useTargetBox(step.target, step.id);

  // Open the step's section (the tour starts from the page it's on, then moves only when a step needs another).
  useEffect(() => {
    if (step.section) onNavigate(step.section);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only when the step changes
  }, [step.id]);

  const parts = GUIDE_PARTS.filter((p) => steps.some((s) => s.part === p));
  const partIndex = parts.indexOf(step.part);
  const inPart = steps.filter((s) => s.part === step.part);
  const last = index >= steps.length - 1;
  const skipTo = nextPartStart(steps, index);

  const next = () => (last ? finish() : setIndex(index + 1));
  const back = () => setIndex(Math.max(0, index - 1));
  const skipPart = () => (skipTo < 0 ? finish() : setIndex(skipTo));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && e.target.closest('input, textarea, select')) return;
      if (e.key === 'Enter' && !(e.target instanceof HTMLButtonElement)) next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  // The card sits at the bottom, or at the top when what it points at is down there (the + button, the help).
  // (Other targets are scrolled up under the header.)
  const cardOnTop = !!step.low;
  const fill = (text: string) =>
    text.replace('{part}', String(partIndex + 1)).replace('{parts}', String(parts.length)).replace('{name}', t(`guide.parts.${step.part}`));

  return (
    <>
      {/* Keeps taps on the page while the tour is open; the light is drawn above it. */}
      <div className="fixed inset-0 z-[90]" aria-hidden="true" onClick={(e) => e.stopPropagation()} />
      {box ? (
        <div
          aria-hidden="true"
          className="fixed z-[91] rounded-xl ring-2 ring-clay-soft pointer-events-none transition-all duration-200"
          style={{
            top: box.top - PAD,
            left: box.left - PAD,
            width: box.width + PAD * 2,
            height: box.height + PAD * 2,
            boxShadow: '0 0 0 9999px rgb(0 0 0 / 0.55)',
          }}
        />
      ) : (
        <div aria-hidden="true" className="fixed inset-0 z-[91] bg-black/55 pointer-events-none" />
      )}

      {/* Khalil stands beside his card (wider screens) or on it (phones), bigger than it, like a game's guide. */}
      <div
        {...dialog.props}
        className={`fixed z-[95] inset-x-3 sm:inset-x-auto sm:end-8 sm:w-[42rem] sm:max-w-[calc(100vw-4rem)] ${
          cardOnTop ? 'top-16 sm:top-[9.5rem]' : 'bottom-3 sm:bottom-6'
        }`}
        data-testid="guide-tour"
      >
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={step.pose + step.id}
              aria-hidden="true"
              initial={{ opacity: 0, y: 40, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18 }}
              className={`absolute z-10 end-3 sm:end-auto sm:start-2 sm:bottom-0 sm:top-auto pointer-events-none ${
                cardOnTop ? 'top-[calc(100%+0.25rem)]' : 'bottom-[calc(100%-1.25rem)]'
              }`}
              style={{ filter: 'drop-shadow(0 12px 18px rgb(0 0 0 / 0.35))' }}
            >
              <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}>
                <Mascot pose={step.pose} size={210} className="sm:hidden max-h-[30svh]" />
                <Mascot pose={step.pose} size={390} className="hidden sm:block max-h-[58svh] max-w-[16.5rem]" />
              </motion.div>
            </motion.div>
          </AnimatePresence>

          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, delay: 0.08 }}
            className="relative rounded-3xl border-2 border-clay-soft/40 bg-card shadow-2xl p-5 sm:p-6 sm:ps-[17.5rem] sm:min-h-[16rem] flex flex-col"
          >
            {/* The speech bubble's tail, toward Khalil. */}
            <span aria-hidden="true" className="hidden sm:block absolute top-12 start-[16.9rem] w-4 h-4 rotate-45 bg-card border-s-2 border-b-2 border-clay-soft/40 rtl:border-s-0 rtl:border-e-2" />
            {/* On a phone Khalil's feet stand on this row's end. */}
            <div className={`flex items-start gap-2 ${cardOnTop ? '' : 'pe-20 sm:pe-0'}`}>
              <p className="flex-1 min-w-0 pt-1 text-xs sm:text-sm text-clay-soft font-semibold">
                <span className="sm:hidden">{fill(t('guide.progressShort'))}</span>
                <span className="hidden sm:inline">{fill(t('guide.progress'))}</span>
              </p>
              <button onClick={finish} className="-mt-1 -me-1 shrink-0 px-2.5 py-1.5 text-xs sm:text-sm text-ink-light hover:text-ink rounded-lg hover:bg-ink/5">
                {t('guide.skipAll')}
              </button>
            </div>
            <h2 id={dialog.titleId} className="mt-2 text-xl sm:text-2xl font-bold text-ink leading-snug">
              {t(`guide.steps.${step.id}.title`)}
            </h2>
            <p className="mt-2 text-base sm:text-lg text-ink-light leading-relaxed">{t(`guide.steps.${step.id}.text`)}</p>

            {inPart.length > 1 && (
              <div className="mt-4 flex justify-center gap-1.5" aria-hidden="true">
                {inPart.map((s) => (
                  <span key={s.id} className={`h-2 rounded-full transition-all ${s.id === step.id ? 'w-7 bg-clay-soft' : 'w-2 bg-ink/15'}`} />
                ))}
              </div>
            )}

            <div className="mt-auto pt-5 flex flex-wrap items-center justify-end gap-2">
              {!last && skipTo > 0 && (
                <button onClick={skipPart} className="me-auto px-3 py-2 text-xs sm:text-sm text-ink-light hover:text-ink rounded-xl border border-border-subtle hover:bg-ink/5">
                  {t('guide.skipPart')}
                </button>
              )}
              {index > 0 && (
                <button onClick={back} className="px-4 py-2 text-sm sm:text-base text-ink rounded-xl bg-ink/5 hover:bg-ink/10">
                  {t('guide.back')}
                </button>
              )}
              <button onClick={next} autoFocus className="px-6 py-2 text-sm sm:text-base font-semibold text-white rounded-xl bg-clay-soft hover:bg-clay-soft-dark shadow-md">
                {t(last ? 'guide.done' : 'guide.next')}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
