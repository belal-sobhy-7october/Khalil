import { useState } from 'react';
import { LogIn } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import CalligraphyWatermark from '../Common/CalligraphyWatermark';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

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
              <h1 className="text-3xl font-bold font-amiri text-ink mb-1 leading-relaxed">خليل</h1>
              <p className="text-ink-light text-sm">رفيقك الشخصي</p>
            </div>
          </div>

          <div className="px-8 md:px-10 pb-8 text-center">
            <p className="text-ink-light mb-6 text-sm leading-relaxed">
              سجل الدخول بحساب Google للوصول إلى لوحة التحكم الخاصة بك
              <br />
              <span className="text-ink-lighter text-xs">
                بياناتك محفوظة بشكل آمن في السحابة
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
              <span>تسجيل الدخول بـ Google</span>
            </button>
          </div>

          <div className="px-8 pb-6 text-center">
            <p className="text-[10px] text-ink-lighter">
              بتسجيل الدخول، أنت توافق على استخدامنا للبيانات وفقًا لسياسة الخصوصية
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
