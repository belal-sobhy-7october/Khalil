// HS256 tokens like Supabase's: PostgREST checks them with the same secret.
import crypto from 'node:crypto';

/** The local stack's JWT secret (never a real project's). */
export const JWT_SECRET = 'khalil-local-load-test-secret-not-for-production-use';

const b64url = (b) => Buffer.from(b).toString('base64url');

export function sign(payload, secret = JWT_SECRET) {
  const head = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = b64url(JSON.stringify(payload));
  const mac = crypto.createHmac('sha256', secret).update(`${head}.${body}`).digest('base64url');
  return `${head}.${body}.${mac}`;
}

export function verify(token, secret = JWT_SECRET) {
  const [head, body, mac] = String(token).split('.');
  if (!mac) return null;
  const want = crypto.createHmac('sha256', secret).update(`${head}.${body}`).digest('base64url');
  if (want.length !== mac.length || !crypto.timingSafeEqual(Buffer.from(want), Buffer.from(mac))) return null;
  const claims = JSON.parse(Buffer.from(body, 'base64url').toString());
  return claims.exp && claims.exp * 1000 < Date.now() ? null : claims;
}

/** A signed-in user's access token, valid for an hour (Supabase's default). */
export function userToken(userId, email = `${userId}@load.test`) {
  const now = Math.floor(Date.now() / 1000);
  return sign({ sub: userId, email, role: 'authenticated', aud: 'authenticated', iat: now, exp: now + 3600 });
}

/** The anon key the app is built with. */
export const ANON_KEY = sign({ role: 'anon', iss: 'supabase', iat: 1700000000, exp: 4100000000 });
