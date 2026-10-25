import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { VOICE_PROMPTS } from '../../data/callCenter';
import { voiceNoteFeedbackPrompt, copyText } from '../../lib/callCenter/prompts';
import { clockLength } from '../../lib/courseProgress';
import { useCallCenter } from './CallCenterContext';
import VoiceRecorder from './VoiceRecorder';
import { ArabicNote, Card, NaturalReaderButton, NeedsInternet, SpeakButton, primaryBtn } from './ui';

const CHECKLIST = [
  'A quiet room; no TV, no fan, no street noise',
  'Phone about 20 cm from your mouth, not touching it',
  'Smile on the first and the last sentence',
  'Start talking within a second: no silent start',
  '130–160 words a minute; slower for your name and numbers',
  'No pause longer than 2 seconds: take a breath instead of "uhh"',
  "Finish strong: thank them and say you're ready for the next step",
  'Listen to it once before you send it',
];

/**
 * Voice Studio: record the voice notes and read-alouds recruiters ask for,
 * check them like a recruiter would, and keep the best take to send.
 */
export default function VoiceStudioView() {
  const { voice } = useCallCenter();
  const [selected, setSelected] = useState(VOICE_PROMPTS[0].id);
  const [copied, setCopied] = useState(false);
  const prompt = VOICE_PROMPTS.find((v) => v.id === selected) ?? VOICE_PROMPTS[0];
  const history = voice.filter((v) => v.promptId === prompt.id).slice(-8).reverse();

  return (
    <div className="space-y-4">
      <Card className="space-y-2">
        <h3 className="font-semibold text-ink">Before you record: the recruiter's checklist</h3>
        <ArabicNote>الرسالة الصوتية أول مرشِّح، وغالبًا هي ما أسقطك من قبل. سجّل، واستمع، وصحّح، ثم سجّل مرة أخرى. أرسل أفضل تسجيل، لا أوله.</ArabicNote>
        <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm text-ink">
          {CHECKLIST.map((c) => (
            <li key={c} className="flex gap-2">
              <span className="text-sage-soft" aria-hidden="true">✓</span>
              {c}
            </li>
          ))}
        </ul>
      </Card>

      <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="What to record">
        {VOICE_PROMPTS.map((v) => (
          <button
            key={v.id}
            type="button"
            role="tab"
            aria-selected={v.id === prompt.id}
            onClick={() => setSelected(v.id)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs border transition-colors ${
              v.id === prompt.id ? 'border-clay-soft bg-clay-soft/10 text-clay-soft-dark font-medium' : 'border-border-subtle text-ink-light hover:text-ink'
            }`}
          >
            {v.title}
          </button>
        ))}
      </div>

      <Card className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-ink">{prompt.title}</h3>
          <p className="text-sm text-ink">{prompt.prompt}</p>
          <p className="text-xs text-ink-light mt-1">
            Length: {clockLength(prompt.seconds[0])}–{clockLength(prompt.seconds[1])}
          </p>
        </div>
        <ol className="list-decimal ps-5 text-sm text-ink-light space-y-0.5">
          {prompt.structure.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
        {prompt.sample && (
          <details>
            <summary className="cursor-pointer text-sm text-clay-soft">A model to shadow (change the details to yours)</summary>
            <div className="mt-2 space-y-2 rounded-xl bg-sage-soft/8 border border-sage-soft/30 p-3">
              <div className="flex items-start gap-1">
                <p className="flex-1 text-sm text-ink leading-relaxed">{prompt.sample}</p>
                <SpeakButton text={prompt.sample} />
              </div>
              <NaturalReaderButton text={prompt.sample} />
            </div>
          </details>
        )}
        <VoiceRecorder key={prompt.id} promptId={prompt.id} target={prompt.seconds} />
        <div className="rounded-xl bg-ink/3 p-3 space-y-2">
          <div className="text-sm font-medium text-ink">Get a recruiter's opinion (free)</div>
          <p className="text-xs text-ink-light">Download your take, open Gemini, upload the file and paste this prompt. It listens to your real voice and tells you what a recruiter would.</p>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={async () => {
                setCopied(await copyText(voiceNoteFeedbackPrompt(prompt)));
                window.open('https://gemini.google.com/', '_blank', 'noopener,noreferrer');
              }}
              className={primaryBtn}
            >
              <ExternalLink size={13} /> Copy prompt &amp; open Gemini
            </button>
            <NeedsInternet />
          </div>
          {copied && <p className="text-[11px] text-sage-soft-dark">Copied. Attach your downloaded take in Gemini, then paste.</p>}
        </div>
        {history.length > 0 && (
          <div>
            <div className="text-xs font-semibold text-ink mb-1">Your numbers (all devices)</div>
            <table className="text-xs text-ink-light tabular-nums">
              <tbody>
                {history.map((h) => (
                  <tr key={h.id}>
                    <td className="pe-4">{h.date}</td>
                    <td className="pe-4">{clockLength(h.seconds)}</td>
                    <td className="pe-4">{h.longPauses} long pauses</td>
                    <td>{h.wpm ? `${h.wpm} words/min` : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
