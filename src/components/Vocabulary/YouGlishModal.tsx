/**
 * YouGlish Modal Component
 * 
 * Note: YouGlish free widget usage is subject to their terms:
 * https://youglish.com/terms
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Loader2, ExternalLink } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { buildYouGlishUrl, type YouGlishAccent } from '../../lib/pronunciation';

// Minimal TypeScript types for YouGlish widget
declare global {
  interface Window {
    YG?: {
      Widget: new (containerId: string, options: YGWidgetOptions) => YGWidget;
    };
  }
}

interface YGWidgetOptions {
  width: number;
  components: number;
  events: {
    onFetchDone?: (data: unknown) => void;
    onVideoChange?: (data: unknown) => void;
    onError?: (error: unknown) => void;
  };
}

interface YGWidget {
  fetch: (query: string, language: string, accent: string) => void;
}

type WidgetState = 'idle' | 'loading' | 'loaded' | 'error' | 'no-results';

interface YouGlishModalProps {
  word: string;
  onClose: () => void;
}

export default function YouGlishModal({ word, onClose }: YouGlishModalProps) {
  const { t } = useTranslation();
  const [accent, setAccent] = useState<YouGlishAccent>('us');
  const [widgetState, setWidgetState] = useState<WidgetState>('loading');
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<YGWidget | null>(null);

  // Load YouGlish widget script lazily
  useEffect(() => {
    if (scriptLoaded) return;

    const script = document.createElement('script');
    script.src = 'https://youglish.com/public/emb/widget.js';
    script.async = true;
    script.onload = () => {
      setScriptLoaded(true);
    };
    script.onerror = () => {
      setWidgetState('error');
    };

    document.head.appendChild(script);

    return () => {
      // Clean up script on unmount
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [scriptLoaded]);

  // Initialize widget when script is loaded and container is ready
  useEffect(() => {
    if (!scriptLoaded || !containerRef.current || widgetRef.current) return;

    if (!window.YG) {
      // Use setTimeout to avoid synchronous state update in effect
      setTimeout(() => setWidgetState('error'), 0);
      return;
    }

    try {
      const widget = new window.YG.Widget(containerRef.current.id, {
        width: 640,
        components: 9,
        events: {
          onFetchDone: () => {
            setWidgetState('loaded');
          },
          onVideoChange: () => {
            // Video changed, widget is working
          },
          onError: () => {
            setWidgetState('error');
          },
        },
      });

      widgetRef.current = widget;
      widget.fetch(word, 'english', accent);
    } catch (error) {
      console.error('Failed to initialize YouGlish widget:', error);
      setTimeout(() => setWidgetState('error'), 0);
    }
  }, [scriptLoaded, word, accent]);

  // Re-fetch when accent changes
  useEffect(() => {
    if (widgetRef.current && widgetState === 'loaded') {
      setWidgetState('loading');
      widgetRef.current.fetch(word, 'english', accent);
    }
  }, [accent, word, widgetState]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  const handleAccentChange = useCallback((newAccent: YouGlishAccent) => {
    setAccent(newAccent);
  }, []);

  const fallbackUrl = buildYouGlishUrl(word, accent);

  return (
    <div
      className="fixed inset-0 bg-ink/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-card border border-border-subtle rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border-subtle flex items-center justify-between">
          <h2 className="text-xl font-bold text-ink">{t('vocabulary.youglishTitle')}</h2>
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
          <span className="text-sm text-ink-light">{t('vocabulary.accentUS')}:</span>
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
        <div className="flex-1 overflow-auto p-6">
          {widgetState === 'loading' && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 size={40} className="text-clay-soft animate-spin mb-4" />
              <p className="text-ink-light">{t('vocabulary.loadingYouGlish')}</p>
            </div>
          )}

          {widgetState === 'error' && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-ink mb-4">{t('vocabulary.youglishError')}</p>
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

          {widgetState === 'no-results' && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-ink mb-4">{t('vocabulary.youglishNoResults')}</p>
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

          {widgetState === 'loaded' && (
            <div id="youglish-widget" ref={containerRef} className="w-full" />
          )}
        </div>
      </div>
    </div>
  );
}
