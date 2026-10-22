/**
 * YouGlish Modal Component
 * 
 * Note: YouGlish free widget usage is subject to their terms:
 * https://youglish.com/terms
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Loader2, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { buildYouGlishUrl, type YouGlishAccent, youglishQuery } from '../../lib/pronunciation';
import { useDialog } from '../../lib/useDialog';

// Minimal TypeScript types for YouGlish widget
declare global {
  interface Window {
    YG?: {
      Widget: new (containerId: string, options: YGWidgetOptions) => YGWidget;
    };
    onYouglishAPIReady?: () => void;
  }
}

interface YGWidgetOptions {
  width: number;
  components: number;
  events: {
    onFetchDone?: (event: { totalResult?: number }) => void;
    onVideoChange?: (event: unknown) => void;
    onError?: (error: unknown) => void;
  };
}

interface YGWidget {
  fetch: (query: string, language: string, accent?: string) => void;
  close?: () => void;
}

type WidgetState = 'loading' | 'loaded' | 'error' | 'no-results';

interface YouGlishModalProps {
  word: string;
  onClose: () => void;
  /** Step through a list of words without closing (the widget re-searches on each). */
  nav?: { index: number; total: number; onPrev: () => void; onNext: () => void };
}

const SCRIPT_SRC = 'https://youglish.com/public/emb/widget.js';
const LOAD_TIMEOUT_MS = 15000;

// The widget script is loaded once per page and kept: re-adding it on every
// modal open is slow and YouGlish only fires onYouglishAPIReady the first time.
let apiPromise: Promise<void> | null = null;

function loadYouGlishApi(): Promise<void> {
  if (window.YG) return Promise.resolve();
  if (apiPromise) return apiPromise;
  apiPromise = new Promise<void>((resolve, reject) => {
    window.onYouglishAPIReady = () => resolve();
    const script = document.createElement('script');
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onerror = () => {
      apiPromise = null;
      script.remove();
      reject(new Error('Failed to load YouGlish'));
    };
    document.head.appendChild(script);
  });
  return apiPromise;
}

export default function YouGlishModal({ word, onClose, nav }: YouGlishModalProps) {
  // "résumé / CV" finds nothing on YouGlish; search "resume".
  const query = youglishQuery(word);
  const { t } = useTranslation();
  const [accent, setAccent] = useState<YouGlishAccent>('us');
  const [widgetState, setWidgetState] = useState<WidgetState>('loading');
  const widgetRef = useRef<YGWidget | null>(null);
  // React owns this host but never its children: the YouGlish widget replaces
  // the element it's given with its own iframe. Handing it a React-rendered
  // node made React's unmount try to remove a node that was gone, which
  // crashed the whole app (blank page) when the modal was closed.
  const hostRef = useRef<HTMLDivElement>(null);

  // Create the widget once the API is ready, then re-fetch on every accent
  // change. The container is always mounted (the spinner overlays it), so the
  // widget has somewhere to render before its first fetch completes.
  useEffect(() => {
    let cancelled = false;
    const timeout = window.setTimeout(() => {
      if (!cancelled) setWidgetState((s) => (s === 'loading' ? 'error' : s));
    }, LOAD_TIMEOUT_MS);

    loadYouGlishApi()
      .then(() => {
        if (cancelled || !window.YG || !hostRef.current) return;
        if (!widgetRef.current) {
          const mount = document.createElement('div');
          mount.id = `youglish-widget-${Math.random().toString(36).slice(2)}`;
          hostRef.current.replaceChildren(mount);
          widgetRef.current = new window.YG.Widget(mount.id, {
            width: 640,
            components: 9,
            events: {
              onFetchDone: (event) => {
                setWidgetState(event?.totalResult === 0 ? 'no-results' : 'loaded');
              },
              onError: () => setWidgetState('error'),
            },
          });
        }
        widgetRef.current.fetch(query, 'english', accent);
      })
      .catch(() => {
        if (!cancelled) setWidgetState('error');
      });

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [query, accent]);

  useEffect(() => {
    const host = hostRef.current;
    return () => {
      try {
        widgetRef.current?.close?.();
      } catch {
        // the widget may already be torn down
      }
      widgetRef.current = null;
      // Drop the iframe ourselves so the video stops immediately.
      host?.replaceChildren();
    };
  }, []);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  const handleAccentChange = useCallback((newAccent: YouGlishAccent) => {
    setWidgetState('loading');
    setAccent(newAccent);
  }, []);

  const fallbackUrl = buildYouGlishUrl(query, accent);

  const dialog = useDialog(onClose);

  return (
    <div
      className="fixed inset-0 bg-ink/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div {...dialog.props} className="bg-card border border-border-subtle rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border-subtle flex items-center justify-between">
          <h2 id={dialog.titleId} className="text-xl font-bold text-ink">{t('vocabulary.youglishTitle')}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-ink/5 rounded-lg transition-colors"
            aria-label={t('common.close')}
          >
            <X size={20} className="text-ink-light" />
          </button>
        </div>

        {/* Accent Toggle */}
        <div className="px-6 py-3 border-b border-border-subtle flex items-center gap-2 flex-wrap">
          <span className="text-sm text-ink-light">{t('vocabulary.accent')}:</span>
          <button
            onClick={() => handleAccentChange('us')}
            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
              accent === 'us'
                ? 'bg-clay-soft text-white'
                : 'bg-ink/5 text-ink hover:bg-ink/10'
            }`}
          >
            {t('vocabulary.accentUS')}
          </button>
          <button
            onClick={() => handleAccentChange('uk')}
            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
              accent === 'uk'
                ? 'bg-clay-soft text-white'
                : 'bg-ink/5 text-ink hover:bg-ink/10'
            }`}
          >
            {t('vocabulary.accentUK')}
          </button>
          <button
            onClick={() => handleAccentChange('aus')}
            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
              accent === 'aus'
                ? 'bg-clay-soft text-white'
                : 'bg-ink/5 text-ink hover:bg-ink/10'
            }`}
          >
            {t('vocabulary.accentAUS')}
          </button>
        </div>

        {/* Content */}
        <div className="relative flex-1 overflow-auto p-6 min-h-[360px]">
          <div
            ref={hostRef}
            className={`w-full ${widgetState === 'loaded' ? '' : 'invisible h-0 overflow-hidden'}`}
          />

          {widgetState === 'loading' && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 size={40} className="text-clay-soft animate-spin mb-4" />
              <p className="text-ink-light">{t('vocabulary.loadingYouGlish')}</p>
            </div>
          )}

          {(widgetState === 'error' || widgetState === 'no-results') && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-ink mb-4">
                {t(widgetState === 'error' ? 'vocabulary.youglishError' : 'vocabulary.youglishNoResults')}
              </p>
              <a
                href={fallbackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-clay-soft text-white rounded-lg hover:bg-clay-soft-dark transition-colors"
              >
                <ExternalLink size={16} />
                <span>{t('vocabulary.openOnYouGlish')}</span>
              </a>
            </div>
          )}
        </div>

        {nav && (
          <div className="px-6 py-3 border-t border-border-subtle flex items-center justify-between gap-3" dir="ltr">
            <button
              onClick={nav.onPrev}
              disabled={nav.index === 0}
              aria-label="Previous word"
              className="p-2 rounded-lg bg-ink/5 text-ink hover:bg-ink/10 disabled:opacity-30"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="text-center min-w-0">
              <div className="font-semibold text-ink truncate">{word}</div>
              <div className="text-xs text-ink-light tabular-nums">
                {nav.index + 1} / {nav.total}
              </div>
            </div>
            <button
              onClick={nav.onNext}
              disabled={nav.index === nav.total - 1}
              aria-label="Next word"
              className="p-2 rounded-lg bg-clay-soft text-white hover:bg-clay-soft-dark disabled:opacity-30"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
