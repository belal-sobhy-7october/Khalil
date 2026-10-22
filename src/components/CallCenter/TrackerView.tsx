import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { COMPANIES, DEBRIEF, HIRING_STAGES, SALARY_GUIDE, TARGETS, WHERE_TO_APPLY, type StageId } from '../../data/callCenter/resources';
import { newId, type Application, type ApplicationStatus } from '../../lib/callCenter/progress';
import { getToday } from '../../store/dateHelpers';
import { useCallCenter } from './CallCenterContext';
import { ArabicNote, Card, Pill, primaryBtn, secondaryBtn } from './ui';

const STATUS: Record<ApplicationStatus, { label: string; tone: 'neutral' | 'good' | 'warn' | 'accent' }> = {
  waiting: { label: 'Waiting', tone: 'neutral' },
  rejected: { label: 'Rejected', tone: 'warn' },
  offer: { label: 'Offer', tone: 'accent' },
  hired: { label: 'Hired 🎉', tone: 'good' },
};

const stageName = (id: StageId) => HIRING_STAGES.find((s) => s.id === id)?.name ?? id;

function ApplicationForm({ onAdd }: { onAdd: (a: Application) => void }) {
  const [company, setCompany] = useState('');
  const [account, setAccount] = useState('');
  const [stage, setStage] = useState<StageId>('voice-note');
  const [status, setStatus] = useState<ApplicationStatus>('waiting');
  const [notes, setNotes] = useState('');
  const field = 'rounded-lg border border-border-subtle bg-transparent px-2.5 py-1.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-clay-soft/40';
  return (
    <form
      className="grid sm:grid-cols-2 gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (!company.trim()) return;
        onAdd({ id: newId(), company: company.trim(), account: account.trim(), date: getToday(), stage, status, notes: notes.trim() });
        setCompany('');
        setAccount('');
        setNotes('');
        setStatus('waiting');
      }}
    >
      <input list="cc-companies" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company" className={field} aria-label="Company" />
      <datalist id="cc-companies">
        {COMPANIES.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>
      <input value={account} onChange={(e) => setAccount(e.target.value)} placeholder="Account (e.g. US telecom tech support)" className={field} aria-label="Account" />
      <select value={stage} onChange={(e) => setStage(e.target.value as StageId)} className={field} aria-label="Furthest stage">
        {HIRING_STAGES.map((s) => (
          <option key={s.id} value={s.id}>
            Reached: {s.name}
          </option>
        ))}
      </select>
      <select value={status} onChange={(e) => setStatus(e.target.value as ApplicationStatus)} className={field} aria-label="Status">
        {Object.entries(STATUS).map(([id, s]) => (
          <option key={id} value={id}>
            {s.label}
          </option>
        ))}
      </select>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={2}
        placeholder="What did they ask? What went wrong? Any feedback?"
        className={`${field} sm:col-span-2`}
        aria-label="Notes"
      />
      <button type="submit" disabled={!company.trim()} className={`${primaryBtn} sm:col-span-2 justify-center disabled:opacity-50`}>
        <Plus size={13} /> Add application
      </button>
    </form>
  );
}

/** Your applications, what to do after a rejection, and how hiring works in Egypt. */
export default function TrackerView({ onGoTab }: { onGoTab: (tab: 'voice' | 'interview' | 'tests') => void }) {
  const { applications, setApplications } = useCallCenter();
  const [debrief, setDebrief] = useState<string | null>(null);
  const update = (id: string, patch: Partial<Application>) => setApplications((list) => list.map((a) => (a.id === id ? { ...a, ...patch } : a)));

  return (
    <div className="space-y-4">
      <ArabicNote>
        سجّل كل تقديم، حتى قبل ليفل 3 (اعتبره تمرين). ولو اترفضت، اختار المرحلة اللي وقعت فيها والقسم يقولك تتدرب على إيه بالظبط. كل رفض = داتا، مش فشل.
      </ArabicNote>
      <Card className="space-y-3">
        <h3 className="font-semibold text-ink">Add an application</h3>
        <ApplicationForm onAdd={(a) => setApplications((list) => [a, ...list])} />
      </Card>

      {applications.length > 0 && (
        <div className="space-y-2">
          {applications.map((a) => (
            <Card key={a.id} className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-ink">{a.company}</span>
                {a.account && <span className="text-sm text-ink-light">· {a.account}</span>}
                <Pill tone={STATUS[a.status].tone}>{STATUS[a.status].label}</Pill>
                <span className="ms-auto text-xs text-ink-light tabular-nums">{a.date}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-ink-light">Reached:</span>
                <select value={a.stage} onChange={(e) => update(a.id, { stage: e.target.value as StageId })} className="rounded-md border border-border-subtle bg-transparent px-1.5 py-0.5 text-ink" aria-label="Furthest stage">
                  {HIRING_STAGES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <select value={a.status} onChange={(e) => update(a.id, { status: e.target.value as ApplicationStatus })} className="rounded-md border border-border-subtle bg-transparent px-1.5 py-0.5 text-ink" aria-label="Status">
                  {Object.entries(STATUS).map(([id, s]) => (
                    <option key={id} value={id}>
                      {s.label}
                    </option>
                  ))}
                </select>
                {a.status === 'rejected' && (
                  <button type="button" onClick={() => setDebrief(debrief === a.id ? null : a.id)} className="text-clay-soft hover:underline">
                    What to practice now
                  </button>
                )}
                <button type="button" onClick={() => setApplications((list) => list.filter((x) => x.id !== a.id))} aria-label="Delete" className="ms-auto p-1 text-ink-light hover:text-red-500">
                  <Trash2 size={13} />
                </button>
              </div>
              {a.notes && <p className="text-sm text-ink whitespace-pre-line">{a.notes}</p>}
              {debrief === a.id && (
                <div className="rounded-xl bg-clay-soft/8 border border-clay-soft/30 p-3 space-y-2">
                  <div className="text-sm font-medium text-ink">Rejected at: {stageName(a.stage)}. Do this before the next application:</div>
                  <ul className="list-disc ps-5 text-sm text-ink space-y-0.5">
                    {DEBRIEF[a.stage].map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => onGoTab('voice')} className={secondaryBtn}>
                      Voice Studio
                    </button>
                    <button type="button" onClick={() => onGoTab('interview')} className={secondaryBtn}>
                      Interview questions
                    </button>
                    <button type="button" onClick={() => onGoTab('tests')} className={secondaryBtn}>
                      Tests
                    </button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      <Card className="space-y-3">
        <h3 className="font-semibold text-ink">How English call centers hire in Egypt</h3>
        <ol className="space-y-3">
          {HIRING_STAGES.map((s, i) => (
            <li key={s.id} className="text-sm">
              <div className="font-semibold text-ink">
                {i + 1}. {s.name}
              </div>
              <p className="text-ink">{s.what}</p>
              <p className="text-xs text-ink-light">
                <span className="font-medium">Gets people rejected: </span>
                {s.traps.join(' · ')}
              </p>
              <p className="text-xs text-ink-light">
                <span className="font-medium">Train it here: </span>
                {s.train.join(' · ')}
              </p>
            </li>
          ))}
        </ol>
      </Card>

      <Card className="space-y-3">
        <h3 className="font-semibold text-ink">The numbers to beat</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-start text-xs text-ink-light">
                <th className="text-start font-medium pb-1 pe-3"></th>
                <th className="text-start font-medium pb-1 pe-3">To get hired</th>
                <th className="text-start font-medium pb-1">Overqualified</th>
              </tr>
            </thead>
            <tbody>
              {TARGETS.map((t) => (
                <tr key={t.name} className="border-t border-border-subtle align-top">
                  <td className="py-1.5 pe-3 font-medium text-ink">{t.name}</td>
                  <td className="py-1.5 pe-3 text-ink">{t.hired}</td>
                  <td className="py-1.5 text-ink">
                    {t.overqualified}
                    <div className="text-xs text-ink-light">{t.note}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <div className="text-sm font-semibold text-ink">Rough salaries (EGP a month, from 2026 job ads and posts)</div>
          <ul className="mt-1 space-y-0.5 text-sm text-ink">
            {SALARY_GUIDE.map((s) => (
              <li key={s.level}>
                <span className="font-medium">{s.level}:</span> {s.range} <span className="text-xs text-ink-light">· {s.note}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-ink-light mt-1">They change by company, account and shift; ask before you accept.</p>
        </div>
        <div>
          <div className="text-sm font-semibold text-ink">Where to apply</div>
          <ul className="mt-1 list-disc ps-5 text-sm text-ink space-y-0.5">
            {WHERE_TO_APPLY.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
          <p className="mt-1 text-xs text-ink-light">Companies hiring for English: {COMPANIES.join(' · ')}</p>
        </div>
      </Card>
    </div>
  );
}
