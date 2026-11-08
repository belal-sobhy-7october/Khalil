/**
 * The button at the end of the call center and sales pages. Their sections in
 * the app are closed for now (src/lib/skillAccess.ts), so it opens Khalil
 * itself and promises nothing those sections hold.
 */
import type { Block, Lang } from '../render';

const COPY: Record<Lang, { title: string; text: string; label: string }> = {
  ar: {
    title: 'خليل: رفيقك اليومي، مجانًا',
    text: 'نظّم مهامك وعاداتك وورْدك، وتعلّم الإنجليزية كل يوم من مستواك ببطاقات مراجعة ذكية. ومسارات المهارات نبنيها الآن مع متخصصين. مجاني، وتجربه دون تسجيل.',
    label: 'افتح خليل',
  },
  en: {
    title: 'Khalil: your daily companion, free',
    text: 'Plan your tasks, habits and wird, and learn English every day from your level with smart flashcards. Skill paths are being built with experts. Free, and you can try it without signing up.',
    label: 'Open Khalil',
  },
};

export const openKhalil = (lang: Lang): Block => ({ kind: 'cta', ...COPY[lang], href: '/' });
