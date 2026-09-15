# Khalil (خليل)

Khalil is a personal productivity dashboard: daily focus, daily/weekly/backlog to-do lists,
a multi-view calendar, habit tracking, life-pillar progress tracking, bookmarks, and
freeform sticky/list notes — all synced to a Supabase backend behind Google sign-in, with
full Arabic/English (RTL/LTR) support.

Built with React 19, TypeScript, Vite, Tailwind CSS, Zustand, and Supabase (Postgres + Auth).

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create a Supabase project

Create a project at [supabase.com](https://supabase.com) (or use an existing one), then:

```bash
cp .env.example .env
```

Fill in `.env` from your project's **Settings → API** page:

- `VITE_SUPABASE_URL` — Project URL
- `VITE_SUPABASE_ANON_KEY` — anon/public API key

### 3. Enable Google sign-in

The app only supports signing in with Google (`supabase.auth.signInWithOAuth({ provider: 'google' })`).
In your Supabase project:

1. **Authentication → Providers → Google** — enable it and fill in the OAuth **Client ID** and
   **Client secret** from a Google Cloud Console OAuth 2.0 Client (Web application type).
2. In that Google Cloud OAuth client, add Supabase's callback URL to **Authorized redirect URIs**:
   `https://<your-project-ref>.supabase.co/auth/v1/callback`
3. **Authentication → URL Configuration → Redirect URLs** — add every origin the app will run
   from (the client passes `redirectTo: window.location.origin`), e.g.
   `http://localhost:5173` for local dev and your production URL once deployed.

### 4. Apply database migrations

The schema lives in `supabase/migrations/` as timestamped SQL files managed by the
[Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started)
(no separate install needed — `npx supabase` works directly).

**Local development** (requires [Docker](https://www.docker.com/) to run Postgres + the rest
of the Supabase stack in containers):

```bash
npx supabase start   # first time: pulls images and starts local Postgres/Auth/Studio
npx supabase db reset   # (re)applies every migration from scratch to the local database
```

`db reset` is also the way to verify a change to the migrations themselves: it always replays
the full history from an empty database, so it catches anything that only worked because your
local database already had leftover state from before.

**Applying to your actual (linked) Supabase project**, once you're ready to ship a schema
change:

```bash
npx supabase link --project-ref <your-project-ref>   # one-time, per machine
npx supabase db push                                  # applies any new migrations
```

`db push` only runs migrations the linked project hasn't seen yet — it's safe to run
repeatedly. Never run `db reset` against `--linked`; that command is for local development only
and will wipe the target database.

`supabase/manual-sql-reference/` holds SQL that was applied by hand directly in the Supabase
SQL Editor at some point in the project's history (not through the CLI) — it's historical
documentation, not something you need to run.

### 5. Run the app

```bash
npm run dev
```

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check (`tsc -b`) and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm test` | Run the test suite once (Vitest) |
| `npm run test:watch` | Run tests in watch mode |
