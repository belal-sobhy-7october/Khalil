import { lazy, Suspense, useState } from 'react';
import { Library, WifiOff } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { useOnline } from '../../lib/offline';

const TopicLibraryModal = lazy(() => import('../Vocabulary/TopicLibraryModal'));

/** Opens the Topic Library — it works with no internet. */
export function StudyTopicsButton({ className = '', subtle = false }: { className?: string; subtle?: boolean }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
          subtle ? 'text-ink-light hover:text-ink hover:bg-ink/5' : 'bg-clay-soft text-white hover:bg-clay-soft-dark'
        } ${className}`}
      >
        <Library size={16} />
        {t('offline.studyTopics')}
      </button>
      {open && (
        <Suspense fallback={null}>
          <TopicLibraryModal onClose={() => setOpen(false)} />
        </Suspense>
      )}
    </>
  );
}

/** Shown while there is no internet, with a shortcut to the topics. */
export default function OfflineBanner() {
  const { t } = useTranslation();
  const online = useOnline();
  if (online) return null;
  return (
    <div role="status" className="mb-4 flex flex-wrap items-center gap-3 p-3 rounded-xl border border-clay-soft/40 bg-clay-soft/5">
      <WifiOff size={18} className="text-clay-soft shrink-0" />
      <p className="flex-1 min-w-[12rem] text-sm text-ink">{t('offline.banner')}</p>
      <StudyTopicsButton />
    </div>
  );
}
