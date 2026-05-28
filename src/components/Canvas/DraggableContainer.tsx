import { useRef, useState, useEffect, type ReactNode } from 'react';

interface Props {
  id: string;
  defaultPosition?: { x: number; y: number };
  fixed?: boolean;
  children: ReactNode;
}

export default function DraggableContainer({ id, defaultPosition = { x: 0, y: 0 }, fixed = false, children }: Props) {
  const storageKey = `khalil-drag-${id}`;
  const saved = (() => {
    try {
      const s = localStorage.getItem(storageKey);
      return s ? JSON.parse(s) : defaultPosition;
    } catch { return defaultPosition; }
  })();

  const [pos, setPos] = useState(saved);
  const dragging = useRef(false);
  const startMouse = useRef({ x: 0, y: 0 });
  const startPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(pos));
  }, [pos, storageKey]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      let newX = startPos.current.x + (e.clientX - startMouse.current.x);
      let newY = startPos.current.y + (e.clientY - startMouse.current.y);
      if (fixed) {
        newX = Math.min(Math.max(0, newX), window.innerWidth - 240);
        newY = Math.min(Math.max(0, newY), window.innerHeight - 200);
      }
      setPos({ x: newX, y: newY });
    };
    const onUp = () => { dragging.current = false; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [fixed]);

  const onMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('input, textarea, button, select, a, [role="button"]')) return;
    if (!target.closest('.drag-handle')) return;
    dragging.current = true;
    startMouse.current = { x: e.clientX, y: e.clientY };
    startPos.current = { ...pos };
    e.preventDefault();
  };

  return (
    <div
      style={fixed ? { position: 'fixed', left: pos.x, top: pos.y, zIndex: 50 } : { transform: `translate(${pos.x}px, ${pos.y}px)` }}
      onMouseDown={onMouseDown}
    >
      {children}
    </div>
  );
}
