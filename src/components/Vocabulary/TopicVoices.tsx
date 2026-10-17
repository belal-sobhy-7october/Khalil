import { useState } from 'react';
import { Download, Loader2, Trash2, Volume2, WifiOff, TriangleAlert } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { useOnline } from '../../lib/offline';
import { spokenForm, useSpeechTrouble } from '../../lib/pronunciation';
import { recordedCount, removeTopicVoices, saveTopicVoices, useSavedVoices } from '../../lib/savedVoices';
import type { TopicPack } from '../../data/topicPacks';

/** Above a topic's words: save their native-speaker voice on the device for offline study. */
export default function TopicVoices({ pack }: { pack: TopicPack }) {
  const { t } = useTranslation();
  const online = useOnline();
  const trouble = useSpeechTrouble();
  const saved = useSavedVoices()[pack.id];
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [failed, setFailed] = useState(false);

  const save = async () => {
    setFailed(false);
    setProgress({ done: 0, total: pack.items.length });
    const result = await saveTopicVoices(
      pack.id,
      pack.items.map((i) => spokenForm(i.word)),
      (done, total) => setProgress({ done, total })
    );
    setProgress(null);
    setFailed(!result);
  };

  let status;
  if (progress) {
    status = (
      <p className="flex items-center gap-1.5 text-ink-light">
        <Loader2 size={14} className="animate-spin shrink-0" />
        {t('vocabulary.library.voice.saving').replace('{done}', String(progress.done)).replace('{total}', String(progress.total))}
      </p>
    );
  } else if (saved) {
    status = (
      <div className="flex flex-wrap items-center gap-2">
        <p className="flex-1 min-w-[12rem] flex items-start gap-1.5 text-ink">
          <Volume2 size={14} className="shrink-0 mt-0.5 text-green-600 dark:text-green-400" />
          {t('vocabulary.library.voice.saved')
            .replace('{recorded}', String(recordedCount(saved)))
            .replace('{total}', String(saved.total))}
        </p>
        <button
          onClick={() => void removeTopicVoices(pack.id)}
          className="flex items-center gap-1 px-2 py-1 rounded-lg text-ink-light hover:bg-ink/5"
        >
          <Trash2 size={13} /> {t('vocabulary.library.voice.remove')}
        </button>
      </div>
    );
  } else if (online) {
    status = (
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => void save()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border-subtle text-ink hover:bg-ink/5"
        >
          <Download size={14} className="text-clay-soft" /> {t('vocabulary.library.voice.save')}
        </button>
        <span className="text-ink-light">{t('vocabulary.library.voice.saveHint')}</span>
      </div>
    );
  } else {
    status = (
      <p className="flex items-start gap-1.5 text-ink-light">
        <WifiOff size={14} className="shrink-0 mt-0.5" />
        {t('vocabulary.library.voice.offline')}
      </p>
    );
  }

  return (
    <div className="mb-3 space-y-2 text-xs" dir="auto">
      {status}
      {failed && !progress && <p className="text-red-500">{t('vocabulary.library.voice.failed')}</p>}
      {trouble && (
        <p className="flex items-start gap-1.5 text-amber-700 dark:text-amber-400">
          <TriangleAlert size={14} className="shrink-0 mt-0.5" />
          {t('vocabulary.library.voice.trouble')}
        </p>
      )}
    </div>
  );
}
