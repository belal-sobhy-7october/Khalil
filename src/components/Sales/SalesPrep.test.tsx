import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { useAppStore } from '../../store/appStore';
import SalesPrep from './SalesPrep';
import { PLAN_DAYS } from '../../data/sales/plan';

vi.mock('../../lib/supabase', async () => {
  const mod = await import('../../test/mockSupabase');
  return { supabase: mod.mockSupabase };
});
// Saved values stay for the test, like the device copy does in the app.
const kv = vi.hoisted(() => new Map<string, unknown>());
vi.mock('../../lib/userKv', () => ({
  readLocalKv: (k: string, f: unknown) => (kv.has(k) ? kv.get(k) : f),
  loadKv: vi.fn(async (_u: string, k: string, f: unknown) => (kv.has(k) ? kv.get(k) : f)),
  saveKv: vi.fn(async (_u: string, k: string, v: unknown) => {
    kv.set(k, v);
    return true;
  }),
}));
vi.mock('../English/LoopPlayer', () => ({ default: () => <div data-testid="loop-player" /> }));
// jsdom runs no animation frames, so exit animations would never finish: leave at once.
vi.mock('framer-motion', async (importOriginal) => ({
  ...(await importOriginal<typeof import('framer-motion')>()),
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const session = (email: string) => ({ user: { id: 'u1', email } }) as never;
const tasksDone = () => (kv.get('sales-tasks') ?? {}) as Record<string, string>;
const doneThrough = (dayId: string) => {
  const end = PLAN_DAYS.findIndex((d) => d.day.id === dayId);
  return Object.fromEntries(PLAN_DAYS.slice(0, end + 1).flatMap(({ day }) => day.tasks.map((t) => [t.id, '2026-10-20'])));
};

beforeEach(() => {
  kv.clear();
  localStorage.clear();
  useAppStore.setState({ language: 'ar', session: session('someone@example.com') });
});

describe('Sales Prep', () => {
  it('opens on the first day, with only its tasks', () => {
    render(<SalesPrep />);
    expect(screen.getByRole('heading', { name: 'تعلّم المبيعات' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'اليوم الأول' })).toBeInTheDocument();
    expect(screen.getByText('ابدأ هنا: كيف تسير الخطة')).toBeInTheDocument();
    expect(screen.getByText('تسجيل البداية: بِعني هذا القلم')).toBeInTheDocument();
    expect(screen.getByText('اختبار البداية')).toBeInTheDocument();
    // Tomorrow is named, but its tasks aren't shown.
    expect(screen.getByText('المبيعات مساعدة لا إلحاح')).toBeInTheDocument();
    expect(screen.queryByText('مكالمة اكتشاف: باقة إنترنت منزلي')).not.toBeInTheDocument();
  });

  it('ticks the lesson once its checks are answered, and moves on when the day is done', () => {
    render(<SalesPrep />);
    // The first task (the lesson) is open: answer both checks.
    fireEvent.click(screen.getByRole('button', { name: 'التمرين بالكلام وتمثيل الأدوار والمهمات' }));
    fireEvent.click(screen.getByRole('button', { name: 'الإنجليزية' }));
    expect(tasksDone()['S0-D1:lesson:start-here']).toBeTruthy();
    // Tick the rest from their circles.
    for (const b of screen.getAllByRole('button', { name: 'علّمها منجزة' })) fireEvent.click(b);
    expect(screen.getByText('انتهى اليوم! 🎉')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /ابدأ اليوم التالي/ }));
    expect(screen.getByRole('heading', { name: 'المبيعات مساعدة لا إلحاح' })).toBeInTheDocument();
  });

  it('saves the notebook line and shows it in the notebook tab', () => {
    render(<SalesPrep />);
    fireEvent.click(screen.getByText('دفترك: سطران عن اليوم'));
    const box = screen.getByLabelText(/لماذا تريد أن تتعلم المبيعات/);
    fireEvent.change(box, { target: { value: 'أريد أن أعمل في البيع عبر الهاتف' } });
    fireEvent.blur(box);
    expect(tasksDone()['S0-D1:journal:start']).toBeTruthy();
    fireEvent.click(screen.getByRole('tab', { name: 'الدفتر والتقدم' }));
    expect(screen.getByText('أريد أن أعمل في البيع عبر الهاتف')).toBeInTheDocument();
  });

  it('takes a quiz, saves the attempt and ticks it when passed', () => {
    kv.set('sales-tasks', doneThrough('S1-W1-D5'));
    render(<SalesPrep />);
    expect(screen.getByRole('heading', { name: 'مراجعة واختبار الأسبوع' })).toBeInTheDocument();
    fireEvent.click(screen.getByText(/اختبار الأسبوع 1/));
    fireEvent.click(screen.getByRole('button', { name: 'ابدأ' }));
    const quiz = screen.getByText(/سؤال 1 من/).closest('div')!.parentElement as HTMLElement;
    const total = Number(within(quiz).getByText(/سؤال 1 من/).textContent!.match(/من (\d+)/)![1]);
    // Answer the first option every time: the score is whatever it is, but the attempt is saved.
    for (let i = 0; i < total; i++) {
      fireEvent.click(within(quiz).getAllByRole('button')[0]);
      if (i < total - 1) fireEvent.click(within(quiz).getByRole('button', { name: 'التالي' }));
    }
    const attempts = (kv.get('sales-tests') as Record<string, Array<{ percent: number; passed: boolean }>>)['S1-W1-QUIZ'];
    expect(attempts).toHaveLength(1);
    expect(!!tasksDone()['S1-W1-D6:quiz:S1-W1-QUIZ']).toBe(attempts[0].passed);
  });

  it('shows the levels in the roadmap and opens a day from it', () => {
    render(<SalesPrep />);
    fireEvent.click(screen.getByRole('tab', { name: 'الخريطة' }));
    expect(screen.getByText('أساسيات المبيعات')).toBeInTheDocument();
    expect(screen.getByText('السوق والتسويق والتفاوض')).toBeInTheDocument();
    expect(screen.getByText('Sales in English')).toBeInTheDocument();
    fireEvent.click(screen.getByText('أساسيات المبيعات'));
    fireEvent.click(within(screen.getByText('ما المبيعات؟').closest('.rounded-xl') as HTMLElement).getByRole('button', { name: 'يوم 2' }));
    expect(screen.getByRole('heading', { name: 'أنواع العمل في المبيعات في مصر' })).toBeInTheDocument();
  });

  it('switches to English for Level 3', () => {
    kv.set('sales-tasks', doneThrough('S2-EXAM'));
    render(<SalesPrep />);
    expect(screen.getByRole('heading', { name: 'The words every sales team uses' })).toBeInTheDocument();
    expect(screen.getByText('12 sales words for your flashcards')).toBeInTheDocument();
  });
});

describe('Sales Prep: knowledge first, electronics as an extra', () => {
  it('gives a knowledge chapter as a task of the day, ticked once read', () => {
    kv.set('sales-tasks', doneThrough('S0-D1'));
    render(<SalesPrep />);
    fireEvent.click(screen.getByText('البيع على حقيقته: البيع تبادل قيمة'));
    fireEvent.click(screen.getByRole('button', { name: /أنهيت الفصل/ }));
    expect((kv.get('sales-knowledge') as Record<string, string>)['k-sales-exchange']).toBeTruthy();
    expect(tasksDone()['S1-W1-D1:knowledge:k-sales-exchange']).toBeTruthy();
    fireEvent.click(screen.getByRole('tab', { name: 'المعرفة' }));
    expect(screen.getByRole('heading', { name: 'التفاوض' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'التسويق' })).toBeInTheDocument();
  });

  it('keeps electronics in the extra tab, outside the plan', () => {
    render(<SalesPrep />);
    fireEvent.click(screen.getByRole('tab', { name: 'إضافي: الأجهزة' }));
    fireEvent.click(screen.getByText('اعرف الأجهزة وترجم المواصفات'));
    fireEvent.click(screen.getByText('الهواتف: ما الذي يُحدث فرقًا حقًا'));
    fireEvent.click(screen.getAllByRole('button', { name: 'علّمها منجزة' })[0]);
    expect(tasksDone()['extra:lesson:el-phones']).toBeTruthy();
    // The plan itself didn't move.
    fireEvent.click(screen.getByRole('tab', { name: 'اليوم' }));
    expect(screen.getByRole('heading', { name: 'اليوم الأول' })).toBeInTheDocument();
  });
});
