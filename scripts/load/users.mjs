// The seeded users (scripts/load/seed.sql): user n's id and how much it uses Khalil.
import crypto from 'node:crypto';

/** md5('khalil-load-user-' || n)::uuid, as the seed makes it. */
export function idOf(n) {
  const h = crypto.createHash('md5').update(`khalil-load-user-${n}`).digest('hex');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

export const tierOf = (n) => (n % 10 === 0 ? 'heavy' : [1, 2, 3].includes(n % 10) ? 'medium' : 'light');
