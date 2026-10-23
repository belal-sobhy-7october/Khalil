// A small in-memory stand-in for Supabase (auth + PostgREST) used by the E2E
// scripts. Writes are kept per browser context, so a reload shows what the app
// saved. Supports the subset of PostgREST the app uses: eq/gte/lte/like filters,
// order, limit/offset, single objects, insert, upsert (on_conflict), update
// and delete.
import crypto from 'node:crypto';

export const SUPA = 'http://localhost:54321';
export const USER_ID = '00000000-0000-4000-8000-000000000001';

const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
const exp = Math.floor(Date.now() / 1000) + 3600 * 24;
export const user = {
  id: USER_ID, aud: 'authenticated', role: 'authenticated', email: 'belal@example.com',
  user_metadata: { full_name: 'Belal' }, app_metadata: { provider: 'email' }, created_at: new Date().toISOString(),
};
const accessToken = `${b64({ alg: 'HS256', typ: 'JWT' })}.${b64({ sub: USER_ID, exp, role: 'authenticated', aud: 'authenticated', email: user.email })}.sig`;
export const session = { access_token: accessToken, refresh_token: 'refresh', token_type: 'bearer', expires_in: 86400, expires_at: exp, user };

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

/**
 * Creates a route handler bound to its own copy of `seed`. `log` collects every
 * write as { method, table, rows } so tests can assert on what was sent.
 */
export function createFakeSupabase(seed) {
  const tables = structuredClone(seed);
  const log = [];
  const handle = async (route) => {
    const req = route.request();
    const url = new URL(req.url());
    const method = req.method();
    if (url.pathname.startsWith('/auth/v1/user')) return route.fulfill({ json: user });
    if (url.pathname.startsWith('/auth/v1/token')) return route.fulfill({ json: session });
    if (url.pathname.startsWith('/auth/v1/')) return route.fulfill({ json: {} });
    if (!url.pathname.startsWith('/rest/v1/')) return route.fulfill({ status: 404, json: {} });
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

    if (method === 'POST') {
      const incoming = (Array.isArray(body) ? body : [body]).filter(Boolean);
      const conflict = url.searchParams.get('on_conflict')?.split(',');
      const merge = prefer.includes('resolution=merge-duplicates');
      const saved = [];
      for (const row of incoming) {
        const key = conflict ?? ['id'];
        const existing = rows.find((r) => key.every((k) => row[k] !== undefined && String(r[k]) === String(row[k])));
        if (existing) {
          if (!merge && !conflict) return route.fulfill({ status: 409, json: { code: '23505', message: `duplicate key value violates unique constraint on ${table}` } });
          Object.assign(existing, row, { updated_at: row.updated_at ?? now });
          saved.push(existing);
        } else {
          const full = { id: crypto.randomUUID(), created_at: now, updated_at: now, ...row };
          rows.push(full);
          saved.push(full);
        }
      }
      log.push({ method, table, rows: saved });
      return wantRows ? reply(saved, 201) : route.fulfill({ status: 201, body: '' });
    }
    if (method === 'PATCH') {
      const matched = applyFilters(rows, params);
      for (const r of matched) Object.assign(r, body);
      log.push({ method, table, rows: matched });
      return wantRows ? reply(matched) : route.fulfill({ status: 204, body: '' });
    }
    if (method === 'DELETE') {
      const matched = new Set(applyFilters(rows, params));
      tables[table] = rows.filter((r) => !matched.has(r));
      log.push({ method, table, rows: [...matched] });
      return wantRows ? reply([...matched]) : route.fulfill({ status: 204, body: '' });
    }
    return route.fulfill({ status: 405, json: {} });
  };
  return { handle, tables, log };
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
