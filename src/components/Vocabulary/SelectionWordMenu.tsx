import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { MonitorPlay, Plus, Volume2 } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { getPronunciationPrefs, speakWord } from '../../lib/pronunciation';
import { selectedWord, sentenceAround } from '../../lib/selectionWord';

const QuickAddModal = lazy(() => import('./QuickAddModal'));
const YouGlishModal = lazy(() => import('./YouGlishModal'));

interface Picked {
  word: string;
  example: string;
  /** The flashcard group of the part of the app it was selected in (`data-vocab-group`). */
  group?: string;
  x: number;
  top: number;
  bottom: number;
  below: boolean;
}

const BLOCK = 'p, li, td, th, dd, blockquote, h1, h2, h3, h4, h5, h6';
const SKIP = 'input, textarea, select, [contenteditable="true"], [contenteditable=""], [data-no-word-menu]';

function readSelection(): Picked | null {
  const selection = window.getSelection();
  if (!selection || selection.isCollapsed || !selection.rangeCount) return null;
  const range = selection.getRangeAt(0);
  const node = range.commonAncestorContainer;
  const el = node.nodeType === Node.ELEMENT_NODE ? (node as Element) : node.parentElement;
  if (!el || el.closest(SKIP)) return null;
  const word = selectedWord(selection.toString());
  if (!word) return null;
  const rect = range.getBoundingClientRect();
  if (!rect.width && !rect.height) return null;
  const block = el.closest(BLOCK) ?? el;
  // On phones the system's own copy menu sits above the selection, so go below it.
  const coarse = window.matchMedia?.('(pointer: coarse)').matches ?? false;
  return {
    word,
    example: sentenceAround(block.textContent ?? '', word),
    group: el.closest<HTMLElement>('[data-vocab-group]')?.dataset.vocabGroup,
    x: rect.left + rect.width / 2,
    top: rect.top,
    bottom: rect.bottom,
    below: coarse || rect.top < 64,
  };
}

/**
 * Select an English word or phrase anywhere in the app and a small menu shows
 * up by it: add it to your flashcards (looked up, with the sentence it was in
 * as its example), hear it, or open it on YouGlish.
 */
export default function SelectionWordMenu() {
  const { t } = useTranslation();
  const [picked, setPicked] = useState<Picked | null>(null);
  const [adding, setAdding] = useState<Picked | null>(null);
  const [youglish, setYouglish] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timer = 0;
    let pressing = false;
    const read = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => !pressing && setPicked(readSelection()), 200);
    };
    const onDown = (e: PointerEvent) => {
      if (menuRef.current?.contains(e.target as Node)) return;
      pressing = true;
      setPicked(null);
    };
    const onUp = () => {
      pressing = false;
      read();
    };
    // Hidden while the page scrolls, back in its new place once it stops.
    const onMove = () => {
      setPicked(null);
      read();
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setPicked(null);
    document.addEventListener('selectionchange', read);
    document.addEventListener('pointerdown', onDown, true);
    document.addEventListener('pointerup', onUp, true);
    window.addEventListener('scroll', onMove, true);
    window.addEventListener('resize', onMove);
    window.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('selectionchange', read);
      document.removeEventListener('pointerdown', onDown, true);
      document.removeEventListener('pointerup', onUp, true);
      window.removeEventListener('scroll', onMove, true);
      window.removeEventListener('resize', onMove);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  const add = () => {
    if (!picked) return;
    setAdding(picked);
    setPicked(null);
    window.getSelection()?.removeAllRanges();
  };

  const half = 110;
  const left = picked ? Math.min(Math.max(picked.x, half + 8), window.innerWidth - half - 8) : 0;
  const btn = 'inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors';

  return createPortal(
    <>
      {picked && (
        <div
          ref={menuRef}
          role="toolbar"
          aria-label={t('vocabulary.selection.label').replace('{word}', picked.word)}
          data-no-word-menu
          // Keep the selection while a button is pressed.
          onMouseDown={(e) => e.preventDefault()}
          className="fixed z-[70] flex items-center gap-1 p-1 rounded-xl border border-border-subtle bg-card shadow-lg"
          style={{
            left,
            top: picked.below ? picked.bottom + 8 : picked.top - 8,
            transform: `translate(-50%, ${picked.below ? '0' : '-100%'})`,
          }}
        >
          <button type="button" onClick={add} className={`${btn} bg-clay-soft text-white hover:bg-clay-soft-dark`}>
            <Plus size={14} /> {t('vocabulary.selection.add')}
          </button>
          <button
            type="button"
            onClick={() => void speakWord(picked.word, getPronunciationPrefs().accent)}
            className={`${btn} text-ink hover:bg-ink/5`}
            aria-label={`${t('vocabulary.pronounce')}: ${picked.word}`}
          >
            <Volume2 size={14} />
          </button>
          <button type="button" onClick={() => setYouglish(picked.word)} className={`${btn} text-ink hover:bg-ink/5`}>
            <MonitorPlay size={14} /> YouGlish
          </button>
        </div>
      )}
      <Suspense fallback={null}>
        {adding && (
          <QuickAddModal
            initial={{ word: adding.word, example: adding.example }}
            defaultCategory={adding.group}
            onClose={() => setAdding(null)}
          />
        )}
        {youglish && <YouGlishModal word={youglish} onClose={() => setYouglish(null)} />}
      </Suspense>
    </>,
    document.body
  );
}
