import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { useAppStore } from '../../store/appStore';
import ResourcesModal from './ResourcesModal';
import { ENGLISH_RESOURCES } from '../../data/englishResources';
import { normalizeUrl } from '../../lib/resourcesApi';

vi.mock('../../lib/supabase', async () => {
  const mod = await import('../../test/mockSupabase');
  return { supabase: mod.mockSupabase };
});

const api = vi.hoisted(() => ({
  fetchRatingSummaries: vi.fn(),
  fetchMySuggestions: vi.fn(),
  rateResource: vi.fn(),
  addSuggestion: vi.fn(),
  deleteSuggestion: vi.fn(),
}));
vi.mock('../../lib/resourcesApi', async (orig) => ({
  ...(await orig<typeof import('../../lib/resourcesApi')>()),
  ...api,
}));

beforeEach(() => {
  Object.values(api).forEach((f) => f.mockReset());
  api.fetchRatingSummaries.mockResolvedValue(new Map([['talkpal', { average: 4, count: 2 }]]));
  api.fetchMySuggestions.mockResolvedValue([]);
  api.rateResource.mockResolvedValue(true);
  useAppStore.setState({
    language: 'en',
    session: { user: { id: 'u1' } } as unknown as ReturnType<typeof useAppStore.getState>['session'],
  });
});

describe('ResourcesModal', () => {
  it.each(['en', 'ar'] as const)('lists every resource with a link and no missing translations (%s)', async (language) => {
    useAppStore.setState({ language });
    render(<ResourcesModal onClose={() => {}} />);
    for (const r of ENGLISH_RESOURCES) {
      expect(screen.getByRole('link', { name: r.name })).toHaveAttribute('href', r.url);
    }
    await screen.findByText('4.0 (2)');
    expect(document.body.textContent).not.toMatch(/\bvocabulary\.[a-zA-Z.]+/);
  });

  it('rating a resource saves it and updates the average', async () => {
    render(<ResourcesModal onClose={() => {}} />);
    await screen.findByText('4.0 (2)');
    const group = screen.getByRole('radiogroup', { name: 'Your rating Talkpal' });
    fireEvent.click(within(group).getByRole('radio', { name: '1' }));
    expect(api.rateResource).toHaveBeenCalledWith('talkpal', 'u1', 1);
    expect(screen.getByText('3.0 (3)')).toBeInTheDocument();
  });

  it('validates and sends a suggestion', async () => {
    api.addSuggestion.mockResolvedValue({ id: 's1', name: 'Speechling', url: 'https://speechling.com/', description: null, category: null, createdAt: '' });
    render(<ResourcesModal onClose={() => {}} />);
    fireEvent.click(await screen.findByRole('button', { name: /Suggest one/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Send suggestion' }));
    expect(screen.getByText('Please enter a name and a valid link.')).toBeInTheDocument();
    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'Speechling' } });
    fireEvent.change(screen.getByPlaceholderText('https://…'), { target: { value: 'speechling.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Send suggestion' }));
    await waitFor(() => expect(api.addSuggestion).toHaveBeenCalledWith('u1', expect.objectContaining({ url: 'https://speechling.com/' })));
    expect(await screen.findByText('Under review')).toBeInTheDocument();
  });

  it('hides ratings gracefully when the tables do not exist yet', async () => {
    api.fetchRatingSummaries.mockResolvedValue(null);
    render(<ResourcesModal onClose={() => {}} />);
    expect(await screen.findByText(/once the database update is applied/)).toBeInTheDocument();
  });
});

describe('normalizeUrl', () => {
  it('adds https and rejects non-URLs', () => {
    expect(normalizeUrl('talkpal.ai')).toBe('https://talkpal.ai/');
    expect(normalizeUrl('http://x.com/a')).toBe('http://x.com/a');
    expect(normalizeUrl('not a url')).toBeNull();
    expect(normalizeUrl('javascript:alert(1)')).toBeNull();
  });
});
