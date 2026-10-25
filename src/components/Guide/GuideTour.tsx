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
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
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

  // The card sits at the bottom, or at the top when what it points at is down there.
  const cardOnTop = !!box && box.top + box.height > window.innerHeight - 280;

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
            boxShadow: '0 0 0 9999px rgb(0 0 0 / 0.45)',
          }}
        />
      ) : (
        <div aria-hidden="true" className="fixed inset-0 z-[91] bg-black/45 pointer-events-none" />
      )}

      <div
        {...dialog.props}
        className={`fixed z-[95] inset-x-4 sm:inset-x-auto sm:end-6 sm:w-[26rem] ${cardOnTop ? 'top-20' : 'bottom-4 sm:bottom-6'}`}
        data-testid="guide-tour"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="rounded-2xl border border-border-subtle bg-card shadow-2xl p-4 sm:p-5"
          >
            <div className="flex items-start gap-3 sm:gap-4">
              <Mascot pose={step.pose} size={72} className="shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2">
                  <p className="flex-1 min-w-0 pt-0.5 text-[11px] text-clay-soft font-medium">
                    {t('guide.progress')
                      .replace('{part}', String(partIndex + 1))
                      .replace('{parts}', String(parts.length))
                      .replace('{name}', t(`guide.parts.${step.part}`))}
                  </p>
                  <button onClick={finish} className="-mt-1 -me-1 shrink-0 px-2 py-1 text-xs text-ink-light hover:text-ink rounded-lg hover:bg-ink/5">
                    {t('guide.skipAll')}
                  </button>
                </div>
                <h2 id={dialog.titleId} className="mt-0.5 text-base font-bold text-ink">
                  {t(`guide.steps.${step.id}.title`)}
                </h2>
                <p className="mt-1 text-sm text-ink-light leading-relaxed">{t(`guide.steps.${step.id}.text`)}</p>
              </div>
            </div>

            {inPart.length > 1 && (
              <div className="mt-3 flex justify-center gap-1.5" aria-hidden="true">
                {inPart.map((s) => (
                  <span key={s.id} className={`h-1.5 rounded-full transition-all ${s.id === step.id ? 'w-5 bg-clay-soft' : 'w-1.5 bg-ink/15'}`} />
                ))}
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
              {!last && skipTo > 0 && (
                <button onClick={skipPart} className="me-auto px-3 py-1.5 text-xs text-ink-light hover:text-ink rounded-lg border border-border-subtle hover:bg-ink/5">
                  {t('guide.skipPart')}
                </button>
              )}
              {index > 0 && (
                <button onClick={back} className="px-3 py-1.5 text-sm text-ink rounded-lg bg-ink/5 hover:bg-ink/10">
                  {t('guide.back')}
                </button>
              )}
              <button onClick={next} autoFocus className="px-4 py-1.5 text-sm font-medium text-white rounded-lg bg-clay-soft hover:bg-clay-soft-dark">
                {t(last ? 'guide.done' : 'guide.next')}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
