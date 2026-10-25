// The load test: many of the seeded users (seed.sql) using Khalil at once,
// against the local stack (stack.sh), never a real project. Each simulated
// person opens the app (the same requests the real app sends at startup, from
// record.mjs), then does what people do — ticks tasks, prayers and habits,
// reviews flashcards, saves progress — with pauses in between, and leaves.
//
//   node scripts/load/run.mjs isolation            no user can read or change another's data
//   node scripts/load/run.mjs open 2000 60         2000 people open the app within 60 s
//   node scripts/load/run.mjs steady 500 120       500 people using it at once for 120 s
//   node scripts/load/run.mjs all                  isolation, then steady at 100…2000, then opens
//
// Options (env): REST (PostgREST, default http://127.0.0.1:54331), USERS (seeded, default 20000),
// THINK (mean seconds between a person's actions, default 10), OUT (a JSON file for the results).
import http from 'node:http';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import crypto from 'node:crypto';
import { userToken } from './jwt.mjs';
import { idOf, tierOf } from './users.mjs';

const REST = new URL(process.env.REST ?? 'http://127.0.0.1:54331');
const USERS = Number(process.env.USERS ?? 20000);
const THINK = Number(process.env.THINK ?? 10);
const agent = new http.Agent({ keepAlive: true, maxSockets: 2048 });

// ---- one request ------------------------------------------------------------

/** Sends a request as a user (or anonymous) and records how it went under `name`. */
function call(stats, name, method, path, { token, body, prefer } = {}) {
  const payload = body === undefined ? undefined : Buffer.from(JSON.stringify(body));
  const headers = { Accept: 'application/json', 'Accept-Profile': 'public' };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (payload) Object.assign(headers, { 'Content-Type': 'application/json', 'Content-Length': payload.length, 'Content-Profile': 'public' });
  if (prefer) headers.Prefer = prefer;
  const started = performance.now();
  return new Promise((resolve) => {
    const req = http.request({ host: REST.hostname, port: REST.port, path, method, headers, agent }, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        const buf = Buffer.concat(chunks);
        stats?.add(name, performance.now() - started, res.statusCode, buf.length);
        let json = null;
        try {
          json = buf.length ? JSON.parse(buf) : null;
        } catch {
          // not JSON
        }
        resolve({ status: res.statusCode, json, bytes: buf.length });
      });
    });
    req.on('error', (e) => {
      stats?.add(name, performance.now() - started, 0, 0, e.code);
      resolve({ status: 0, json: null, bytes: 0, error: e.code });
    });
    req.setTimeout(60000, () => req.destroy(Object.assign(new Error('timeout'), { code: 'TIMEOUT' })));
    if (payload) req.write(payload);
    req.end();
  });
}

// ---- results ----------------------------------------------------------------

class Stats {
  constructor() {
    this.by = new Map();
    this.started = performance.now();
  }
  add(name, ms, status, bytes, error) {
    let s = this.by.get(name);
    if (!s) this.by.set(name, (s = { times: [], errors: 0, statuses: {}, bytes: 0 }));
    s.times.push(ms);
    s.bytes += bytes;
    if (error || status >= 400 || status === 0) {
      s.errors++;
      const k = error ?? String(status);
      s.statuses[k] = (s.statuses[k] ?? 0) + 1;
    }
  }
  summary() {
    const secs = (performance.now() - this.started) / 1000;
    const rows = [...this.by].map(([name, s]) => ({ name, n: s.times.length, errors: s.errors, statuses: s.statuses, kb: s.bytes / 1024, ...pcts(s.times) }));
    const all = [...this.by.values()].flatMap((s) => s.times);
    const total = rows.reduce((t, r) => t + r.n, 0);
    const errors = rows.reduce((t, r) => t + r.errors, 0);
    return { seconds: secs, requests: total, rps: total / secs, errors, errorRate: total ? errors / total : 0, mb: rows.reduce((t, r) => t + r.kb, 0) / 1024, ...pcts(all), rows };
  }
}

function pcts(times) {
  if (!times.length) return { p50: 0, p95: 0, p99: 0, max: 0 };
  const s = Float64Array.from(times).sort();
  const at = (p) => s[Math.min(s.length - 1, Math.floor(p * s.length))];
  return { p50: at(0.5), p95: at(0.95), p99: at(0.99), max: s[s.length - 1] };
}

const ms = (v) => `${v < 10 ? v.toFixed(1) : Math.round(v)} ms`;

function print(title, sum, extra = '') {
  console.log(`\n=== ${title}${extra}`);
  console.log(
    `${sum.requests} requests in ${sum.seconds.toFixed(0)} s = ${sum.rps.toFixed(0)}/s · ${sum.mb.toFixed(0)} MB · errors ${sum.errors} (${(sum.errorRate * 100).toFixed(2)}%) · p50 ${ms(sum.p50)} · p95 ${ms(sum.p95)} · p99 ${ms(sum.p99)}`
  );
  const rows = [...sum.rows].sort((a, b) => b.p95 * b.n - a.p95 * a.n).slice(0, 12);
  for (const r of rows) {
    const errs = r.errors ? `  errors ${r.errors} ${JSON.stringify(r.statuses)}` : '';
    console.log(`  ${r.name.padEnd(28)} ${String(r.n).padStart(7)}  p50 ${ms(r.p50).padStart(8)}  p95 ${ms(r.p95).padStart(8)}  p99 ${ms(r.p99).padStart(8)}  ${(r.kb / r.n).toFixed(1).padStart(7)} KB${errs}`);
  }
}

// ---- server side ------------------------------------------------------------

const PSQL = ['-h', '127.0.0.1', '-p', '54322', '-U', 'postgres', '-d', 'postgres', '-At', '-F', '\t', '-c'];
const sql = (q) => execFileSync('psql', [...PSQL, q], { encoding: 'utf8' }).trim();

/** CPU seconds used so far by Postgres, PostgREST and this script. */
function cpu() {
  const tick = 100;
  const out = { postgres: 0, postgrest: 0, all: 0 };
  for (const pid of fs.readdirSync('/proc').filter((d) => /^\d+$/.test(d))) {
    try {
      const stat = fs.readFileSync(`/proc/${pid}/stat`, 'utf8');
      const comm = stat.slice(stat.indexOf('(') + 1, stat.lastIndexOf(')'));
      const f = stat.slice(stat.lastIndexOf(')') + 2).split(' ');
      const secs = (Number(f[11]) + Number(f[12])) / tick;
      if (comm === 'postgres') out.postgres += secs;
      else if (comm === 'postgrest') out.postgrest += secs;
    } catch {
      // the process ended
    }
  }
  const [user, nice, system, idle] = fs.readFileSync('/proc/stat', 'utf8').split('\n')[0].split(/\s+/).slice(1, 5).map(Number);
  out.all = (user + nice + system) / tick;
  out.idle = idle / tick;
  out.self = process.cpuUsage().user / 1e6 + process.cpuUsage().system / 1e6;
  return out;
}

function cpuReport(before, after, secs) {
  const pct = (a) => `${Math.round((a / secs) * 100)}%`;
  const busy = after.all - before.all;
  const idle = after.idle - before.idle;
  return `CPU (of 4 cores = 400%): Postgres ${pct(after.postgres - before.postgres)}, PostgREST ${pct(after.postgrest - before.postgrest)}, load generator ${pct(after.self - before.self)}; machine ${Math.round((busy / (busy + idle)) * 100)}% busy`;
}

function topQueries(limit = 8) {
  return sql(
    `select calls, round(total_exec_time)::int, round(mean_exec_time::numeric, 2), rows, left(regexp_replace(query, '\\s+', ' ', 'g'), 150)
     from pg_stat_statements where query not like '%pg_stat_statements%' and query not ilike 'set %' and query not ilike '%set_config%'
     order by total_exec_time desc limit ${limit}`
  )
    .split('\n')
    .filter(Boolean)
    .map((l) => {
      const [calls, total, mean, rows, query] = l.split('\t');
      return { calls: +calls, totalMs: +total, meanMs: +mean, rows: +rows, query };
    });
}

// ---- people -----------------------------------------------------------------

const rand = (n) => Math.floor(Math.random() * n);
const pick = (list) => list[rand(list.length)];
const sleep = (s) => new Promise((r) => setTimeout(r, s * 1000));
/** A pause like a person's between two actions: about THINK seconds, at least one (never past `until`). */
const think = (until) => sleep(Math.min(Math.max(1, -Math.log(1 - Math.random()) * THINK), Math.max(0, (until - performance.now()) / 1000)));
const today = new Date().toISOString().slice(0, 10);
const daysAgo = (n) => new Date(Date.now() - n * 864e5).toISOString().slice(0, 10);

/**
 * Who opens the app: people who use it more are online more. Of those online,
 * about half are heavy users, 4 in 10 medium and 1 in 10 light.
 */
function someone() {
  const tier = Math.random() < 0.5 ? 0 : Math.random() < 0.8 ? 1 : 2;
  for (;;) {
    const n = 1 + rand(USERS);
    if ((tier === 0 && tierOf(n) === 'heavy') || (tier === 1 && tierOf(n) === 'medium') || (tier === 2 && tierOf(n) === 'light')) return n;
  }
}

const enc = encodeURIComponent;

/** Pages of 1000 rows until a short one, as the app reads long lists. */
async function paged(stats, name, token, path) {
  const rows = [];
  for (let offset = 0; ; offset += 1000) {
    const r = await call(stats, name, 'GET', `${path}&offset=${offset}&limit=1000`, { token });
    if (!Array.isArray(r.json)) return rows;
    rows.push(...r.json);
    if (r.json.length < 1000) return rows;
  }
}

/** What the app sends when it opens (record.mjs): in parallel, as the browser does. */
async function openApp(stats, user) {
  const { id, token } = user;
  const u = `user_id=eq.${id}`;
  const kv = (key) => call(stats, 'open: user_kv key', 'GET', `/user_kv?select=value&${u}&key=eq.${enc(key)}`, { token });
  const list = (table, order) => call(stats, `open: ${table}`, 'GET', `/${table}?select=*&${u}&order=${order}`, { token });
  const [todos, , , , , entries, , , words, , , habits] = await Promise.all([
    paged(stats, 'open: todos', token, `/todos?select=*&${u}&order=sort_order.asc,id.asc`),
    paged(stats, 'open: sub_track_entries', token, `/sub_track_entries?select=*&${u}&order=date.asc,id.asc`),
    paged(stats, 'open: calendar_events', token, `/calendar_events?select=*&${u}&order=date.asc,id.asc`),
    paged(stats, 'open: daily_mood', token, `/daily_mood?select=*&${u}&order=date.asc,id.asc`),
    call(stats, 'open: daily_focus', 'GET', `/daily_focus?select=*&${u}&limit=1`, { token }),
    paged(stats, 'open: habit_entries', token, `/habit_entries?select=*&${u}&order=date.asc,id.asc`),
    list('life_categories', 'sort_order.asc'),
    list('sub_tracks', 'sort_order.asc'),
    paged(stats, 'open: vocabulary_items', token, `/vocabulary_items?select=*&${u}&order=created_at.asc,id.asc`),
    list('bookmarks', 'created_at.asc'),
    list('bookmark_categories', 'name.asc'),
    list('habits', 'sort_order.asc').then((r) => r.json ?? []),
    kv('appearance'),
    list('vocabulary_categories', 'name.asc'),
    paged(stats, 'open: wird_days (all)', token, `/wird_days?select=date,data&${u}&order=date.asc`),
    list('sticky_notes', 'sort_order.asc'),
    list('todo_notes', 'sort_order.asc'),
    paged(stats, 'open: user_kv srs:*', token, `/user_kv?select=key,value&${u}&key=like.${enc('srs:*')}&order=key.asc`),
    ...['srs-settings', 'tasks-settings', 'wird-items', 'habit-links', 'pomodoro-settings'].map(kv),
    call(stats, 'open: wird_days (weeks)', 'GET', `/wird_days?select=date,data&${u}&date=gte.${daysAgo(32)}&date=lte.${daysAgo(-5)}`, { token }),
    call(stats, 'open: pomodoro_sessions', 'GET', `/pomodoro_sessions?select=id,started_at,ended_at,minutes,label&${u}&started_at=gte.${daysAgo(400)}T00:00:00.000Z&order=started_at.asc`, { token }),
  ]);
  user.todos = todos;
  user.entries = entries;
  user.words = words;
  user.habits = habits;
}

/** One thing a person does, picked by how often people do it. */
const ACTIONS = [
  [25, 'tick a task', async (stats, u) => {
    const t = pick(u.todos);
    if (!t) return;
    t.completed = !t.completed;
    await call(stats, 'tick a task', 'PATCH', `/todos?id=eq.${t.id}`, { token: u.token, body: { completed: t.completed, updated_at: Date.now() } });
  }],
  [20, 'tick the wird', (stats, u) =>
    call(stats, 'tick the wird', 'POST', '/wird_days?on_conflict=user_id,date', {
      token: u.token, prefer: 'resolution=merge-duplicates',
      body: { user_id: u.id, date: today, data: { prayers: { fajr: 'jamaah', dhuhr: pick(['jamaah', 'alone']) }, quran: 0.25 * rand(5), adhkarAM: true }, updated_at: new Date().toISOString() },
    })],
  [15, 'tick a habit', async (stats, u) => {
    const h = pick(u.habits);
    if (!h) return;
    const done = u.entries.find((e) => e.habit_id === h.id && e.date === today);
    if (done) {
      await call(stats, 'tick a habit', 'DELETE', `/habit_entries?id=eq.${done.id}`, { token: u.token });
      u.entries = u.entries.filter((e) => e !== done);
    } else {
      const entry = { id: crypto.randomUUID(), user_id: u.id, habit_id: h.id, date: today };
      const r = await call(stats, 'tick a habit', 'POST', '/habit_entries', { token: u.token, body: entry });
      if (r.status < 300) u.entries.push(entry);
    }
  }],
  [15, 'review 5 flashcards', async (stats, u) => {
    for (let i = 0; i < 5 && u.words.length; i++) {
      const w = pick(u.words);
      const now = new Date().toISOString();
      await Promise.all([
        call(stats, 'review: vocabulary_items', 'PATCH', `/vocabulary_items?id=eq.${w.id}`, { token: u.token, body: { mastery_level: rand(6), review_count: (w.review_count ?? 0) + 1, last_reviewed_at: now, updated_at: now } }),
        call(stats, 'review: user_kv srs', 'POST', '/user_kv?on_conflict=user_id,key', {
          token: u.token, prefer: 'resolution=merge-duplicates',
          body: { user_id: u.id, key: `srs:${w.id}`, value: { due: daysAgo(-3), stability: 4.2, difficulty: 5.1, reps: 3, lapses: 0, state: 2, last_review: now }, updated_at: now },
        }),
      ]);
      await sleep(2 + Math.random() * 4);
    }
  }],
  [10, 'open the tasks page', (stats, u) =>
    call(stats, 'tasks page: wird_days', 'GET', `/wird_days?select=date,data&user_id=eq.${u.id}&date=gte.${daysAgo(32)}&date=lte.${daysAgo(-5)}`, { token: u.token })],
  [8, 'save lesson progress', (stats, u) =>
    call(stats, 'save progress: user_kv', 'POST', '/user_kv?on_conflict=user_id,key', {
      token: u.token, prefer: 'resolution=merge-duplicates',
      body: { user_id: u.id, key: 'english-course-progress', value: Object.fromEntries(Array.from({ length: 80 + rand(300) }, (_, i) => [`lesson-${i}`, today])), updated_at: new Date().toISOString() },
    })],
  [4, 'add a task', async (stats, u) => {
    const r = await call(stats, 'add a task', 'POST', '/todos', {
      token: u.token, prefer: 'return=representation',
      body: { id: crypto.randomUUID(), user_id: u.id, gate: 'daily', text: 'New task', date: today, sort_order: 999, priority: 'medium', created_at: Date.now(), updated_at: Date.now() },
    });
    if (Array.isArray(r.json)) u.todos.push(...r.json);
  }],
  [3, 'open analytics', (stats, u) =>
    Promise.all([
      call(stats, 'analytics: user_kv', 'GET', `/user_kv?select=value&user_id=eq.${u.id}&key=eq.english-practice-log`, { token: u.token }),
      call(stats, 'analytics: wird_days', 'GET', `/wird_days?select=date,data&user_id=eq.${u.id}&date=gte.${daysAgo(180)}&date=lte.${today}`, { token: u.token }),
    ])],
];
const WEIGHT = ACTIONS.reduce((t, [w]) => t + w, 0);
function action() {
  let r = Math.random() * WEIGHT;
  for (const a of ACTIONS) if ((r -= a[0]) < 0) return a;
  return ACTIONS[0];
}

/** A person's visit: open the app, do 5–15 things with pauses, leave. */
async function visit(stats, until) {
  const n = someone();
  const id = idOf(n);
  const user = { n, id, token: userToken(id) };
  await openApp(stats, user);
  for (let k = 5 + rand(11); k > 0 && performance.now() < until; k--) {
    await think(until);
    if (performance.now() >= until) break;
    await action()[2](stats, user);
  }
}

// ---- scenarios --------------------------------------------------------------

/** `people` visits at the same time for `seconds`; each one that ends is replaced by someone else. */
async function steady(people, seconds) {
  const stats = new Stats();
  sql('select pg_stat_statements_reset()');
  const before = cpu();
  const until = performance.now() + seconds * 1000;
  let visits = 0;
  await Promise.all(
    Array.from({ length: people }, async (_, i) => {
      await sleep((i / people) * Math.min(20, seconds / 4)); // arrive over the first seconds, not all in the same millisecond
      while (performance.now() < until) {
        await visit(stats, until);
        visits++;
      }
    })
  );
  const sum = stats.summary();
  sum.cpu = cpuReport(before, cpu(), sum.seconds);
  sum.top = topQueries();
  sum.visits = visits;
  print(`steady: ${people} people at once for ${seconds} s`, sum, ` (${visits} visits)`);
  console.log(`  ${sum.cpu}`);
  return sum;
}

/** `people` open the app within `seconds` (a morning peak): how long does the app take to load? */
async function opens(people, seconds) {
  const stats = new Stats();
  const appTimes = [];
  sql('select pg_stat_statements_reset()');
  const before = cpu();
  await Promise.all(
    Array.from({ length: people }, async (_, i) => {
      await sleep((i / people) * seconds);
      const n = someone();
      const user = { n, id: idOf(n), token: userToken(idOf(n)) };
      const t0 = performance.now();
      await openApp(stats, user);
      appTimes.push(performance.now() - t0);
    })
  );
  const sum = stats.summary();
  sum.cpu = cpuReport(before, cpu(), sum.seconds);
  sum.appOpen = pcts(appTimes);
  sum.top = topQueries();
  print(`opens: ${people} people open the app within ${seconds} s`, sum);
  console.log(`  whole app loaded: p50 ${ms(sum.appOpen.p50)} · p95 ${ms(sum.appOpen.p95)} · p99 ${ms(sum.appOpen.p99)} · max ${ms(sum.appOpen.max)}`);
  console.log(`  ${sum.cpu}`);
  return sum;
}

/** No one can read, change or delete another person's rows, or act without signing in. */
async function isolation(pairs = 200) {
  const failures = [];
  const check = (ok, what) => ok || failures.push(what);
  for (let i = 0; i < pairs; i++) {
    const a = idOf(1 + rand(USERS));
    const bn = 10 * (1 + rand(USERS / 10)); // a heavy user: has rows of everything
    const b = idOf(bn);
    if (a === b) continue;
    const ta = userToken(a);
    const tb = userToken(b);
    const own = await call(null, '', 'GET', `/todos?select=id&user_id=eq.${b}&limit=1`, { token: tb });
    const target = own.json?.[0]?.id;
    check(target, `user ${bn} can't read their own todos`);
    for (const table of ['todos', 'habit_entries', 'wird_days', 'user_kv', 'vocabulary_items', 'pomodoro_sessions', 'calendar_events', 'habits']) {
      const r = await call(null, '', 'GET', `/${table}?select=*&user_id=eq.${b}&limit=5`, { token: ta });
      check(r.status === 200 && Array.isArray(r.json) && r.json.length === 0, `${table}: user A read ${r.json?.length} rows of user B (status ${r.status})`);
    }
    if (target) {
      const p = await call(null, '', 'PATCH', `/todos?id=eq.${target}`, { token: ta, body: { text: 'hacked' }, prefer: 'return=representation' });
      check(Array.isArray(p.json) && p.json.length === 0, `PATCH another's todo changed ${p.json?.length} rows`);
      const d = await call(null, '', 'DELETE', `/todos?id=eq.${target}`, { token: ta, prefer: 'return=representation' });
      check(Array.isArray(d.json) && d.json.length === 0, `DELETE another's todo removed ${d.json?.length} rows`);
      const still = await call(null, '', 'GET', `/todos?select=text&id=eq.${target}`, { token: tb });
      check(still.json?.length === 1 && still.json[0].text !== 'hacked', "another user's todo was changed or deleted");
    }
    const ins = await call(null, '', 'POST', '/todos', { token: ta, body: { user_id: b, gate: 'daily', text: 'planted', date: today } });
    check(ins.status === 403 || ins.status === 401, `INSERT a todo for another user returned ${ins.status}`);
    const kv = await call(null, '', 'POST', '/user_kv?on_conflict=user_id,key', { token: ta, prefer: 'resolution=merge-duplicates', body: { user_id: b, key: 'tasks-settings', value: {} } });
    check(kv.status === 403 || kv.status === 401, `UPSERT another user's settings returned ${kv.status}`);
  }
  for (const table of ['todos', 'user_kv', 'wird_days', 'vocabulary_items']) {
    const r = await call(null, '', 'GET', `/${table}?select=*&limit=5`);
    check(r.status === 200 && Array.isArray(r.json) && r.json.length === 0, `${table}: anonymous read ${r.json?.length} rows (status ${r.status})`);
  }
  const anonInsert = await call(null, '', 'POST', '/todos', { body: { user_id: idOf(10), gate: 'daily', text: 'anon' } });
  check(anonInsert.status === 401 || anonInsert.status === 403, `anonymous INSERT returned ${anonInsert.status}`);
  const forged = await call(null, '', 'GET', `/todos?select=id&limit=1`, { token: userToken(idOf(10)).replace(/.$/, (c) => (c === 'A' ? 'B' : 'A')) });
  check(forged.status === 401, `a forged token got status ${forged.status}`);
  console.log(`\n=== isolation: ${pairs} pairs of users, 8 tables, reads/updates/deletes/inserts across users, anonymous and forged tokens`);
  console.log(failures.length ? `✗ ${failures.length} failure(s):\n- ${[...new Set(failures)].slice(0, 20).join('\n- ')}` : '✓ no user could read, change or delete another user\'s data');
  return { pairs, failures: [...new Set(failures)] };
}

// ---- main -------------------------------------------------------------------

const [scenario = 'all', a, b] = process.argv.slice(2);
const results = { at: new Date().toISOString(), users: USERS, think: THINK, runs: [] };
const save = () => process.env.OUT && fs.writeFileSync(process.env.OUT, JSON.stringify(results, null, 2));
const record = (kind, args, sum) => {
  results.runs.push({ kind, args, ...sum, rows: sum.rows?.map(({ name, n, errors, statuses, kb, p50, p95, p99 }) => ({ name, n, errors, statuses, kb, p50, p95, p99 })) });
  save();
};

if (scenario === 'isolation' || scenario === 'all') record('isolation', [], await isolation());
if (scenario === 'steady') record('steady', [+a, +b], await steady(Number(a ?? 500), Number(b ?? 120)));
if (scenario === 'open') record('open', [+a, +b], await opens(Number(a ?? 1000), Number(b ?? 60)));
if (scenario === 'all') {
  for (const people of [100, 250, 500, 1000, 2000]) record('steady', [people, 90], await steady(people, 90));
  for (const [people, secs] of [[500, 60], [1000, 60], [2000, 60]]) record('open', [people, secs], await opens(people, secs));
}
agent.destroy();
