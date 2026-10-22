import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { EXTRA_WEEKS } from '../../data/sales/plan';
import type { SalesWeek } from '../../data/sales/types';
import { extraTasks } from '../../lib/sales/tasks';
import { ProgressBar } from '../English/CourseVisuals';
import { useSales } from './SalesContext';
import TaskCard from './TaskCard';
import { ArabicNote, Card, Pill } from './ui';

function Topic({ week }: { week: SalesWeek }) {
  const { tasks } = useSales();
  const [open, setOpen] = useState(false);
  const [openTask, setOpenTask] = useState<string | null>(null);
  const list = extraTasks(week);
  const done = list.filter((t) => tasks[t.id]).length;
  return (
    <Card className="space-y-3">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="w-full flex items-start gap-3 text-start">
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-bold text-ink">{week.title}</h3>
            <Pill tone={done === list.length ? 'good' : 'neutral'}>
              {done} / {list.length}
            </Pill>
          </div>
          <p className="text-sm text-ink-light">{week.goal}</p>
        </div>
        <ChevronDown size={18} className={`shrink-0 mt-1 text-ink-light transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <ProgressBar ratio={done / list.length} size="sm" label={week.title} />
      {open && (
        <div className="space-y-2.5">
          {list.map((t) => (
            <TaskCard key={t.id} task={t} lang="ar" done={!!tasks[t.id]} open={openTask === t.id} onToggleOpen={() => setOpenTask(openTask === t.id ? null : t.id)} />
          ))}
        </div>
      )}
    </Card>
  );
}

/** Extra, not part of the plan: selling electronics, for the first days in the job. */
export default function ExtraView() {
  return (
    <div className="space-y-3">
      <Card className="space-y-1">
        <p className="text-sm text-ink">
          <span className="font-semibold">إضافي، مش جزء من الخطة.</span> بيع الأجهزة الإلكترونية هتتعلمه بجد جوه الشركة: منتجاتها وعروضها وسياساتها. ده بس عشان أول يوم ميبقاش غريب عليك.
        </p>
        <ArabicNote>مفيش حاجة هنا داخلة في تقدم الخطة ولا في شروط المستويات. افتحه وقت ما تحتاجه، وتقدمك فيه بيتحفظ.</ArabicNote>
      </Card>
      {EXTRA_WEEKS.map((w) => (
        <Topic key={w.id} week={w} />
      ))}
    </div>
  );
}
