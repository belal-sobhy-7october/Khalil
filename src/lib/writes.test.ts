import { afterEach, describe, expect, it, vi } from 'vitest';
import { isDataWrite, onDataWrite, trackingFetch } from './writes';

const REST = 'https://abc.supabase.co/rest/v1';

afterEach(() => vi.unstubAllGlobals());

describe('isDataWrite', () => {
  it('counts table writes and writing functions', () => {
    expect(isDataWrite(`${REST}/todos`, 'POST')).toBe(true);
    expect(isDataWrite(`${REST}/todos?id=eq.1`, 'PATCH')).toBe(true);
    expect(isDataWrite(`${REST}/todos?id=eq.1`, 'DELETE')).toBe(true);
    expect(isDataWrite(`${REST}/rpc/move_todo_item`, 'POST')).toBe(true);
  });

  it('leaves out reads, the startup request and sign-in', () => {
    expect(isDataWrite(`${REST}/todos?select=*`, 'GET')).toBe(false);
    expect(isDataWrite(`${REST}/rpc/app_startup`, 'POST')).toBe(false);
    expect(isDataWrite('https://abc.supabase.co/auth/v1/signup', 'POST')).toBe(false);
    expect(isDataWrite('https://abc.supabase.co/auth/v1/token?grant_type=refresh_token', 'POST')).toBe(false);
  });
});

describe('trackingFetch', () => {
  it('tells the listeners after a write that went through, not after a read or a refused write', async () => {
    const heard = vi.fn();
    const stop = onDataWrite(heard);
    const replies = [new Response('', { status: 201 }), new Response('[]'), new Response('', { status: 401 })];
    vi.stubGlobal('fetch', vi.fn(async () => replies.shift()));
    await trackingFetch(`${REST}/todos`, { method: 'POST', body: '{}' });
    expect(heard).toHaveBeenCalledTimes(1);
    await trackingFetch(`${REST}/todos?select=*`, { method: 'GET' });
    await trackingFetch(`${REST}/todos`, { method: 'POST', body: '{}' });
    expect(heard).toHaveBeenCalledTimes(1);
    stop();
  });
});
