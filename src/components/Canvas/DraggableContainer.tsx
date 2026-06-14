import { useRef, useState, useEffect, type ReactNode } from 'react';

interface Props {
  id: string;
  defaultPosition?: { x: number; y: number };
  fixed?: boolean;
  children: ReactNode;
  onPositionChange?: (x: number, y: number) => void;
}

export default function DraggableContainer({ id: _id, defaultPosition = { x: 0, y: 0 }, fixed = false, children, onPositionChange }: Props) {
  const [pos, setPos] = useState(defaultPosition);
  const posRef = useRef(pos);
  posRef.current = pos;
  const prevDefault = useRef(defaultPosition);
  useEffect(() => {
    if (prevDefault.current.x !== defaultPosition.x || prevDefault.current.y !== defaultPosition.y) {
      prevDefault.current = defaultPosition;
      setPos(defaultPosition);
    }
  }, [defaultPosition.x, defaultPosition.y]);
  const onPositionChangeRef = useRef(onPositionChange);
  onPositionChangeRef.current = onPositionChange;
  const dragging = useRef(false);
  const startMouse = useRef({ x: 0, y: 0 });
  const startPos = useRef({ x: 0, y: 0 });

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
    const onUp = () => {
      dragging.current = false;
      onPositionChangeRef.current?.(posRef.current.x, posRef.current.y);
    };
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
      style={fixed ? { position: 'fixed', left: pos.x, top: pos.y, zIndex: 50, transition: 'none' } : { transform: `translate(${pos.x}px, ${pos.y}px)`, transition: 'none' }}
      onMouseDown={onMouseDown}
    >
      {children}
    </div>
  );
}
