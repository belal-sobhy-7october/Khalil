import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { useAppStore } from '../../store/appStore';
import { translations } from '../../i18n/translations';
import { LANGUAGES, SKILLS, SKILL_GROUPS, hubOf } from '../../data/learnCatalog';
import Sidebar from '../Layout/Sidebar';
import LanguagesHub from './LanguagesHub';
import SkillsHub from './SkillsHub';
import { SKILL_ICONS } from './icons';
import { HubCrumb } from './ui';

// Whether this account opens Call Center and Sales (closed for now, src/lib/skillAccess.ts).
const access = vi.hoisted(() => ({ open: false as boolean | null }));
vi.mock('../../lib/skillAccess', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../lib/skillAccess')>()),
  useClosedSkillsAccess: () => access.open,
}));

vi.mock('../../lib/supabase', async () => {
  const mod = await import('../../test/mockSupabase');
  return { supabase: mod.mockSupabase };
});
vi.mock('../../lib/userKv', () => ({
  readLocalKv: (_k: string, f: unknown) => f,
  loadKv: vi.fn(async (_u: string, _k: string, f: unknown) => f),
  saveKv: vi.fn(async () => true),
}));

beforeEach(() => {
  access.open = false;
  localStorage.clear();
  useAppStore.setState({ language: 'en', session: { user: { id: 'u1', email: 'someone@example.com' } } as never, vocabularyItems: [] });
});

describe('the catalog', () => {
  it('has English open and ten languages coming', () => {
    expect(LANGUAGES.filter((l) => l.section).map((l) => l.id)).toEqual(['english']);
    expect(LANGUAGES.filter((l) => !l.section).map((l) => l.id)).toEqual(
      expect.arrayContaining(['german', 'french', 'spanish'])
    );
    expect(LANGUAGES.filter((l) => !l.section)).toHaveLength(10);
  });

  it('has Call Center and Sales open and 24 skills coming, programming, automation, visual identity and design among them', () => {
    expect(SKILLS.filter((s) => s.section).map((s) => s.section)).toEqual(['callcenter', 'sales']);
    const soon = SKILLS.filter((s) => !s.section).map((s) => s.id);
    expect(soon).toHaveLength(24);
    expect(soon).toEqual(expect.arrayContaining(['programming', 'automation', 'visualIdentity', 'design']));
  });

  it('has unique ids, an icon for every skill and every group in use', () => {
    expect(new Set(LANGUAGES.map((l) => l.id)).size).toBe(LANGUAGES.length);
    expect(new Set(SKILLS.map((s) => s.id)).size).toBe(SKILLS.length);
    for (const s of SKILLS) expect(SKILL_ICONS[s.id], s.id).toBeDefined();
    for (const g of SKILL_GROUPS) expect(SKILLS.some((s) => s.group === g), g).toBe(true);
  });

  it('names everything in both languages', () => {
    for (const language of ['en', 'ar'] as const) {
      const learn = translations[language].learn;
      for (const l of LANGUAGES) {
        const entry = (learn.language as Record<string, { name: string; parts?: string }>)[l.id];
        expect(entry?.name, `${language} ${l.id}`).toBeTruthy();
        if (l.section) expect(entry?.parts, `${language} ${l.id} parts`).toBeTruthy();
      }
      for (const s of SKILLS) {
        const entry = (learn.skill as Record<string, { name: string; blurb: string }>)[s.id];
        expect(entry?.name && entry.blurb, `${language} ${s.id}`).toBeTruthy();
      }
      for (const g of SKILL_GROUPS) expect(learn.group[g], `${language} ${g}`).toBeTruthy();
    }
  });

  it('knows which hub each section lives in', () => {
    expect(hubOf('vocabulary')).toBe('languages');
    expect(hubOf('languages')).toBe('languages');
    expect(hubOf('callcenter')).toBe('skills');
    expect(hubOf('sales')).toBe('skills');
    expect(hubOf('todo')).toBeNull();
  });
});

describe('the sidebar', () => {
  const nav = (activeSection = 'todo', onSectionChange = vi.fn()) => {
    render(<Sidebar activeSection={activeSection} onSectionChange={onSectionChange} isOpen onToggle={() => {}} />);
    return onSectionChange;
  };

  it('has Learn Languages and Learn Skills instead of English, Call Center and Sales, for every account', () => {
    const go = nav();
    expect(screen.queryByRole('button', { name: 'Learn English' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Call Center Prep' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Sales Prep' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Learn Languages' }));
    fireEvent.click(screen.getByRole('button', { name: 'Learn Skills' }));
    expect(go.mock.calls.map((c) => c[0])).toEqual(['languages', 'skills']);
  });

  it('marks the hub of the section you are in', () => {
    nav('sales');
    expect(screen.getByRole('button', { name: 'Learn Skills' }).className).toContain('border-clay-soft');
    expect(screen.getByRole('button', { name: 'Learn Languages' }).className).not.toContain('border-clay-soft');
  });
});

describe.each(['en', 'ar'] as const)('the hubs (%s)', (language) => {
  beforeEach(() => useAppStore.setState({ language }));
  const noRawKeys = () => expect(document.body.textContent).not.toMatch(/\blearn\.[a-zA-Z_.]+/);

  it('Learn Languages opens English; the other languages are coming soon', () => {
    const go = vi.fn();
    render(<LanguagesHub onNavigate={go} />);
    noRawKeys();
    fireEvent.click(screen.getByRole('button', { name: new RegExp(language === 'en' ? 'English' : 'الإنجليزي') }));
    expect(go).toHaveBeenCalledWith('vocabulary');
    const soon = screen.getByRole('region', { name: new RegExp(language === 'en' ? 'Coming soon' : 'قريبًا') });
    expect(within(soon).getAllByRole('listitem')).toHaveLength(10);
    expect(within(soon).queryAllByRole('button')).toHaveLength(0);
    expect(within(soon).getByText('Deutsch')).toBeInTheDocument();
  });

  it('Learn Skills shows Call Center and Sales among the skills to come, for every other account', () => {
    const go = vi.fn();
    render(<SkillsHub onNavigate={go} />);
    noRawKeys();
    expect(screen.queryByRole('region', { name: new RegExp(language === 'en' ? 'Open now' : 'متاح الآن') })).not.toBeInTheDocument();
    const soon = screen.getByRole('region', { name: new RegExp(language === 'en' ? 'Coming soon' : 'قريبًا') });
    expect(within(soon).getAllByRole('listitem')).toHaveLength(26);
    expect(within(soon).getByText(language === 'en' ? 'Call Center Prep' : 'الاستعداد لمراكز الاتصال بالإنجليزية')).toBeInTheDocument();
    expect(within(soon).queryAllByRole('button')).toHaveLength(0);
  });

  it('Learn Skills opens Call Center and Sales for the accounts that have them; the other skills are coming soon', () => {
    access.open = true;
    const go = vi.fn();
    render(<SkillsHub onNavigate={go} />);
    noRawKeys();
    fireEvent.click(screen.getByRole('button', { name: new RegExp(language === 'en' ? 'Call Center Prep' : 'الاستعداد لمراكز الاتصال بالإنجليزية') }));
    fireEvent.click(screen.getByRole('button', { name: new RegExp(language === 'en' ? 'Sales Prep' : 'تعلّم المبيعات') }));
    expect(go.mock.calls.map((c) => c[0])).toEqual(['callcenter', 'sales']);
    const soon = screen.getByRole('region', { name: new RegExp(language === 'en' ? 'Coming soon' : 'قريبًا') });
    expect(within(soon).getAllByRole('listitem')).toHaveLength(24);
    expect(within(soon).queryAllByRole('button')).toHaveLength(0);
  });

  it('a section in a hub leads back to it', () => {
    const go = vi.fn();
    render(<HubCrumb section="callcenter" onNavigate={go} />);
    fireEvent.click(screen.getByRole('button', { name: language === 'en' ? 'Learn Skills' : 'تعلم المهارات' }));
    expect(go).toHaveBeenCalledWith('skills');
  });
});
