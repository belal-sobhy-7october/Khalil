/**
 * Call Center Prep and Sales Prep are closed for now, on the owner's request,
 * while Learn Skills is rebuilt around the essential skills with people who
 * master them. Only the accounts below open them; everyone else finds them
 * among the skills still to come, and their addresses open Learn Skills.
 *
 * The repo is public, so an account is kept as the SHA-256 hash of its email
 * (trimmed, lowercase), never the email itself:
 *   node -e "console.log(require('crypto').createHash('sha256').update('EMAIL').digest('hex'))"
 */
import { useEffect, useState } from 'react';
import { useAppStore } from '../store/appStore';

/** The sections closed for now. */
export const CLOSED_SECTIONS: readonly string[] = ['callcenter', 'sales'];

const OPEN_FOR = new Set(['221e2355021a4f56dc91dcb52db769ef4f0f41c6bed319dadcb32e715d6a3934']);

/** In development only, this opens them on any account (the e2e scripts set it). */
export const PREVIEW_KEY = 'khalil-closed-skills-preview';

export async function emailHash(email: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(email.trim().toLowerCase()));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
}

function preview(): boolean {
  if (!import.meta.env.DEV) return false;
  try {
    return localStorage.getItem(PREVIEW_KEY) === '1';
  } catch {
    return false;
  }
}

const checked = new Map<string, Promise<boolean>>();

/** Whether this email opens the closed sections. */
export function opensClosedSkills(email: string | null | undefined): Promise<boolean> {
  if (preview()) return Promise.resolve(true);
  if (!email || !globalThis.crypto?.subtle) return Promise.resolve(false);
  let result = checked.get(email);
  if (!result) {
    result = emailHash(email).then((hash) => OPEN_FOR.has(hash), () => false);
    checked.set(email, result);
  }
  return result;
}

/** Whether the signed-in account opens Call Center Prep and Sales Prep (null while that is checked). */
export function useClosedSkillsAccess(): boolean | null {
  const email = useAppStore((s) => s.session?.user?.email ?? null);
  const [answer, setAnswer] = useState<{ email: string | null; open: boolean } | null>(null);
  useEffect(() => {
    let current = true;
    void opensClosedSkills(email).then((open) => {
      if (current) setAnswer({ email, open });
    });
    return () => {
      current = false;
    };
  }, [email]);
  return answer && answer.email === email ? answer.open : null;
}

export const isClosedSection = (section: string) => CLOSED_SECTIONS.includes(section);
