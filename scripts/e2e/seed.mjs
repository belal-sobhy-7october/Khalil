// Deterministic seed data for the E2E scripts: ~6 weeks of habits, todos,
// focus sessions and wird, plus a few vocabulary words.
import { USER_ID } from './fakeSupabase.mjs';

const pad = (n) => String(n).padStart(2, '0');
export const dayStr = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
};
const uuid = (i) => `00000000-0000-4000-8000-${String(i).padStart(12, '0')}`;

export function buildSeed() {
  let seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const habits = [
    { id: uuid(101), user_id: USER_ID, name: 'القيام', icon: 'moon', sort_order: 0, active: true, start_date: dayStr(daysAgo(45)), schedule_days: null, created_at: Date.now() },
    { id: uuid(102), user_id: USER_ID, name: 'جزء الورد', icon: 'book-open', sort_order: 1, active: true, start_date: dayStr(daysAgo(30)), schedule_days: null, created_at: Date.now() },
    { id: uuid(103), user_id: USER_ID, name: 'الجيم', icon: 'dumbbell', sort_order: 2, active: true, start_date: dayStr(daysAgo(40)), schedule_days: [0, 2, 4], created_at: Date.now() },
    { id: uuid(104), user_id: USER_ID, name: 'تطوير الأنجلش', icon: 'globe', sort_order: 3, active: true, start_date: dayStr(daysAgo(20)), schedule_days: null, created_at: Date.now() },
  ];
  const habitEntries = [];
  let eid = 1000;
  for (const h of habits) {
    // Leave today unchecked so flows can toggle it.
    for (let i = 1; i < 45; i++) {
      const d = dayStr(daysAgo(i));
      if (d < h.start_date) continue;
      if (rand() < 0.65) habitEntries.push({ id: uuid(eid++), user_id: USER_ID, habit_id: h.id, date: d });
    }
  }
  const todos = [];
  for (let i = 0; i < 30; i++) {
    const n = 2 + Math.floor(rand() * 4);
    for (let k = 0; k < n; k++) {
      todos.push({ id: uuid(eid++), user_id: USER_ID, text: `Task ${i}-${k}`, completed: i === 0 ? k === 0 : rand() < 0.7, priority: 'medium', gate: 'daily', date: dayStr(daysAgo(i)), sort_order: k, created_at: daysAgo(i).toISOString(), updated_at: daysAgo(i).toISOString() });
    }
  }
  const vocabCats = [{ id: uuid(201), user_id: USER_ID, name: 'Call Center Interview', color: '#e8d5c4', icon: 'folder', created_at: daysAgo(10).toISOString(), updated_at: daysAgo(10).toISOString() }];
  const vocab = [
    ['Bargain', 'صفقة رابحة / بسعر مميز', 'This phone was a real bargain'],
    ['Ambitious', 'Having a strong wish to succeed.', 'He is ambitious and works hard'],
    ['Clumsy', 'Often dropping or breaking things.', 'I am clumsy and often drop things'],
    ['Compromise', 'An agreement where both sides accept less.', 'You need to compromise in marriage'],
    ['Escalation', 'Passing a problem to a supervisor.', "If I can't solve it, I'll raise an escalation."],
  ].map(([word, definition, ex], i) => ({
    id: uuid(300 + i), user_id: USER_ID, category_id: i > 2 ? uuid(201) : null, word, type: 'word', definition, example_sentence: ex,
    mastery_level: i % 4, review_count: i, lapse_count: i === 2 ? 2 : 0, correct_streak: 0, is_hard: false,
    created_at: daysAgo(i * 3).toISOString(), updated_at: daysAgo(i).toISOString(),
  }));
  const pomodoro = [];
  for (let i = 1; i < 28; i++) {
    const n = Math.floor(rand() * 6);
    for (let k = 0; k < n; k++) {
      const start = daysAgo(i);
      start.setHours(9 + k, 0, 0, 0);
      pomodoro.push({ id: uuid(eid++), user_id: USER_ID, started_at: start.toISOString(), ended_at: new Date(start.getTime() + 25 * 60000).toISOString(), minutes: 25, label: k % 2 ? 'Grammar' : null });
    }
  }
  const wird = [];
  const prayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
  for (let i = 1; i < 40; i++) {
    const p = {};
    for (const pr of prayers) p[pr] = rand() < 0.6 ? 'jamaah' : rand() < 0.7 ? 'alone' : null;
    wird.push({ user_id: USER_ID, date: dayStr(daysAgo(i)), data: { prayers: p, qiyam: [0, 2, 4, 8, 11][Math.floor(rand() * 5)], rawatib: { fajrBefore: rand() < 0.8, dhuhrBefore: rand() < 0.5, maghribAfter: rand() < 0.6 }, quran: [0, 0.25, 0.5, 1][Math.floor(rand() * 4)], adhkarAM: rand() < 0.7, adhkarPM: rand() < 0.5 } });
  }
  return {
    habits, habit_entries: habitEntries, todos, vocabulary_categories: vocabCats, vocabulary_items: vocab,
    pomodoro_sessions: pomodoro, wird_days: wird,
  };
}
