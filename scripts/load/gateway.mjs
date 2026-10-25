// A stand-in for Supabase's API gateway, so the real app can run against the
// local stack: /rest/v1/* goes to PostgREST, and /auth/v1 answers the few
// calls supabase-js makes for a saved session (the user, a token refresh).
// Sign-in itself isn't simulated: sessions are minted with jwt.mjs.
import http from 'node:http';
import { userToken, verify } from './jwt.mjs';

const PORT = Number(process.env.GATEWAY_PORT ?? 54321);
const REST = process.env.POSTGREST_URL ?? 'http://127.0.0.1:54331';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, prefer, range, accept-profile, content-profile, x-client-info, x-supabase-api-version',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
  'Access-Control-Expose-Headers': 'content-range, x-supabase-api-version',
};

function send(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json', ...cors });
  res.end(JSON.stringify(body));
}

const userOf = (claims) => ({ id: claims.sub, aud: 'authenticated', role: 'authenticated', email: claims.email, app_metadata: { provider: 'email' }, user_metadata: {} });

async function readBody(req) {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  return Buffer.concat(chunks);
}

http
  .createServer(async (req, res) => {
    const url = new URL(req.url, 'http://local');
    if (req.method === 'OPTIONS') {
      // A preflight: allow whatever headers the client asks for, as Supabase's gateway does.
      res.writeHead(204, { ...cors, 'Access-Control-Allow-Headers': req.headers['access-control-request-headers'] ?? cors['Access-Control-Allow-Headers'] });
      return res.end();
    }
    if (url.pathname.startsWith('/rest/v1/')) {
      const body = ['GET', 'HEAD'].includes(req.method) ? undefined : await readBody(req);
      const headers = { ...req.headers };
      delete headers.host;
      const r = await fetch(`${REST}${url.pathname.slice('/rest/v1'.length)}${url.search}`, { method: req.method, headers, body });
      const out = Buffer.from(await r.arrayBuffer());
      const pass = Object.fromEntries([...r.headers].filter(([k]) => !['content-length', 'transfer-encoding', 'connection', 'content-encoding'].includes(k) && !k.startsWith('access-control-')));
      res.writeHead(r.status, { ...pass, ...cors });
      return res.end(out);
    }
    if (url.pathname === '/auth/v1/user') {
      const claims = verify((req.headers.authorization ?? '').replace(/^Bearer /, ''));
      return claims ? send(res, 200, userOf(claims)) : send(res, 401, { message: 'invalid JWT' });
    }
    if (url.pathname === '/auth/v1/token' && url.searchParams.get('grant_type') === 'refresh_token') {
      // Refresh tokens here are the user's id: enough for a local test, never for real use.
      const { refresh_token: id } = JSON.parse((await readBody(req)).toString() || '{}');
      if (!id) return send(res, 400, { message: 'no refresh token' });
      const access = userToken(id);
      const claims = verify(access);
      return send(res, 200, { access_token: access, token_type: 'bearer', expires_in: 3600, expires_at: claims.exp, refresh_token: id, user: userOf(claims) });
    }
    if (url.pathname === '/auth/v1/logout') return send(res, 204, {});
    send(res, 404, { message: `not in the local gateway: ${url.pathname}` });
  })
  .listen(PORT, '127.0.0.1', () => console.log(`gateway on http://127.0.0.1:${PORT} → ${REST}`));
