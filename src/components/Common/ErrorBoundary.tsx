import { Component, type ErrorInfo, type ReactNode } from 'react';

interface State {
  error: Error | null;
}

// Last line of defence: a render error anywhere shows a way out instead of a
// blank page. Text is bilingual because translations live in the store,
// which may be what broke.
export default class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled UI error:', error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-paper">
        <div className="max-w-sm w-full bg-card border border-border-subtle rounded-2xl p-6 text-center space-y-3">
          <p className="text-ink font-semibold">حدث خطأ غير متوقع — Something went wrong</p>
          <p className="text-sm text-ink-light">بياناتك محفوظة. Your data is safe.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-clay-soft hover:bg-clay-soft-dark text-white rounded-lg transition-colors"
          >
            إعادة التحميل — Reload
          </button>
        </div>
      </div>
    );
  }
}
