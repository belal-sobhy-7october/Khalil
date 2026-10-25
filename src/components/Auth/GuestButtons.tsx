import { LogIn, UserPlus } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { useGuest } from '../../lib/guest';

/**
 * In the header while using Khalil as a guest, in place of the account menu:
 * create an account, or sign in. A narrow phone shows one button; its dialog
 * offers the other.
 */
export default function GuestButtons() {
  const { t } = useTranslation();
  const openDialog = useGuest((g) => g.openDialog);
  return (
    <div className="flex items-center gap-1" data-guide="account">
      <button
        onClick={() => openDialog('signin')}
        className="hidden min-[480px]:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-ink-light hover:text-ink border border-transparent hover:border-border-subtle transition-all"
      >
        <LogIn size={15} />
        <span>{t('auth.signIn')}</span>
      </button>
      <button
        onClick={() => openDialog('signup')}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-clay-soft text-white hover:bg-clay-soft-dark transition-colors whitespace-nowrap"
      >
        <UserPlus size={15} className="hidden min-[360px]:block" />
        <span>{t('auth.signUp')}</span>
      </button>
    </div>
  );
}
