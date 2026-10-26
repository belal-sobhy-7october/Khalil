import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, X } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { onDataWrite } from '../../lib/writes';
import { useGuest } from '../../lib/guest';
import { useGuide } from '../../lib/guide';
import Mascot from '../Guide/Mascot';

const LATER_KEY = 'khalil-guest-save-later';
/** A save this soon after a tap or a key press is the guest's own (not something the app saved by itself). */
const GESTURE_MS = 4000;

function saidLater(): boolean {
  try {
    return sessionStorage.getItem(LATER_KEY) === '1';
  } catch {
    return false;
  }
}

/**
 * For a guest account: after the guest's first change, Khalil asks them to
 * create an account so it isn't kept in this browser only. "Later" waits for
 * the next visit.
 */
export function GuestSavePrompt() {
  const { t } = useTranslation();
  const openDialog = useGuest((g) => g.openDialog);
  const touring = useGuide((g) => g.active);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (saidLater()) return;
    let lastGesture = 0;
    let timer: number | undefined;
    const onGesture = () => {
      lastGesture = Date.now();
    };
    window.addEventListener('pointerdown', onGesture, true);
    window.addEventListener('keydown', onGesture, true);
    const stop = onDataWrite(() => {
      if (Date.now() - lastGesture > GESTURE_MS || timer !== undefined) return;
      // A moment after the change, so it doesn't jump in front of what was just done.
      timer = window.setTimeout(() => setShow(true), 1200);
    });
    return () => {
      stop();
      window.clearTimeout(timer);
      window.removeEventListener('pointerdown', onGesture, true);
      window.removeEventListener('keydown', onGesture, true);
    };
  }, []);

  const later = () => {
    setShow(false);
    try {
      sessionStorage.setItem(LATER_KEY, '1');
    } catch {
      // asked again on the next change
    }
  };

  return (
    <AnimatePresence>
      {show && !touring && (
        <motion.div
          role="status"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          className="fixed bottom-24 inset-x-4 sm:inset-x-auto sm:end-6 sm:w-96 z-40 rounded-2xl border border-border-subtle bg-card shadow-2xl p-4"
          data-testid="guest-save-prompt"
        >
          <button onClick={later} aria-label={t('common.close')} className="absolute top-2 end-2 w-7 h-7 rounded-full text-ink-light hover:text-ink hover:bg-ink/5 flex items-center justify-center">
            <X size={14} />
          </button>
          <div className="flex gap-3">
            <Mascot pose="save" size={96} />
            <div className="flex-1 min-w-0 pe-5">
              <p className="text-sm font-semibold text-ink">{t('auth.save.title')}</p>
              <p className="mt-1 text-xs text-ink-light leading-relaxed">{t('auth.save.text')}</p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 justify-end">
            <button onClick={later} className="px-3 py-1.5 rounded-lg text-sm text-ink-light hover:text-ink hover:bg-ink/5">
              {t('auth.save.later')}
            </button>
            <button
              onClick={() => {
                setShow(false);
                openDialog('signup');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-clay-soft text-white hover:bg-clay-soft-dark"
            >
              <UserPlus size={15} />
              {t('auth.signUp')}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Browsing with no account at all: says that nothing is saved yet. */
export function GuestBrowseBanner() {
  const { t } = useTranslation();
  const openDialog = useGuest((g) => g.openDialog);
  return (
    <div role="status" className="mb-4 flex flex-wrap items-center gap-3 p-3 rounded-xl border border-clay-soft/40 bg-clay-soft/5" data-testid="guest-browse-banner">
      <Mascot pose="avatar" size={32} className="rounded-full" />
      <p className="flex-1 min-w-[12rem] text-sm text-ink">{t('auth.browse.banner')}</p>
      <div className="flex gap-2">
        <button onClick={() => openDialog('signin')} className="px-3 py-1.5 rounded-lg text-sm text-ink-light hover:text-ink hover:bg-ink/5">
          {t('auth.signIn')}
        </button>
        <button onClick={() => openDialog('signup')} className="px-3 py-1.5 rounded-lg text-sm font-medium bg-clay-soft text-white hover:bg-clay-soft-dark">
          {t('auth.signUp')}
        </button>
      </div>
    </div>
  );
}
