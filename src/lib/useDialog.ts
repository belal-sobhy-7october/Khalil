import { useEffect, useId, useRef } from 'react';

/**
 * Modal plumbing: closes on Escape and returns the props that make screen
 * readers announce the element as a dialog titled by the element carrying
 * `titleId`. When dialogs are stacked only the topmost (the last open one in
 * the document) reacts to Escape.
 */
export function useDialog(onClose: () => void) {
  const titleId = useId();
  const ref = useRef<HTMLDivElement>(null);
  const close = useRef(onClose);
  useEffect(() => {
    close.current = onClose;
  });
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || !ref.current) return;
      const open = document.querySelectorAll('[aria-modal="true"]');
      if (open[open.length - 1] !== ref.current) return;
      e.preventDefault();
      close.current();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  return { titleId, props: { ref, role: 'dialog', 'aria-modal': true, 'aria-labelledby': titleId } as const };
}
