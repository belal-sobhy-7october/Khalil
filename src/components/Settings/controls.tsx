/** Small building blocks shared by the Settings panels. */

export function SettingCard({ title, hint, children, icon }: { title: string; hint?: string; children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border-subtle bg-card p-4 space-y-3">
      <div>
        <h2 className="font-semibold text-ink flex items-center gap-2">
          {icon}
          {title}
        </h2>
        {hint && <p className="text-xs text-ink-light mt-0.5">{hint}</p>}
      </div>
      {children}
    </section>
  );
}

/** One choice out of a few, as a row of buttons. */
export function Segmented<T extends string>({ value, options, onChange, label }: {
  value: T;
  options: Array<{ value: T; label: string }>;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex flex-wrap p-1 rounded-lg bg-ink/5 gap-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={`px-3 py-1 rounded-md text-sm ${value === o.value ? 'bg-card text-ink shadow-sm' : 'text-ink-light hover:text-ink'}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** An on/off switch with its label (and an optional line under it). */
export function Toggle({ checked, onChange, label, hint }: { checked: boolean; onChange: (v: boolean) => void; label: string; hint?: string }) {
  return (
    <label className="flex items-start justify-between gap-3 cursor-pointer">
      <span className="min-w-0">
        <span className="block text-sm text-ink">{label}</span>
        {hint && <span className="block text-xs text-ink-light">{hint}</span>}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative shrink-0 w-10 h-6 rounded-full transition-colors ${checked ? 'bg-clay-soft' : 'bg-ink/15'}`}
      >
        <span className={`absolute top-0.5 start-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-4 rtl:-translate-x-4' : ''}`} />
      </button>
    </label>
  );
}
