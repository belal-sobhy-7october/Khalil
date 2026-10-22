import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { useAppStore } from '../../store/appStore';
import SelectionWordMenu from './SelectionWordMenu';

vi.mock('../../lib/supabase', async () => {
  const mod = await import('../../test/mockSupabase');
  return { supabase: mod.mockSupabase };
});
const lookupMany = vi.fn(async (_words: string[], onResult: (i: number, e: unknown) => void) => {
  onResult(0, { definition: 'A person who finds people for jobs.', type: 'word', audio: {} });
});
vi.mock('../../lib/dictionary', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../lib/dictionary')>()),
  lookupMany: (...args: Parameters<typeof lookupMany>) => lookupMany(...args),
}));

beforeEach(() => {
  useAppStore.setState({ language: 'en', vocabularyItems: [], vocabularyCategories: [] });
  // jsdom doesn't lay pages out.
  Range.prototype.getBoundingClientRect = () => ({ left: 100, top: 200, right: 160, bottom: 220, width: 60, height: 20 }) as DOMRect;
});

function select(node: Node, start: number, end: number) {
  const range = document.createRange();
  range.setStart(node, start);
  range.setEnd(node, end);
  const selection = window.getSelection()!;
  selection.removeAllRanges();
  selection.addRange(range);
  document.dispatchEvent(new Event('selectionchange'));
}

describe('SelectionWordMenu', () => {
  it('adds a selected word with the sentence it was in, to the group of that part of the app', async () => {
    vi.useFakeTimers();
    const text = 'Interviewer: Sarah, a friendly HR recruiter at a call center in Cairo.';
    render(
      <>
        <div data-vocab-group="Call Center: My words">
          <p data-testid="text">{text}</p>
        </div>
        <SelectionWordMenu />
      </>
    );
    const node = screen.getByTestId('text').firstChild!;
    select(node, text.indexOf('recruiter'), text.indexOf('recruiter') + 'recruiter'.length);
    await act(async () => {
      vi.advanceTimersByTime(300);
    });
    vi.useRealTimers();
    expect(screen.getByRole('toolbar', { name: 'Selected: recruiter' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Add to my words/ }));
    expect(await screen.findByDisplayValue('A person who finds people for jobs.')).toBeInTheDocument();
    expect(screen.getByDisplayValue(text)).toBeInTheDocument();
    expect(screen.getAllByRole('combobox')[0]).toHaveValue('Call Center: My words');
    expect(lookupMany.mock.calls[0][0]).toEqual(['recruiter']);
  });

  it("doesn't show for Arabic text", async () => {
    vi.useFakeTimers();
    render(
      <>
        <p data-testid="text">مكالمة سهلة</p>
        <SelectionWordMenu />
      </>
    );
    select(screen.getByTestId('text').firstChild!, 0, 6);
    await act(async () => {
      vi.advanceTimersByTime(300);
    });
    vi.useRealTimers();
    expect(screen.queryByRole('toolbar')).not.toBeInTheDocument();
  });
});
