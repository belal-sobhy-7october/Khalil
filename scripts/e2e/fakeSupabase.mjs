// A small in-memory stand-in for Supabase (auth + PostgREST) used by the E2E
// scripts. Writes are kept per browser context, so a reload shows what the app
// saved. Supports the subset of PostgREST the app uses: eq/gte/lte/like filters,
// order, limit/offset, single objects, insert, upsert (on_conflict), update
// and delete, and the `app_startup` function (with what its migration adds:
// the server's `updated_at` on the four synced tables and their deletions).
import crypto from 'node:crypto';

export const SUPA = 'http://localhost:54321';
export const USER_ID = '00000000-0000-4000-8000-000000000001';

const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
const exp = Math.floor(Date.now() / 1000) + 3600 * 24;
export const user = {
  id: USER_ID, aud: 'authenticated', role: 'authenticated', email: 'belal@example.com',
  // An account made long ago: a new one gets Khalil's tour (App.tsx), which would cover the screens under test.
  user_metadata: { full_name: 'Belal' }, app_metadata: { provider: 'email' }, created_at: '2026-06-01T09:00:00.000Z',
};
const accessToken = `${b64({ alg: 'HS256', typ: 'JWT' })}.${b64({ sub: USER_ID, exp, role: 'authenticated', aud: 'authenticated', email: user.email })}.sig`;
export const session = { access_token: accessToken, refresh_token: 'refresh', token_type: 'bearer', expires_in: 86400, expires_at: exp, user };

// A guest: the anonymous account Khalil opens for a visitor (src/lib/guest.ts).
export const GUEST_ID = '00000000-0000-4000-8000-0000000000a1';
export const guestUser = {
  id: GUEST_ID, aud: 'authenticated', role: 'authenticated', email: '', is_anonymous: true,
  user_metadata: {}, app_metadata: { provider: 'anonymous', providers: [] }, created_at: new Date().toISOString(),
};
const guestToken = `${b64({ alg: 'HS256', typ: 'JWT' })}.${b64({ sub: GUEST_ID, exp, role: 'authenticated', aud: 'authenticated', is_anonymous: true })}.sig`;
export const guestSession = { access_token: guestToken, refresh_token: 'guest-refresh', token_type: 'bearer', expires_in: 86400, expires_at: exp, user: guestUser };

function parseValue(raw) {
  if (raw === 'null') return null;
  if (raw === 'true') return true;
  if (raw === 'false') return false;
  return raw;
}

function compare(a, b) {
  if (a === b) return 0;
  if (a === null || a === undefined) return -1;
  if (b === null || b === undefined) return 1;
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a).localeCompare(String(b));
}

function applyFilters(rows, params) {
  let out = rows;
  for (const [col, expr] of params) {
    if (['select', 'order', 'limit', 'offset', 'on_conflict', 'columns'].includes(col)) continue;
    const dot = expr.indexOf('.');
    const op = expr.slice(0, dot);
    const value = parseValue(decodeURIComponent(expr.slice(dot + 1)));
    out = out.filter((r) => {
      const v = r[col];
      switch (op) {
        case 'eq': return String(v) === String(value) || v === value;
        case 'neq': return String(v) !== String(value);
        case 'gte': return compare(v, value) >= 0;
        case 'lte': return compare(v, value) <= 0;
        case 'gt': return compare(v, value) > 0;
        case 'lt': return compare(v, value) < 0;
        case 'is': return v === value;
        case 'in': return value.replace(/^\(|\)$/g, '').split(',').map((s) => s.replace(/^"|"$/g, '')).includes(String(v));
        case 'like':
        case 'ilike': {
          // PostgREST takes * (or %) as the wildcard.
          const re = new RegExp(`^${String(value).replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/[*%]/g, '.*')}$`, op === 'ilike' ? 'i' : '');
          return re.test(String(v ?? ''));
        }
        default: throw new Error(`fake supabase: unsupported filter ${op}`);
      }
    });
  }
  return out;
}

function applyOrder(rows, order) {
  if (!order) return rows;
  const keys = order.split(',').map((part) => {
    const [col, dir = 'asc'] = part.split('.');
    return { col, desc: dir === 'desc' };
  });
  return [...rows].sort((a, b) => {
    for (const k of keys) {
      const c = compare(a[k.col], b[k.col]);
      if (c) return k.desc ? -c : c;
    }
    return 0;
  });
}

// The lists the app keeps on the device, and each row's key
// (supabase/migrations/20261025120000_sync_and_startup.sql).
const SYNCED = {
  vocabulary_items: (r) => r.id,
  user_kv: (r) => r.key,
  wird_days: (r) => r.date,
  habit_entries: (r) => `${r.habit_id}|${r.date}`,
};

/** `app_startup`, as the migration defines it, over the fake's tables (one user, so no filtering by user). */
function appStartup(tables, { since = null, kv_keys = [] } = {}) {
  const sinceMs = since ? Date.parse(since) : NaN;
  const after = sinceMs > Date.now() - 60 * 86400e3 ? new Date(sinceMs - 120e3).toISOString() : null;
  const list = (t, order) => applyOrder(tables[t] ?? [], order);
  const changed = (t, order) => list(t, order).filter((r) => !after || (r.updated_at ?? '') > after);
  return {
    now: new Date().toISOString(),
    full: !after,
    focus: list('daily_focus'),
    todos: list('todos', 'sort_order.asc,id.asc'),
    life_categories: list('life_categories', 'sort_order.asc'),
    sub_tracks: list('sub_tracks', 'sort_order.asc'),
    habits: list('habits', 'sort_order.asc'),
    vocabulary_categories: list('vocabulary_categories', 'name.asc'),
    sticky_notes: list('sticky_notes', 'sort_order.asc'),
    todo_notes: list('todo_notes', 'sort_order.asc'),
    kv: Object.fromEntries((tables.user_kv ?? []).filter((r) => kv_keys.includes(r.key)).map((r) => [r.key, r.value])),
    words: changed('vocabulary_items', 'created_at.asc,id.asc'),
    srs: changed('user_kv').filter((r) => r.key.startsWith('srs:')).map((r) => ({ key: r.key, value: r.value })),
    habit_entries: changed('habit_entries', 'date.asc,id.asc'),
    wird: changed('wird_days', 'date.asc').map((r) => ({ date: r.date, data: r.data })),
    deleted: after ? (tables.sync_deletions ?? []).filter((d) => d.deleted_at > after).map((d) => ({ source: d.source, key: d.row_key })) : [],
  };
}

/**
 * Creates a route handler bound to its own copy of `seed`. `log` collects every
 * write as { method, table, rows } (and each app_startup call, as 'RPC') so tests
 * can assert on what was sent; `reads` every GET as { table, query }.
 */
export function createFakeSupabase(seed, { startup = true, anonymous = true } = {}) {
  const tables = structuredClone(seed);
  const log = [];
  const reads = [];
  // Sign-ins: anonymous ('signup'), linking Google to a guest ('link') and Google itself ('oauth').
  const auth = [];
  const handle = async (route) => {
    const req = route.request();
    const url = new URL(req.url());
    const method = req.method();
    const asGuest = (req.headers()['authorization'] ?? '').includes(guestToken);
    if (url.pathname === '/auth/v1/signup' && method === 'POST') {
      auth.push({ kind: 'signup' });
      if (!anonymous) return route.fulfill({ status: 422, json: { code: 422, error_code: 'anonymous_provider_disabled', msg: 'Anonymous sign-ins are disabled' } });
      return route.fulfill({ json: guestSession });
    }
    if (url.pathname === '/auth/v1/user/identities/authorize') {
      auth.push({ kind: 'link', provider: url.searchParams.get('provider'), guest: asGuest });
      return route.fulfill({ json: { url: `${SUPA}/fake-google?link=1` } });
    }
    if (url.pathname === '/auth/v1/authorize' || url.pathname === '/fake-google') {
      if (url.pathname === '/auth/v1/authorize') auth.push({ kind: 'oauth', provider: url.searchParams.get('provider') });
      return route.fulfill({ contentType: 'text/html', body: '<!doctype html><title>Google</title><h1>Google</h1>' });
    }
    if (url.pathname.startsWith('/auth/v1/user')) return route.fulfill({ json: asGuest ? guestUser : user });
    if (url.pathname.startsWith('/auth/v1/token')) return route.fulfill({ json: (req.postData() ?? '').includes('guest-refresh') ? guestSession : session });
    if (url.pathname.startsWith('/auth/v1/')) return route.fulfill({ json: {} });
    if (!url.pathname.startsWith('/rest/v1/')) return route.fulfill({ status: 404, json: {} });
    if (url.pathname === '/rest/v1/rpc/app_startup') {
      // Without the migration, PostgREST answers that the function doesn't exist.
      if (!startup) return route.fulfill({ status: 404, json: { code: 'PGRST202', message: 'Could not find the function public.app_startup(kv_keys, since) in the schema cache' } });
      let args = {};
      try {
        args = JSON.parse(req.postData() ?? '{}') ?? {};
      } catch {
        // no arguments
      }
      log.push({ method: 'RPC', table: 'app_startup', rows: [args] });
      return route.fulfill({ json: appStartup(tables, args) });
    }
    const table = url.pathname.replace('/rest/v1/', '');
    const headers = req.headers();
    const accept = headers['accept'] ?? '';
    const prefer = headers['prefer'] ?? '';
    const single = accept.includes('vnd.pgrst.object');
    const params = [...url.searchParams.entries()];
    const rows = (tables[table] ??= []);

    const reply = (list, status = 200) => {
      if (single) {
        if (list.length !== 1 && !prefer.includes('missing=null')) {
          return list.length === 0
            ? route.fulfill({ status: 406, json: { code: 'PGRST116', message: 'JSON object requested, multiple (or no) rows returned', details: 'The result contains 0 rows' } })
            : route.fulfill({ status: 406, json: { code: 'PGRST116', message: 'multiple rows' } });
        }
        return route.fulfill({ status, json: list[0] ?? null });
      }
      return route.fulfill({ status, json: list, headers: { 'content-range': `0-${Math.max(0, list.length - 1)}/${list.length}` } });
    };

    if (method === 'GET' || method === 'HEAD') {
      reads.push({ table, query: url.search });
      let list = applyOrder(applyFilters(rows, params), url.searchParams.get('order'));
      const offset = Number(url.searchParams.get('offset') ?? 0);
      const limit = url.searchParams.get('limit');
      list = list.slice(offset, limit ? offset + Number(limit) : undefined);
      if (single && list.length === 0 && accept.includes('vnd.pgrst.object')) {
        // maybeSingle() sends the same Accept header and treats 406/PGRST116 as "no row".
        return reply(list);
      }
      return reply(list);
    }

    let body;
    try {
      body = JSON.parse(req.postData() ?? 'null');
    } catch {
      body = null;
    }
    const wantRows = prefer.includes('return=representation');
    const now = new Date().toISOString();
    // The migration's trigger: the server's clock, whatever the app sent.
    const stamp = (row) => {
      if (SYNCED[table]) row.updated_at = now;
      return row;
    };

    if (method === 'POST') {
      const incoming = (Array.isArray(body) ? body : [body]).filter(Boolean);
      const conflict = url.searchParams.get('on_conflict')?.split(',');
      const merge = prefer.includes('resolution=merge-duplicates');
      const ignore = prefer.includes('resolution=ignore-duplicates');
      const saved = [];
      for (const row of incoming) {
        const key = conflict ?? ['id'];
        const existing = rows.find((r) => key.every((k) => row[k] !== undefined && String(r[k]) === String(row[k])));
        if (existing) {
          if (ignore) continue; // ON CONFLICT DO NOTHING
          if (!merge && !conflict) return route.fulfill({ status: 409, json: { code: '23505', message: `duplicate key value violates unique constraint on ${table}` } });
          stamp(Object.assign(existing, row, { updated_at: row.updated_at ?? now }));
          saved.push(existing);
        } else {
          const full = stamp({ id: crypto.randomUUID(), created_at: now, updated_at: now, ...row });
          rows.push(full);
          saved.push(full);
        }
      }
      log.push({ method, table, rows: saved });
      return wantRows ? reply(saved, 201) : route.fulfill({ status: 201, body: '' });
    }
    if (method === 'PATCH') {
      const matched = applyFilters(rows, params);
      for (const r of matched) stamp(Object.assign(r, body));
      log.push({ method, table, rows: matched });
      return wantRows ? reply(matched) : route.fulfill({ status: 204, body: '' });
    }
    if (method === 'DELETE') {
      const matched = new Set(applyFilters(rows, params));
      tables[table] = rows.filter((r) => !matched.has(r));
      if (SYNCED[table]) {
        (tables.sync_deletions ??= []).push(...[...matched].map((r) => ({ source: table, row_key: SYNCED[table](r), deleted_at: now })));
      }
      log.push({ method, table, rows: [...matched] });
      return wantRows ? reply([...matched]) : route.fulfill({ status: 204, body: '' });
    }
    return route.fulfill({ status: 405, json: {} });
  };
  return { handle, tables, log, reads, auth };
}

/** Fake dictionaryapi.dev so Quick add can fill in definitions offline. */
export function fakeDictionary(route) {
  const url = new URL(route.request().url());
  const word = decodeURIComponent(url.pathname.split('/').pop() ?? '');
  if (/^zzz/.test(word)) return route.fulfill({ status: 404, json: { title: 'No Definitions Found' } });
  return route.fulfill({
    json: [{
      word,
      phonetics: [{ text: '/test/' }],
      meanings: [{ partOfSpeech: 'verb', definitions: [{ definition: `Definition of ${word}.`, example: `I ${word} every day.` }] }],
    }],
  });
}
