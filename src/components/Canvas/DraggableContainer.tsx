import { useRef, useState, useEffect, type ReactNode } from 'react';

interface Props {
  id: string;
  defaultPosition?: { x: number; y: number };
  fixed?: boolean;
  children: ReactNode;
  onPositionChange?: (x: number, y: number) => void;
}

export default function DraggableContainer({
  id: _id,
  defaultPosition,
  fixed = false,
  children,
  onPositionChange,
}: Props) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const posRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const onPositionChangeRef = useRef(onPositionChange);
  onPositionChangeRef.current = onPositionChange;
  const dragging = useRef(false);
  const startMouse = useRef({ x: 0, y: 0 });
  const startPos = useRef({ x: 0, y: 0 });

  // Set position once when defaultPosition arrives from Supabase
  useEffect(() => {
    if (defaultPosition && pos === null) {
      setPos(defaultPosition);
      posRef.current = defaultPosition;
    }
  }, [defaultPosition?.x, defaultPosition?.y]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current || !pos) return;
      let newX = startPos.current.x + (e.clientX - startMouse.current.x);
      let newY = startPos.current.y + (e.clientY - startMouse.current.y);
      if (fixed) {
        newX = Math.min(Math.max(0, newX), window.innerWidth - 240);
        newY = Math.min(Math.max(0, newY), window.innerHeight - 200);
      }
      const newPos = { x: newX, y: newY };
      setPos(newPos);
      posRef.current = newPos;
    };
    const onUp = () => {
      if (!dragging.current) return;
      dragging.current = false;
      onPositionChangeRef.current?.(posRef.current.x, posRef.current.y);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [fixed, pos]);

  const onMouseDown = (e: React.MouseEvent) => {
    if (!pos) return;
    const target = e.target as HTMLElement;
    if (target.closest('input, textarea, button, select, a, [role="button"]')) return;
    if (!target.closest('.drag-handle')) return;
    dragging.current = true;
    startMouse.current = { x: e.clientX, y: e.clientY };
    startPos.current = { ...pos };
    e.preventDefault();
  };

  // Don't render until we have a position from Supabase
  if (pos === null) return null;

  const currentPos = pos;

  return (
    <div
      style={
        fixed
          ? { position: 'fixed', left: currentPos.x, top: currentPos.y, zIndex: 50 }
          : { transform: `translate(${currentPos.x}px, ${currentPos.y}px)` }
      }
      onMouseDown={onMouseDown}
    >
      {children}
    </div>
  );
}
