import { useState } from 'react';
import { Volume2, Snail } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { speakBrowser, speakWord, getPronunciationPrefs } from '../../lib/pronunciation';
import { ACCENT_FEATURES, CONSONANTS, VOWELS, type SoundEntry } from '../../data/englishStudy';

function SoundGrid({ title, sounds }: { title: string; sounds: SoundEntry[] }) {
  const accent = getPronunciationPrefs().accent;
  return (
    <div>
      <h4 className="text-sm font-semibold text-ink mb-2">{title}</h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2" dir="ltr">
        {sounds.map((s) => (
          <div key={s.ipa} className="p-2.5 rounded-lg border border-border-subtle" title={s.tip}>
            <div className="text-lg font-semibold text-clay-soft">/{s.ipa}/</div>
            <div className="flex flex-wrap gap-1 mt-1">
              {s.examples.map((w) => (
                <button
                  key={w}
                  onClick={() => void speakWord(w, accent)}
                  className="px-1.5 py-0.5 rounded bg-ink/5 text-xs text-ink hover:bg-clay-soft/15"
                >
                  {w}
                </button>
              ))}
            </div>
            {s.tip && <p className="text-[10px] text-ink-lighter mt-1 leading-snug">{s.tip}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

/** The Pronunciation & Accent section's built-in reference: American accent features and the sounds chart. */
export default function PronunciationReference() {
  const { t } = useTranslation();
  const accent = getPronunciationPrefs().accent;
  const [panel, setPanel] = useState<'sounds' | 'features'>('features');

  return (
    <div className="rounded-xl border border-border-subtle p-4 space-y-4">
      <div className="flex gap-2">
        {(['features', 'sounds'] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPanel(p)}
            className={`px-3 py-1.5 rounded-lg text-sm ${panel === p ? 'bg-clay-soft text-white' : 'bg-ink/5 text-ink hover:bg-ink/10'}`}
          >
            {t(`english.accent.panel.${p}`)}
          </button>
        ))}
      </div>

      {panel === 'features' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3" dir="ltr">
          {ACCENT_FEATURES.map((f) => (
            <div key={f.id} className="p-3 rounded-lg border border-border-subtle space-y-2">
              <div className="font-semibold text-ink">{f.title}</div>
              <p className="text-xs text-ink-light">{f.explanation}</p>
              <div className="flex flex-wrap gap-1.5">
                {f.examples.map((ex) => (
                  <span key={ex} className="inline-flex items-center rounded-lg bg-ink/5 text-xs text-ink overflow-hidden">
                    <button onClick={() => speakBrowser(ex.toLowerCase(), accent, 0.95)} className="flex items-center gap-1 px-2 py-1 hover:bg-clay-soft/15">
                      <Volume2 size={11} /> {ex}
                    </button>
                    <button onClick={() => speakBrowser(ex.toLowerCase(), accent, 0.6)} className="px-1.5 py-1 border-s border-border-subtle hover:bg-clay-soft/15" aria-label={`${t('vocabulary.practice.playSlow')}: ${ex}`}>
                      <Snail size={11} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-5">
          <SoundGrid title={t('english.accent.vowels')} sounds={VOWELS} />
          <SoundGrid title={t('english.accent.consonants')} sounds={CONSONANTS} />
        </div>
      )}
    </div>
  );
}
