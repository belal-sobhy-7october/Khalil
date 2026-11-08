import { useState } from 'react';
import { CheckCircle, ChevronDown, Trash2 } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';

/**
 * The finished tasks the settings hide: still saved (and counted in Analytics),
 * listed here on demand. Unticking one brings it back to the list.
 */
export default function HiddenDone({ tasks, onToggle, onRemove }: {
  tasks: Array<{ id: string; text: string }>;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  if (tasks.length === 0) return null;
  return (
    <div className="px-3 pt-2 pb-2">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex items-center gap-1.5 min-h-8 text-xs text-ink-light hover:text-ink"
      >
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
        {t('todo.finished').replace('{n}', String(tasks.length))}
      </button>
      {open && (
        <ul className="space-y-0.5">
          {tasks.map((task) => (
            <li key={task.id} className="group flex items-center gap-3 py-1 opacity-70">
              <button onClick={() => onToggle(task.id)} className="shrink-0 p-1 -m-1" aria-label={`${t('a11y.markIncomplete')}: ${task.text}`}>
                <CheckCircle size={18} className="text-sage-soft" />
              </button>
              <span className="flex-1 min-w-0 text-sm line-through text-ink-lighter break-words" dir="auto">{task.text}</span>
              <button
                onClick={() => onRemove(task.id)}
                className="p-1.5 rounded-md text-ink-lighter hover:text-red-500 opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100"
                aria-label={`${t('a11y.deleteTask')}: ${task.text}`}
              >
                <Trash2 size={13} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
