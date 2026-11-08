/**
 * Using Khalil before signing up. A visitor opens the app as a guest: an
 * anonymous Supabase account, so everything works and saves as usual, but only
 * in this browser. "Create an account" links Google to that same account, so
 * nothing is lost; "Sign in" opens an account made before, and what the guest
 * did stays behind.
 *
 * Without anonymous sign-ins (switched off in Supabase, the hourly limit
 * reached, or no internet) the guest still browses every page, and nothing is
 * saved until they sign in. Search engines get the welcome page (LoginPage).
 */
import { create } from 'zustand';
import type { Session } from '@supabase/supabase-js';
import { supabase } from './supabase';

/** Search engines and link previews: they get the welcome page, not a new account. */
const CRAWLER =
  /googlebot|google-inspectiontool|storebot-google|adsbot-google|mediapartners-google|bingbot|bingpreview|yandex|duckduckbot|baiduspider|applebot|slurp|petalbot|facebookexternalhit|twitterbot|linkedinbot|slackbot|discordbot|telegrambot|whatsapp|pinterest|ahrefsbot|semrushbot|mj12bot|dotbot|bytespider|gptbot|oai-searchbot|chatgpt-user|claudebot|claude-user|perplexitybot|ccbot|amazonbot|chrome-lighthouse|crawler|spider/i;

export function isCrawler(userAgent = typeof navigator === 'undefined' ? '' : navigator.userAgent): boolean {
  return CRAWLER.test(userAgent);
}

/** A guest's account: made without signing up, kept in this browser. */
export function isGuestSession(session: Session | null | undefined): boolean {
  return !!session?.user?.is_anonymous;
}

/** Opens a guest account. False when Supabase refuses (anonymous sign-ins off, limit reached) or can't be reached. */
export async function startGuest(): Promise<boolean> {
  try {
    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) console.warn('[guest] anonymous sign-in unavailable:', error.message);
    return !error && !!data.session;
  } catch (err) {
    console.warn('[guest] anonymous sign-in failed:', err);
    return false;
  }
}

const redirectTo = () => window.location.origin;

/** Signs in with Google: an existing account, or a new one. */
export async function signInWithGoogle(): Promise<boolean> {
  const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: redirectTo() } });
  if (error) console.error('[auth] sign-in failed:', error.message);
  return !error;
}

/**
 * Creates an account. A guest's Google account is linked to the guest account,
 * so what they did stays; if linking is off in Supabase, it signs in instead.
 */
export async function signUpWithGoogle(): Promise<boolean> {
  const { data } = await supabase.auth.getSession();
  if (isGuestSession(data.session)) {
    const { error } = await supabase.auth.linkIdentity({ provider: 'google', options: { redirectTo: redirectTo() } });
    if (!error) return true;
    console.warn('[auth] linking Google to the guest account failed, signing in instead:', error.message);
  }
  return signInWithGoogle();
}

/**
 * What Supabase sent back after Google, when it went wrong: the code (e.g.
 * `identity_already_exists`, when that Google account already has a Khalil
 * account). Removes it from the address.
 */
export function takeAuthRedirectError(): string | null {
  if (typeof window === 'undefined') return null;
  const { search, hash, pathname } = window.location;
  const params = new URLSearchParams(search);
  const hashParams = new URLSearchParams(hash.replace(/^#/, ''));
  const code = params.get('error_code') ?? hashParams.get('error_code') ?? params.get('error') ?? hashParams.get('error');
  if (!code) return null;
  for (const key of ['error', 'error_code', 'error_description']) {
    params.delete(key);
    hashParams.delete(key);
  }
  const rest = params.toString();
  const restHash = hashParams.toString();
  window.history.replaceState(window.history.state, '', `${pathname}${rest ? `?${rest}` : ''}${restHash ? `#${restHash}` : ''}`);
  return code;
}

// ── What the account buttons show ─────────────────────────────────────────

export type AuthDialogMode = 'signup' | 'signin' | 'exists';

interface GuestState {
  /** Browsing with no account at all (no guest account could be made): nothing is saved. */
  browsing: boolean;
  /** The open account dialog, if any. */
  dialog: AuthDialogMode | null;
  openDialog: (mode: AuthDialogMode) => void;
  closeDialog: () => void;
}

export const useGuest = create<GuestState>((set) => ({
  browsing: false,
  dialog: null,
  openDialog: (dialog) => set({ dialog }),
  closeDialog: () => set({ dialog: null }),
}));

/**
 * Something can't be saved for lack of an account. Someone browsing with no
 * account is asked to create one; returns `value` (what the caller returns).
 */
export function askForAccount<T = void>(value?: T): T {
  const guest = useGuest.getState();
  if (guest.browsing && !guest.dialog) guest.openDialog('signup');
  return value as T;
}
