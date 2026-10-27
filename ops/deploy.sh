#!/usr/bin/env bash
set -Eeuo pipefail
source /opt/supoclip/app/ops/common.sh
umask 077

exec 8>"$ROOT_DIR/.deploy.lock"
flock -n 8 || {
  echo "Another Arx Clips deployment is running" >&2
  exit 1
}
exec 9>"$ROOT_DIR/.git-ops.lock"
flock -n 9 || {
  echo "Another Arx Clips Git operation is running" >&2
  exit 1
}

assert_main_branch
assert_clean_repository
git -C "$APP_DIR" fetch origin main
git -C "$APP_DIR" pull --ff-only origin main
assert_clean_repository

"$APP_DIR/ops/backup.sh"

declare -A applied=()
while IFS= read -r version; do
  [[ -z "$version" ]] || applied["$version"]=1
done < <(
  compose exec -T postgres \
    psql -U supoclip -d supoclip -Atc \
    'SELECT version FROM schema_migrations ORDER BY version' \
    </dev/null
)

pending=()
while IFS= read -r file; do
  version="$(basename "$file")"
  [[ "$version" =~ ^[A-Za-z0-9_.-]+\.sql$ ]] || {
    echo "Unsafe migration filename: $version" >&2
    exit 1
  }
  [[ -n "${applied[$version]:-}" ]] || pending+=("$file")
done < <(
  find "$APP_DIR/backend/src/migrations/sql" -maxdepth 1 -type f -name '*.sql' | LC_ALL=C sort
)

if ((${#pending[@]})); then
  {
    printf 'BEGIN;\n'
    for file in "${pending[@]}"; do
      version="$(basename "$file")"
      printf '\n-- %s\n' "$version"
      cat -- "$file"
      printf "\nINSERT INTO schema_migrations(version) VALUES ('%s') ON CONFLICT DO NOTHING;\n" "$version"
    done
    printf 'COMMIT;\n'
  } | compose exec -T postgres \
        psql -v ON_ERROR_STOP=1 -U supoclip -d supoclip
fi

compose up -d --build

expected="$(compose config --services | LC_ALL=C sort)"
healthy=""
deadline=$((SECONDS + 1800))
while ((SECONDS < deadline)); do
  healthy="$({
    while IFS= read -r id; do
      [[ -n "$id" ]] || continue
      docker inspect --format '{{index .Config.Labels "com.docker.compose.service"}}|{{.State.Status}}|{{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}}' "$id"
    done < <(compose ps -q)
  } | awk -F'|' '$2 == "running" && $3 == "healthy" {print $1}' | LC_ALL=C sort)"
  [[ "$healthy" == "$expected" ]] && break
  sleep 10
done

[[ "$healthy" == "$expected" ]] || {
  compose ps
  echo "Not every Arx Clips service became healthy" >&2
  exit 1
}

curl --fail --silent --show-error http://127.0.0.1:8000/health/db >/dev/null
echo "Arx Clips deployment healthy at $(git -C "$APP_DIR" rev-parse HEAD)"
