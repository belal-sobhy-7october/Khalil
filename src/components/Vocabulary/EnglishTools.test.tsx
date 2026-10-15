import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useState } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useAppStore } from '../../store/appStore';
import TopicLibraryModal from './TopicLibraryModal';
import QuickAddModal from './QuickAddModal';
import VocabularySection from './VocabularySection';
import ConvertToEnglishModal from './ConvertToEnglishModal';
import YouGlishModal from './YouGlishModal';
import type { VocabularyItem } from '../../types';
import { TOPIC_PACKS } from '../../data/topicPacks';

vi.mock('../../lib/supabase', async () => {
  const mod = await import('../../test/mockSupabase');
  return { supabase: mod.mockSupabase };
});

const lookupMany = vi.fn();
vi.mock('../../lib/dictionary', () => ({
  lookupWord: vi.fn(async () => null),
  lookupMany: (...args: unknown[]) => lookupMany(...args),
}));

const importVocabularyItems = vi.fn(async () => ({ inserted: 3, updated: 0, skipped: 0, failed: 0 }));

beforeEach(() => {
  importVocabularyItems.mockClear();
  lookupMany.mockReset();
  useAppStore.setState({ language: 'en', vocabularyItems: [], vocabularyCategories: [], importVocabularyItems });
});

// A missing translation renders as its raw key, e.g. "vocabulary.library.title".
const expectNoRawKeys = () => expect(document.body.textContent).not.toMatch(/\bvocabulary\.[a-zA-Z.]+/);

describe('TopicLibraryModal', () => {
  it.each(['en', 'ar'] as const)('lists every pack with no missing translations (%s)', (language) => {
    useAppStore.setState({ language });
    render(<TopicLibraryModal onClose={() => {}} />);
    for (const pack of TOPIC_PACKS) expect(screen.getByText(pack.title)).toBeInTheDocument();
    expectNoRawKeys();
  });

  it('adds a whole pack into a topic named after it', async () => {
    const onAdded = vi.fn();
    render(<TopicLibraryModal onClose={() => {}} onAdded={onAdded} />);
    fireEvent.click(screen.getByText('Call Center Interview'));
    expectNoRawKeys();
    const pack = TOPIC_PACKS.find((p) => p.id === 'call-center-interview')!;
    fireEvent.click(screen.getByRole('button', { name: `Add ${pack.items.length} items` }));
    await waitFor(() => expect(importVocabularyItems).toHaveBeenCalled());
    const [items, options] = importVocabularyItems.mock.calls[0] as unknown as [unknown[], { categoryForAll: string }];
    expect(items).toHaveLength(pack.items.length);
    expect(options.categoryForAll).toBe('Call Center Interview');
    await waitFor(() => expect(onAdded).toHaveBeenCalledWith('Call Center Interview'));
  });
});

describe('QuickAddModal', () => {
  it('looks up bare words and keeps typed definitions', async () => {
    lookupMany.mockImplementation(async (words: string[], onResult: (i: number, e: unknown) => void) => {
      words.forEach((w, i) =>
        onResult(i, w === 'negotiate' ? { definition: 'to discuss to reach an agreement', example: 'We negotiated a deal.', phonetic: '/nɪˈɡəʊʃieɪt/', type: 'verb', audio: {} } : null)
      );
    });
    render(<QuickAddModal onClose={() => {}} />);
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'negotiate\nzzqx\nbargain | a cheap deal | It was a bargain.' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Continue (3)' }));
    expect(lookupMany.mock.calls[0][0]).toEqual(['negotiate', 'zzqx']);
    await screen.findByDisplayValue('to discuss to reach an agreement');
    expect(screen.getByDisplayValue('a cheap deal')).toBeInTheDocument();
    expectNoRawKeys();

    // "zzqx" has no definition, so only two rows are ready.
    fireEvent.click(screen.getByRole('button', { name: 'Add 2 words' }));
    await waitFor(() => expect(importVocabularyItems).toHaveBeenCalled());
    const [items] = importVocabularyItems.mock.calls[0] as unknown as [Array<{ word: string; type: string }>];
    expect(items.map((i) => i.word)).toEqual(['negotiate', 'bargain']);
    expect(items[0].type).toBe('verb');
  });
});

describe('VocabularySection', () => {
  it('renders the new actions with no missing translations', () => {
    useAppStore.setState({
      vocabularyCategories: [{ id: 'c1', userId: 'u', name: 'Call Center Interview', createdAt: '', updatedAt: '' }],
    });
    render(<VocabularySection />);
    expect(screen.getByRole('button', { name: 'Topic Library' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Quick add' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Call Center Interview/ }));
    expect(screen.getByRole('button', { name: /Review "Call Center Interview"/ })).toBeInTheDocument();
    expectNoRawKeys();
  });
});

const arabicItem = (id: string, word: string): VocabularyItem => ({
  id, userId: 'u', word, type: 'word', definition: 'صفقة رابحة', exampleSentence: 'This phone was a real bargain',
  masteryLevel: 0, reviewCount: 0, lapseCount: 0, correctStreak: 0, isHard: false, createdAt: '', updatedAt: '',
});

describe('ConvertToEnglishModal', () => {
  it('fills English definitions from packs and saves them', async () => {
    const updateVocabularyItem = vi.fn(async () => {});
    lookupMany.mockImplementation(async () => {});
    useAppStore.setState({ vocabularyItems: [arabicItem('a', 'Bargain')], updateVocabularyItem });
    render(<ConvertToEnglishModal onClose={() => {}} />);
    expect(screen.getByDisplayValue(/much less than its usual price/)).toBeInTheDocument();
    // An English example the user already wrote is kept.
    expect(screen.getByDisplayValue('This phone was a real bargain')).toBeInTheDocument();
    expectNoRawKeys();
    fireEvent.click(screen.getByRole('button', { name: 'Update 1 words' }));
    await waitFor(() => expect(updateVocabularyItem).toHaveBeenCalledWith('a', expect.objectContaining({
      definition: expect.stringMatching(/much less than its usual price/),
    })));
  });
});

describe('YouGlishModal', () => {
  it('closing the modal keeps the page alive even if the widget misbehaves', async () => {
    // The real widget swaps the element it is given for an iframe, and its
    // close() can throw once that iframe is gone.
    window.YG = {
      Widget: class {
        constructor(id: string) {
          document.getElementById(id)?.replaceWith(document.createElement('iframe'));
        }
        fetch() {}
        close() {
          throw new Error('widget already destroyed');
        }
      } as unknown as NonNullable<typeof window.YG>['Widget'],
    };
    function Host() {
      const [open, setOpen] = useState(true);
      return (
        <div>
          <p>page still here</p>
          {open && <YouGlishModal word="bargain" onClose={() => setOpen(false)} />}
        </div>
      );
    }
    render(<Host />);
    await waitFor(() => expect(document.querySelector('iframe')).not.toBeNull());
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.getByText('page still here')).toBeInTheDocument();
    expect(document.querySelector('iframe')).toBeNull();
  });
});
