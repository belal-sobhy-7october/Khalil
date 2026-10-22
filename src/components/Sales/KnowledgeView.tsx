import { useState } from 'react';
import { ArrowRight, BookOpen, CheckCircle2, Circle, Lightbulb, Quote, Sparkles } from 'lucide-react';
import { KNOWLEDGE, getChapter } from '../../data/sales/knowledge';
import type { KnowledgeBook } from '../../data/sales/types';
import { ProgressBar } from '../English/CourseVisuals';
import { secondaryBtn, primaryBtn } from '../CallCenter/ui';
import { CheckQuestion } from './activities/LessonActivity';
import { useSales } from './SalesContext';
import { ArabicNote, Card, NoteBox, Pill } from './ui';

/** One chapter: the idea, the explanation, how to use it in life, a small try, the source and a check. */
export function ChapterReader({ id, onRead }: { id: string; onRead?: () => void }) {
  const { knowledge, markChapter } = useSales();
  const found = getChapter(id);
  if (!found) return null;
  const { chapter: c, book } = found;
  const read = !!knowledge[c.id];
  return (
    <div className="space-y-4">
      <div className="text-xs text-ink-light">{book.title}</div>
      <p className="text-base font-semibold text-ink leading-relaxed">{c.idea}</p>
      <div className="space-y-2.5">
        {c.sections.map((s) => (
          <div key={s.title} className="rounded-xl bg-ink/3 px-3 py-2.5">
            <div className="text-sm font-semibold text-ink">{s.title}</div>
            <p className="text-sm text-ink leading-relaxed">{s.text}</p>
          </div>
        ))}
      </div>
      {c.example && (
        <div className="flex items-start gap-2 rounded-xl border border-border-subtle p-3">
          <Quote size={15} className="shrink-0 mt-0.5 text-clay-soft" />
          <p className="text-sm text-ink leading-relaxed">{c.example}</p>
        </div>
      )}
      <div className="flex items-start gap-2 rounded-xl bg-sage-soft/8 border border-sage-soft/30 p-3">
        <Sparkles size={15} className="shrink-0 mt-0.5 text-sage-soft-dark" />
        <div>
          <div className="text-xs font-semibold text-sage-soft-dark">في حياتك وفي أي شغل</div>
          <p className="text-sm text-ink leading-relaxed">{c.inLife}</p>
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-ink-light">
          <Lightbulb size={13} /> جرّب النهارده
        </div>
        <p className="text-sm text-ink">{c.tryIt}</p>
        <NoteBox noteKey={`knowledge:${c.id}`} rows={2} lang="ar" />
      </div>
      <div className="space-y-3 rounded-xl border border-dashed border-border-subtle p-3">
        <div className="text-xs font-semibold text-ink-light">اتأكد إنك فهمت</div>
        {c.check.map((q) => (
          <CheckQuestion key={q.q} choice={q} />
        ))}
      </div>
      <p className="text-[11px] text-ink-light">
        <span className="font-semibold">المصدر: </span>
        {c.source}
      </p>
      <button
        type="button"
        onClick={() => {
          markChapter(c.id, !read);
          if (!read) onRead?.();
        }}
        aria-pressed={read}
        className={read ? secondaryBtn : primaryBtn}
      >
        {read ? <CheckCircle2 size={13} /> : <BookOpen size={13} />} {read ? 'قريته ✓' : 'خلصت الفصل'}
      </button>
    </div>
  );
}

function BookCard({ book, onOpen }: { book: KnowledgeBook; onOpen: (id: string) => void }) {
  const { knowledge } = useSales();
  const done = book.chapters.filter((c) => knowledge[c.id]).length;
  return (
    <Card className="space-y-3">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-bold text-ink">{book.title}</h3>
        <Pill tone={done === book.chapters.length ? 'good' : 'neutral'}>
          {done} / {book.chapters.length}
        </Pill>
      </div>
      <ArabicNote>{book.intro}</ArabicNote>
      <ProgressBar ratio={done / book.chapters.length} size="sm" label={book.title} />
      <ol className="space-y-1">
        {book.chapters.map((c, i) => (
          <li key={c.id}>
            <button type="button" onClick={() => onOpen(c.id)} className="w-full flex items-center gap-2 rounded-lg px-2 py-1.5 text-start text-sm hover:bg-ink/5">
              {knowledge[c.id] ? <CheckCircle2 size={15} className="shrink-0 text-sage-soft" /> : <Circle size={15} className="shrink-0 text-ink-lighter" />}
              <span className="text-ink-light tabular-nums">{i + 1}.</span>
              <span className="text-ink">{c.title}</span>
            </button>
          </li>
        ))}
      </ol>
    </Card>
  );
}

/** Four short books of real ideas, to read one chapter a day or any time. */
export default function KnowledgeView() {
  const [open, setOpen] = useState<string | null>(null);
  const found = open ? getChapter(open) : undefined;
  if (found) {
    return (
      <div className="space-y-3">
        <button type="button" onClick={() => setOpen(null)} className="inline-flex items-center gap-1 text-sm text-clay-soft hover:underline">
          <ArrowRight size={14} /> كل الكتب
        </button>
        <Card className="space-y-3">
          <h2 className="text-xl font-bold text-ink">{found.chapter.title}</h2>
          <ChapterReader id={found.chapter.id} />
        </Card>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      <ArabicNote>
        معرفة حقيقية مش حفظ: أفكار من كتب وأبحاث معروفة، متشرحة ببساطة، ومعاها إزاي تستخدمها في حياتك وفي أي شغل. كل يوم هتلاقي فصل واحد في «النهارده»، وتقدر تقرا أي فصل هنا وقت ما تحب.
      </ArabicNote>
      <div className="grid gap-3 lg:grid-cols-2">
        {KNOWLEDGE.map((b) => (
          <BookCard key={b.id} book={b} onOpen={setOpen} />
        ))}
      </div>
    </div>
  );
}
