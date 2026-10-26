import { useState } from 'react';
import { LogIn, X } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { useAppStore } from '../../store/appStore';
import { useDialog } from '../../lib/useDialog';
import { isGuestSession, signInWithGoogle, signUpWithGoogle, useGuest, type AuthDialogMode } from '../../lib/guest';
import Mascot from '../Guide/Mascot';

/**
 * Create an account or sign in, for a guest. Both go through Google; creating
 * an account keeps what the guest did (lib/guest.ts), signing in opens an
 * account made before.
 */
export default function AuthDialog() {
  const mode = useGuest((g) => g.dialog);
  if (!mode) return null;
  return <AuthDialogBody key={mode} mode={mode} />;
}

function AuthDialogBody({ mode }: { mode: AuthDialogMode }) {
  const { t } = useTranslation();
  const guest = useAppStore((s) => isGuestSession(s.session));
  const closeDialog = useGuest((g) => g.closeDialog);
  const openDialog = useGuest((g) => g.openDialog);
  const dialog = useDialog(closeDialog);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  const signUp = mode === 'signup';
  const go = async () => {
    setBusy(true);
    setFailed(false);
    const ok = await (signUp ? signUpWithGoogle() : signInWithGoogle());
    // On success the page leaves for Google.
    if (!ok) {
      setBusy(false);
      setFailed(true);
    }
  };

  const title = t(mode === 'signup' ? 'auth.dialog.signupTitle' : mode === 'signin' ? 'auth.dialog.signinTitle' : 'auth.dialog.existsTitle');
  const text =
    mode === 'signup' ? t(guest ? 'auth.dialog.signupGuest' : 'auth.dialog.signupBrowse') : t(mode === 'signin' ? 'auth.dialog.signinText' : 'auth.dialog.existsText');

  return (
    <div className="fixed inset-0 bg-ink/50 flex items-center justify-center z-[110] p-4" onClick={closeDialog}>
      <div
        {...dialog.props}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-card border border-border-subtle rounded-2xl w-full max-w-sm max-h-[90svh] overflow-y-auto p-6 text-center shadow-2xl"
      >
        <button
          onClick={closeDialog}
          aria-label={t('common.close')}
          className="absolute top-3 end-3 w-8 h-8 rounded-full text-ink-light hover:text-ink hover:bg-ink/5 flex items-center justify-center"
        >
          <X size={16} />
        </button>
        <Mascot pose={mode === 'signup' ? 'save' : 'welcome'} size={150} className="mx-auto mb-3" />
        <h2 id={dialog.titleId} className="text-lg font-bold text-ink mb-2">{title}</h2>
        <p className="text-sm text-ink-light leading-relaxed">{text}</p>
        {mode === 'signin' && guest && <p className="mt-2 text-xs text-ink-light leading-relaxed">{t('auth.dialog.signinGuestWarning')}</p>}

        <button
          onClick={go}
          disabled={busy}
          className="mt-5 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-clay-soft text-white font-medium hover:bg-clay-soft-dark disabled:opacity-60 transition-colors"
        >
          {busy ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <LogIn size={17} />}
          {t('auth.continueGoogle')}
        </button>
        {failed && <p role="alert" className="mt-2 text-xs text-red-600 dark:text-red-400">{t('auth.dialog.failed')}</p>}

        {mode !== 'exists' && (
          <button onClick={() => openDialog(signUp ? 'signin' : 'signup')} className="mt-4 text-sm text-clay-soft hover:underline">
            {t(signUp ? 'auth.dialog.haveAccount' : 'auth.dialog.noAccount')}
          </button>
        )}
        <p className="mt-4 text-[11px] text-ink-lighter">{t('auth.privacyNotice')}</p>
      </div>
    </div>
  );
}
