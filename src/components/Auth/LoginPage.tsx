import { useState } from 'react';
import { LogIn, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useTranslation } from '../../i18n/useTranslation';
import CalligraphyWatermark from '../Common/CalligraphyWatermark';
import { startGuest, useGuest } from '../../lib/guest';
import { ROUTES } from '../../seo/routes';

/**
 * The welcome page. Visitors open Khalil as guests (lib/guest.ts), so this is
 * what search engines see; a visitor taken for one can still try it as a guest.
 */
export default function LoginPage() {
  const { t, language } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [trying, setTrying] = useState(false);

  const tryAsGuest = async () => {
    setTrying(true);
    // A guest account opens the app by itself (App.tsx); without one, browse.
    if (!(await startGuest())) useGuest.setState({ browsing: true });
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin },
      });
      if (error) throw error;
    } catch (err) {
      console.error('Login error:', err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-card border border-border-subtle rounded-2xl overflow-hidden">
          <div className="p-8 md:p-10 text-center relative">
            <CalligraphyWatermark character="خ" opacity={0.04} />
            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-16 h-16 rounded-xl bg-clay-soft/10 flex items-center justify-center mx-auto mb-5"
              >
                <span className="text-3xl font-amiri text-clay-soft">خ</span>
              </motion.div>
              <h1 className="text-3xl font-bold font-amiri text-ink mb-1 leading-relaxed">{t('app.title')}</h1>
              <p className="text-ink-light text-sm">{t('app.subtitle')}</p>
              <p className="text-ink-light text-sm leading-relaxed mt-3">{t('auth.about')}</p>
            </div>
          </div>

          <div className="px-8 md:px-10 pb-8 text-center">
            <p className="text-ink-light mb-6 text-sm leading-relaxed">
              {t('auth.loginTitle')}
              <br />
              <span className="text-ink-lighter text-xs">
                {t('auth.loginSubtitle')}
              </span>
            </p>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-ink/5 border border-border-subtle rounded-xl text-ink font-medium hover:bg-ink/10 disabled:opacity-60 transition-all"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-clay-soft border-t-transparent rounded-full animate-spin" />
              ) : (
                <LogIn size={20} className="text-clay-soft" />
              )}
              <span>{t('auth.login')}</span>
            </button>

            <button
              onClick={tryAsGuest}
              disabled={trying}
              className="mt-3 w-full flex items-center justify-center gap-2 px-6 py-2 rounded-xl text-sm text-ink-light hover:text-ink hover:bg-ink/5 disabled:opacity-60 transition-all"
            >
              <Sparkles size={16} className="text-clay-soft" />
              <span>{t('auth.tryGuest')}</span>
            </button>
          </div>

          <div className="px-8 pb-6 text-center">
            <p className="text-[11px] text-ink-lighter">
              {t('auth.privacyNotice')}
            </p>
          </div>
        </div>

        {/* The public lessons (src/seo): real links, so search engines find them from here too. */}
        <nav aria-label={t('auth.freeLessons')} className="mt-5 text-center">
          <p className="text-xs text-ink-lighter mb-2">{t('auth.freeLessons')}</p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm">
            <a href={ROUTES.topics(language)} className="text-clay-soft hover:underline">{t('auth.freeTopics')}</a>
            <a href={ROUTES.callCenter(language)} className="text-clay-soft hover:underline">{t('auth.freeCallCenter')}</a>
            <a href={ROUTES.sales} className="text-clay-soft hover:underline">{t('auth.freeSales')}</a>
          </div>
        </nav>
      </motion.div>
    </div>
  );
}
