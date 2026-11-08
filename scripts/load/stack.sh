#!/usr/bin/env bash
# The local stack for the load test: Postgres (Khalil's migrations, behind the
# same row-level security as Supabase), PostgREST (Supabase's data API) and a
# small gateway for the app. Nothing here touches a real Supabase project.
#
#   scripts/load/stack.sh up      start it (creates the database the first time)
#   scripts/load/stack.sh down    stop it
#   scripts/load/stack.sh reset   stop it and delete the database
#
# Needs Postgres 16+ installed (initdb, pg_ctl) and downloads PostgREST once.
# Settings: DATA_DIR (default /var/tmp/khalil-loadtest), PG_BIN, DB_POOL (PostgREST's
# connections to Postgres, default 10 as on Supabase's smaller plans).
set -euo pipefail
cd "$(dirname "$0")/../.."

DATA_DIR=${DATA_DIR:-/var/tmp/khalil-loadtest}
PG_BIN=${PG_BIN:-$(ls -d /usr/lib/postgresql/*/bin 2>/dev/null | sort -V | tail -1)}
DB_POOL=${DB_POOL:-10}
PGRST_VERSION=v12.2.12
PG="psql -h 127.0.0.1 -p 54322 -U postgres -d postgres -v ON_ERROR_STOP=1 -q"
# Postgres won't run as root: the data directory belongs to the postgres user.
as_pg() { if [ "$(id -u)" = 0 ]; then su postgres -c "$*"; else bash -c "$*"; fi; }
# Stops the process whose pid is in $DATA_DIR/$1.pid, if it still runs, and waits for it to end.
stop_pid() {
  local f="$DATA_DIR/$1.pid"
  if [ -f "$f" ]; then
    local pid; pid=$(cat "$f")
    kill "$pid" 2>/dev/null || true
    for _ in $(seq 1 50); do kill -0 "$pid" 2>/dev/null || break; sleep 0.1; done
    rm -f "$f"
  fi
}

up() {
  mkdir -p "$DATA_DIR"
  [ "$(id -u)" = 0 ] && chown postgres:postgres "$DATA_DIR"
  if [ ! -d "$DATA_DIR/pgdata" ]; then
    as_pg "$PG_BIN/initdb -D $DATA_DIR/pgdata -U postgres --auth=trust -E UTF8 --locale=C.UTF-8" >/dev/null
    cat scripts/load/postgresql.conf >> "$DATA_DIR/pgdata/postgresql.conf"
    fresh=1
  fi
  as_pg "$PG_BIN/pg_ctl -D $DATA_DIR/pgdata -l $DATA_DIR/pg.log status" >/dev/null 2>&1 || as_pg "$PG_BIN/pg_ctl -D $DATA_DIR/pgdata -l $DATA_DIR/pg.log start -w" >/dev/null
  if [ -n "${fresh:-}" ]; then
    $PG -f scripts/load/supabase-shim.sql
    for f in supabase/migrations/*.sql; do
      # The vocabulary tables were created by hand before the migrations that change them.
      case "$f" in *20261011000000*) $PG -f supabase/vocabulary_tables.sql 2>/dev/null ;; esac
      $PG -f "$f" 2>/dev/null
    done
    echo "database created: $(ls supabase/migrations/*.sql | wc -l) migrations"
  fi

  if [ ! -x "$DATA_DIR/postgrest" ]; then
    curl -sSL "https://github.com/PostgREST/postgrest/releases/download/$PGRST_VERSION/postgrest-$PGRST_VERSION-linux-static-x86-64.tar.xz" | tar xJ -C "$DATA_DIR"
  fi
  secret=$(node -e "import('./scripts/load/jwt.mjs').then((m) => console.log(m.JWT_SECRET))")
  cat > "$DATA_DIR/postgrest.conf" <<EOF
db-uri = "postgres://authenticator:authenticator@127.0.0.1:54322/postgres"
db-schemas = "public"
db-anon-role = "anon"
db-pool = $DB_POOL
db-max-rows = 1000
jwt-secret = "$secret"
jwt-aud = "authenticated"
server-host = "127.0.0.1"
server-port = 54331
log-level = "error"
EOF
  stop_pid postgrest
  nohup "$DATA_DIR/postgrest" "$DATA_DIR/postgrest.conf" > "$DATA_DIR/postgrest.log" 2>&1 &
  echo $! > "$DATA_DIR/postgrest.pid"
  stop_pid gateway
  nohup node scripts/load/gateway.mjs > "$DATA_DIR/gateway.log" 2>&1 &
  echo $! > "$DATA_DIR/gateway.pid"
  for _ in $(seq 1 30); do curl -s -o /dev/null http://127.0.0.1:54331/ && break; sleep 0.5; done
  echo "up: Postgres :54322, PostgREST :54331 (pool $DB_POOL), gateway :54321"
}

down() {
  stop_pid gateway
  stop_pid postgrest
  [ -d "$DATA_DIR/pgdata" ] && as_pg "$PG_BIN/pg_ctl -D $DATA_DIR/pgdata stop -m fast" >/dev/null 2>&1 || true
  echo down
}

case "${1:-}" in
  up) up ;;
  down) down ;;
  reset) down; rm -rf "$DATA_DIR"; echo "deleted $DATA_DIR" ;;
  *) echo "usage: $0 up|down|reset" >&2; exit 1 ;;
esac
