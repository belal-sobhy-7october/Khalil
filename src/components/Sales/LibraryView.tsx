import { BookOpen, ExternalLink, GraduationCap, Headphones, MonitorPlay } from 'lucide-react';
import { SALES_SOURCES } from '../../data/sales/sources';
import type { SalesSource } from '../../data/sales/types';
import { ArabicNote, Card, NeedsInternet, Pill } from './ui';

const KIND: Record<SalesSource['kind'], { label: string; icon: typeof BookOpen }> = {
  podcast: { label: 'بودكاست', icon: Headphones },
  youtube: { label: 'يوتيوب', icon: MonitorPlay },
  course: { label: 'كورس مجاني', icon: GraduationCap },
  book: { label: 'كتاب', icon: BookOpen },
};

function SourceCard({ s }: { s: SalesSource }) {
  const { label, icon: Icon } = KIND[s.kind];
  return (
    <a href={s.url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 rounded-2xl border border-border-subtle bg-card p-3 hover:border-clay-soft transition-colors">
      <span className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center bg-clay-soft/10 text-clay-soft">
        <Icon size={17} />
      </span>
      <span className="flex-1 min-w-0 space-y-0.5">
        <span className="flex flex-wrap items-center gap-1.5">
          <span className="text-sm font-semibold text-ink" dir="auto">
            {s.name}
          </span>
          {s.start && <Pill tone="accent">ابدأ بيه</Pill>}
        </span>
        <span className="block text-xs text-ink-light" dir="auto">
          {label} · {s.by}
        </span>
        <span className="block text-sm text-ink">{s.whyAr}</span>
      </span>
      <ExternalLink size={14} className="shrink-0 mt-1 text-ink-light" />
    </a>
  );
}

/** Free podcasts, channels, courses and books: Arabic first, then English. */
export default function LibraryView() {
  const groups = [
    { title: 'بالعربي', items: SALES_SOURCES.filter((s) => s.lang === 'ar') },
    { title: 'بالإنجليزي (للمستوى 3 وبعده)', items: SALES_SOURCES.filter((s) => s.lang === 'en') },
  ];
  return (
    <div className="space-y-4">
      <Card className="space-y-1">
        <ArabicNote>
          الخطة اليومية فيها كل اللي محتاجه. المكتبة دي للأيام اللي عندك فيها وقت زيادة، أو وانت في المواصلات: بودكاست بدل الأغاني. ابدأ باللي عليهم «ابدأ بيه».
        </ArabicNote>
        <NeedsInternet />
      </Card>
      {groups.map((g) => (
        <section key={g.title} className="space-y-2">
          <h3 className="font-semibold text-ink">{g.title}</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {g.items.map((s) => (
              <SourceCard key={s.id} s={s} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
