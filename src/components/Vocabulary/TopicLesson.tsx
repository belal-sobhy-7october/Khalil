import type { ReactNode } from 'react';
import { Flame, BookOpen, MessagesSquare, Mic, Sparkles } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import type { TopicPack } from '../../data/topicPacks';

function Section({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <section className="space-y-2">
      <h3 className="text-sm font-semibold text-ink flex items-center gap-1.5" dir="auto">
        <span className="text-clay-soft">{icon}</span>
        {title}
      </h3>
      {children}
    </section>
  );
}

/** Numbered questions. */
export function QuestionList({ questions }: { questions: string[] }) {
  return (
    <ol className="list-decimal ps-5 space-y-1 text-sm text-ink marker:text-ink-lighter">
      {questions.map((q) => (
        <li key={q}>{q}</li>
      ))}
    </ol>
  );
}

export function GrammarCard({ pack }: { pack: TopicPack }) {
  return (
    <div className="rounded-xl border border-border-subtle bg-ink/3 p-3 space-y-2">
      <div className="text-sm font-semibold text-ink">{pack.grammar.title}</div>
      <ul className="space-y-2">
        {pack.grammar.points.map((p) => (
          <li key={p.form} className="text-sm">
            <code className="text-xs px-1.5 py-0.5 rounded bg-clay-soft/10 text-clay-soft font-semibold">{p.form}</code>
            <span className="text-ink-light"> — {p.use}</span>
            <div className="text-ink italic mt-0.5">{p.example}</div>
          </li>
        ))}
      </ul>
      {pack.grammar.tip && <p className="text-xs text-ink-light border-t border-border-subtle pt-2">💡 {pack.grammar.tip}</p>}
    </div>
  );
}

export function SpeakingTask({ pack }: { pack: TopicPack }) {
  const { t } = useTranslation();
  return (
    <div className="rounded-xl border border-clay-soft/40 bg-clay-soft/5 p-3 space-y-1.5">
      <p className="text-xs text-ink-light" dir="auto">{t('vocabulary.library.lesson.taskHint')}</p>
      <p className="text-sm font-semibold text-ink">{pack.task.prompt}</p>
      <ul className="list-disc ps-5 text-sm text-ink space-y-0.5 marker:text-clay-soft">
        {pack.task.points.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
    </div>
  );
}

/**
 * A pack laid out as a lesson, in the course's order: warm-up, key words,
 * grammar, discussion, then the speaking task. `words` is the word list.
 */
export default function TopicLesson({ pack, words }: { pack: TopicPack; words: ReactNode }) {
  const { t } = useTranslation();
  return (
    <div className="space-y-6" dir="ltr">
      <p className="text-sm text-ink-light">{pack.description}</p>
      <Section icon={<Flame size={15} />} title={t('vocabulary.library.lesson.warmUp')}>
        <QuestionList questions={pack.warmUp} />
      </Section>
      <Section icon={<Sparkles size={15} />} title={t('vocabulary.library.lesson.words').replace('{count}', String(pack.items.length))}>
        {words}
      </Section>
      <Section icon={<BookOpen size={15} />} title={t('vocabulary.library.lesson.grammar')}>
        <GrammarCard pack={pack} />
      </Section>
      <Section icon={<MessagesSquare size={15} />} title={t('vocabulary.library.lesson.discussion')}>
        <QuestionList questions={pack.discussion} />
      </Section>
      <Section icon={<Mic size={15} />} title={t('vocabulary.library.lesson.task')}>
        <SpeakingTask pack={pack} />
      </Section>
    </div>
  );
}
