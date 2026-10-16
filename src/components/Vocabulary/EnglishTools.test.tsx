import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useState } from 'react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { useAppStore } from '../../store/appStore';
import TopicLibraryModal from './TopicLibraryModal';
import QuickAddModal from './QuickAddModal';
import VocabularySection from './VocabularySection';
import ConvertToEnglishModal from './ConvertToEnglishModal';
import YouGlishModal from './YouGlishModal';
import CheckMeaningsModal from './CheckMeaningsModal';
import UpgradeTopicsModal from './UpgradeTopicsModal';
import type { VocabularyItem } from '../../types';
import { TOPIC_PACKS } from '../../data/topicPacks';

vi.mock('../../lib/supabase', async () => {
  const mod = await import('../../test/mockSupabase');
  return { supabase: mod.mockSupabase };
});

const lookupMany = vi.fn();
vi.mock('../../lib/dictionary', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../lib/dictionary')>()),
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

  it('filters topics by group and by a word they contain', () => {
    render(<TopicLibraryModal onClose={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: 'Daily life' }));
    expect(screen.queryByText('Job Interview')).toBeNull();
    expect(screen.getByText(TOPIC_PACKS.find((p) => p.group === 'life')!.title)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'All' }));
    const word = TOPIC_PACKS.find((p) => p.id === 'job-interview')!.items[0].word;
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: word } });
    expect(screen.getByText('Job Interview')).toBeInTheDocument();
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'zzzz' } });
    expect(screen.getByText('No topic matches your search.')).toBeInTheDocument();
  });

  it.each(['en', 'ar'] as const)('opens a pack as a full lesson (%s)', (language) => {
    useAppStore.setState({ language });
    render(<TopicLibraryModal onClose={() => {}} />);
    expect(screen.getAllByText(language === 'en' ? 'Your course' : 'من الكورس بتاعك')).toHaveLength(8);
    fireEvent.click(screen.getByText('Artificial Intelligence'));
    const pack = TOPIC_PACKS.find((p) => p.id === 'artificial-intelligence')!;
    expect(screen.getByText(pack.warmUp[0])).toBeInTheDocument();
    expect(screen.getByText(pack.grammar.title)).toBeInTheDocument();
    expect(screen.getByText(pack.discussion[0])).toBeInTheDocument();
    expect(screen.getByText(pack.task.prompt)).toBeInTheDocument();
    expect(screen.getAllByText('phrasal verb').length).toBeGreaterThan(0);
    expectNoRawKeys();
  });

  it('offers YouGlish next to every pack word', () => {
    render(<TopicLibraryModal onClose={() => {}} />);
    fireEvent.click(screen.getByText('Job Interview'));
    const pack = TOPIC_PACKS.find((p) => p.id === 'job-interview')!;
    expect(screen.getAllByRole('button', { name: /^YouGlish: / })).toHaveLength(pack.items.length);
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

  it('picks the meaning that fits the topic and lets the user switch it', async () => {
    lookupMany.mockImplementation(async (_words: string[], onResult: (i: number, e: unknown) => void) => {
      onResult(0, { definition: SPLIT_UP[0].definition, type: 'verb', audio: {}, senses: SPLIT_UP });
    });
    render(<QuickAddModal onClose={() => {}} defaultCategory="Marriage" />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'split up' } });
    fireEvent.click(screen.getByRole('button', { name: 'Continue (1)' }));
    await screen.findByDisplayValue('To end a relationship or marriage.');
    expect(screen.getByDisplayValue('They split up after ten years.')).toBeInTheDocument();
    const picker = screen.getByRole('combobox', { name: /2 meanings/ });
    fireEvent.change(picker, { target: { value: '0' } });
    expect(screen.getByDisplayValue(SPLIT_UP[0].definition)).toBeInTheDocument();
  });
});

const SPLIT_UP = [
  { definition: 'To divide into smaller groups or separate individuals.', pos: 'verb' },
  { definition: 'To end a relationship or marriage.', example: 'They split up after ten years.', pos: 'verb' },
];

describe('CheckMeaningsModal', () => {
  it("suggests the topic's sense and keeps the user's example", async () => {
    const updateVocabularyItem = vi.fn(async () => {});
    const item = (id: string, word: string, definition: string, exampleSentence?: string): VocabularyItem => ({
      id, userId: 'u', categoryId: 'm', word, type: 'verb', definition, exampleSentence,
      masteryLevel: 0, reviewCount: 0, lapseCount: 0, correctStreak: 0, isHard: false, createdAt: '', updatedAt: '',
    });
    useAppStore.setState({
      updateVocabularyItem,
      vocabularyItems: [
        item('1', 'Split up', SPLIT_UP[0].definition, 'They decided to split up'),
        item('2', 'Divorce', 'The legal ending of a marriage.'),
      ],
    });
    lookupMany.mockImplementation(async (words: string[], onResult: (i: number, e: unknown) => void) => {
      words.forEach((w, i) => onResult(i, w === 'Split up' ? { definition: SPLIT_UP[0].definition, type: 'verb', audio: {}, senses: SPLIT_UP } : null));
    });
    render(<CheckMeaningsModal category={{ id: 'm', userId: 'u', name: 'Marriage', createdAt: '', updatedAt: '' }} onClose={() => {}} />);
    expect(await screen.findByText('Fits this topic better')).toBeInTheDocument();
    expectNoRawKeys();
    fireEvent.click(screen.getByRole('button', { name: 'Save 1 change' }));
    await waitFor(() => expect(updateVocabularyItem).toHaveBeenCalledWith('1', { definition: 'To end a relationship or marriage.' }));
    expect(await screen.findByText('1 meaning updated.')).toBeInTheDocument();
  });

  it('says so when every meaning already fits', async () => {
    useAppStore.setState({ vocabularyItems: [] });
    render(<CheckMeaningsModal category={{ id: 'm', userId: 'u', name: 'Marriage', createdAt: '', updatedAt: '' }} onClose={() => {}} />);
    expect(screen.getByText('Every word already has a meaning that fits this topic.')).toBeInTheDocument();
  });
});

describe('UpgradeTopicsModal', () => {
  const vi_item = (id: string, categoryId: string, word: string): VocabularyItem => ({
    id, userId: 'u', categoryId, word, type: 'word', definition: 'old definition', exampleSentence: 'old example',
    masteryLevel: 2, reviewCount: 3, lapseCount: 0, correctStreak: 1, isHard: false, createdAt: '', updatedAt: '',
  });

  it('applies only the ticked parts', async () => {
    const updateVocabularyItem = vi.fn(async () => {});
    const deleteVocabularyItem = vi.fn(async () => {});
    const updateVocabularyCategory = vi.fn(async () => {});
    useAppStore.setState({
      updateVocabularyItem, deleteVocabularyItem, updateVocabularyCategory,
      vocabularyCategories: [
        { id: 'j', userId: 'u', name: 'Job Interview', createdAt: '', updatedAt: '' },
        { id: 'm', userId: 'u', name: 'Marriage', createdAt: '', updatedAt: '' },
      ],
      vocabularyItems: [vi_item('1', 'j', 'Strength'), vi_item('2', 'j', 'a quick learner'), vi_item('3', 'j', 'my own phrase'), vi_item('4', 'm', 'Split up')],
    });
    render(<UpgradeTopicsModal onClose={() => {}} />);
    expectNoRawKeys();
    expect(screen.getByText('Topics from the old packs')).toBeInTheDocument();
    expect(screen.getByText("Use the lesson's meaning and example for 1 word")).toBeInTheDocument();
    // Keep the old word this time.
    fireEvent.click(screen.getByRole('checkbox', { name: /Remove 1 old word/ }));
    // Don't add the Marriage lesson words either.
    fireEvent.click(screen.getByRole('checkbox', { name: /from the lesson "Relationships & Marriage"/ }));
    fireEvent.click(screen.getByRole('button', { name: /^Apply \d+ changes?$/ }));
    await screen.findByText(/^Done — /);
    expect(updateVocabularyItem).toHaveBeenCalledWith('1', expect.objectContaining({ definition: expect.stringMatching(/good quality or ability/) }));
    expect(deleteVocabularyItem).not.toHaveBeenCalled();
    expect(updateVocabularyCategory).not.toHaveBeenCalled();
    const [items, options] = importVocabularyItems.mock.calls[0] as unknown as [Array<{ word: string }>, { categoryForAll: string }];
    expect(options.categoryForAll).toBe('Job Interview');
    expect(items.map((i) => i.word)).not.toContain('strength');
    expect(importVocabularyItems).toHaveBeenCalledTimes(1);
  });
});

describe('VocabularySection topic picker', () => {
  it('lists every topic and filters by the one picked', () => {
    const cats = Array.from({ length: 12 }, (_, i) => ({ id: `c${i}`, userId: 'u', name: `Topic ${String(i).padStart(2, '0')}`, createdAt: '', updatedAt: '' }));
    useAppStore.setState({ vocabularyCategories: cats });
    render(<VocabularySection />);
    fireEvent.click(screen.getByRole('button', { name: /All topics \(12\)/ }));
    const list = screen.getByRole('listbox');
    expect(within(list).getAllByRole('option')).toHaveLength(12);
    fireEvent.change(screen.getByRole('searchbox', { name: 'Find a topic…' }), { target: { value: '11' } });
    fireEvent.click(within(list).getByRole('option', { name: /Topic 11/ }));
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(screen.getByRole('button', { name: /Review "Topic 11"/ })).toBeInTheDocument();
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
    useAppStore.setState({ vocabularyItems: [arabicItem('a', 'Splurge')], updateVocabularyItem });
    render(<ConvertToEnglishModal onClose={() => {}} />);
    expect(screen.getByDisplayValue(/spend a lot of money on something you enjoy/)).toBeInTheDocument();
    // An English example the user already wrote is kept.
    expect(screen.getByDisplayValue('This phone was a real bargain')).toBeInTheDocument();
    expectNoRawKeys();
    fireEvent.click(screen.getByRole('button', { name: 'Update 1 word' }));
    await waitFor(() => expect(updateVocabularyItem).toHaveBeenCalledWith('a', expect.objectContaining({
      definition: expect.stringMatching(/spend a lot of money on something you enjoy/),
    })));
  });
});

describe('ConvertToEnglishModal select all', () => {
  it('selects and unselects every row', () => {
    lookupMany.mockImplementation(async () => {});
    useAppStore.setState({ vocabularyItems: [arabicItem('a', 'Splurge'), arabicItem('b', 'Zzqx')] });
    render(<ConvertToEnglishModal onClose={() => {}} />);
    const all = screen.getByRole('checkbox', { name: /Select all/ });
    fireEvent.click(all);
    expect(screen.getByRole('checkbox', { name: 'Zzqx' })).toBeChecked();
    fireEvent.click(all);
    expect(screen.getByRole('checkbox', { name: 'Splurge' })).not.toBeChecked();
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
