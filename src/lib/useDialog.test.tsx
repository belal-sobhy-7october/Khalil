import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { useDialog } from './useDialog';

function Dialog({ title, onClose, children }: { title: string; onClose: () => void; children?: React.ReactNode }) {
  const dialog = useDialog(onClose);
  return (
    <div {...dialog.props}>
      <h2 id={dialog.titleId}>{title}</h2>
      {children}
    </div>
  );
}

describe('useDialog', () => {
  it('is announced as a dialog named by its title', () => {
    render(<Dialog title="Topic Library" onClose={() => {}} />);
    expect(screen.getByRole('dialog', { name: 'Topic Library' })).toHaveAttribute('aria-modal', 'true');
  });

  it('Escape closes only the topmost of stacked dialogs', () => {
    const outer = vi.fn();
    const inner = vi.fn();
    const { rerender } = render(
      <Dialog title="Outer" onClose={outer}>
        <Dialog title="Inner" onClose={inner} />
      </Dialog>
    );
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(inner).toHaveBeenCalledTimes(1);
    expect(outer).not.toHaveBeenCalled();
    rerender(<Dialog title="Outer" onClose={outer} />);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(outer).toHaveBeenCalledTimes(1);
  });
});
