import { create } from 'zustand';

/**
 * Always-on-top floating window for the timer.
 * Uses the Document Picture-in-Picture API (Chrome/Edge/Brave/Opera) so it
 * floats over every app; returns null where unsupported.
 */
interface DocumentPiP {
  requestWindow(opts: { width: number; height: number }): Promise<Window>;
  window: Window | null;
}

export function documentPipSupported(): boolean {
  return typeof window !== 'undefined' && 'documentPictureInPicture' in window;
}

export async function openFloatingWindow(width = 280, height = 200): Promise<Window | null> {
  if (!documentPipSupported()) return null;
  const api = (window as unknown as { documentPictureInPicture: DocumentPiP }).documentPictureInPicture;
  const pip = await api.requestWindow({ width, height });
  // Bring the app's styles and theme along.
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      const css = Array.from(sheet.cssRules).map((r) => r.cssText).join('\n');
      const style = pip.document.createElement('style');
      style.textContent = css;
      pip.document.head.appendChild(style);
    } catch {
      if (sheet.href) {
        const link = pip.document.createElement('link');
        link.rel = 'stylesheet';
        link.href = sheet.href;
        pip.document.head.appendChild(link);
      }
    }
  }
  pip.document.documentElement.className = document.documentElement.className;
  for (const attr of Array.from(document.documentElement.attributes)) {
    if (attr.name.startsWith('data-') || attr.name === 'dir' || attr.name === 'lang') {
      pip.document.documentElement.setAttribute(attr.name, attr.value);
    }
  }
  return pip;
}

/** The open floating window (if any), shared app-wide so it survives navigation. */
export const useFloatingWindow = create<{ win: Window | null; open: () => Promise<void>; close: () => void }>((set, get) => ({
  win: null,
  open: async () => {
    if (get().win) return;
    try {
      const w = await openFloatingWindow();
      if (!w) return;
      w.addEventListener('pagehide', () => set({ win: null }));
      set({ win: w });
    } catch {
      set({ win: null });
    }
  },
  close: () => {
    get().win?.close();
    set({ win: null });
  },
}));
