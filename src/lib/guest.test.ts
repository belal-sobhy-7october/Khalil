import { afterEach, describe, expect, it } from 'vitest';
import type { Session } from '@supabase/supabase-js';
import { askForAccount, isCrawler, isGuestSession, takeAuthRedirectError, useGuest } from './guest';

afterEach(() => {
  window.history.replaceState(null, '', '/');
  useGuest.setState({ browsing: false, dialog: null });
});

describe('isCrawler', () => {
  it('knows search engines and link previews', () => {
    expect(isCrawler('Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)')).toBe(true);
    expect(isCrawler('Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm) Chrome/116.0 Safari/537.36')).toBe(true);
    expect(isCrawler('facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)')).toBe(true);
    expect(isCrawler('WhatsApp/2.23.20.0')).toBe(true);
  });

  it('takes people for people, a Cubot phone too', () => {
    expect(isCrawler('Mozilla/5.0 (Linux; Android 14; SM-S921B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Mobile Safari/537.36')).toBe(false);
    expect(isCrawler('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1')).toBe(false);
    expect(isCrawler('Mozilla/5.0 (Linux; Android 10; CUBOT X30) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36')).toBe(false);
  });
});

describe('isGuestSession', () => {
  it('is true for an anonymous account only', () => {
    expect(isGuestSession({ user: { id: 'g', is_anonymous: true } } as Session)).toBe(true);
    expect(isGuestSession({ user: { id: 'u', is_anonymous: false } } as Session)).toBe(false);
    expect(isGuestSession(null)).toBe(false);
  });
});

describe('takeAuthRedirectError', () => {
  it('reads the code Supabase sent back and removes it from the address', () => {
    window.history.replaceState(null, '', '/?tab=1#error=server_error&error_code=identity_already_exists&error_description=Identity+is+already+linked');
    expect(takeAuthRedirectError()).toBe('identity_already_exists');
    expect(window.location.search).toBe('?tab=1');
    expect(window.location.hash).toBe('');
  });

  it('is null after a normal visit', () => {
    window.history.replaceState(null, '', '/?tab=1');
    expect(takeAuthRedirectError()).toBeNull();
    expect(window.location.search).toBe('?tab=1');
  });
});

describe('askForAccount', () => {
  it('asks someone browsing with no account to create one, and returns what the caller returns', () => {
    useGuest.setState({ browsing: true });
    expect(askForAccount({ success: false })).toEqual({ success: false });
    expect(useGuest.getState().dialog).toBe('signup');
  });

  it('stays quiet while the app is still opening (not browsing)', () => {
    expect(askForAccount()).toBeUndefined();
    expect(useGuest.getState().dialog).toBeNull();
  });
});
