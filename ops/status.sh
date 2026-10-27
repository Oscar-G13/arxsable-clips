#!/usr/bin/env bash
set -Eeuo pipefail
source /opt/supoclip/app/ops/common.sh
umask 022

exec 9>"$ROOT_DIR/.git-ops.lock"
flock -n 9 || {
  echo "Another Arx Clips Git operation is running" >&2
  exit 1
}

assert_main_branch
assert_clean_repository

git -C "$APP_DIR" fetch origin main
[[ "$(git -C "$APP_DIR" rev-parse HEAD)" == "$(git -C "$APP_DIR" rev-parse origin/main)" ]] || {
  echo "Refusing: live main differs from origin/main" >&2
  exit 1
}
git -C "$APP_DIR" fetch upstream main

tmp="$(mktemp "$APP_DIR/ops/.STATUS.md.XXXXXX")"
container_rows="$(mktemp "$ROOT_DIR/.status-containers.XXXXXX")"
volume_rows="$(mktemp "$ROOT_DIR/.status-volumes.XXXXXX")"
cleanup() {
  [[ ! -e "$tmp" ]] || unlink -- "$tmp"
  [[ ! -e "$container_rows" ]] || unlink -- "$container_rows"
  [[ ! -e "$volume_rows" ]] || unlink -- "$volume_rows"
}
trap cleanup EXIT

head_hash="$(git -C "$APP_DIR" rev-parse HEAD)"
upstream_hash="$(git -C "$APP_DIR" rev-parse upstream/main)"
behind="$(git -C "$APP_DIR" rev-list --count HEAD..upstream/main)"
compose_summary="$(compose ps --format 'table {{.Service}}\t{{.State}}\t{{.Status}}\t{{.Ports}}')"

now_epoch="$(date +%s)"
while IFS= read -r id; do
  [[ -n "$id" ]] || continue
  IFS='|' read -r name started state health < <(
    docker inspect --format '{{.Name}}|{{.State.StartedAt}}|{{.State.Status}}|{{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}}' "$id"
  )
  name="${name#/}"
  started_epoch="$(date -d "$started" +%s)"
  age=$((now_epoch - started_epoch))
  ((age >= 0)) || age=0
  printf '%s|%s|%dd %02dh %02dm|%s|%s\n' \
    "$name" "$started" "$((age / 86400))" "$(((age % 86400) / 3600))" "$(((age % 3600) / 60))" "$state" "$health" \
    >>"$container_rows"
done < <(compose ps -q)
LC_ALL=C sort -o "$container_rows" "$container_rows"

counts="$(
  compose exec -T postgres psql -U supoclip -d supoclip -At -F '|' -c \
    "SELECT
       (SELECT COUNT(*) FROM tasks),
       (SELECT COUNT(*) FROM tasks WHERE created_at >= NOW() - INTERVAL '24 hours'),
       (SELECT COUNT(*) FROM generated_clips),
       (SELECT COUNT(*) FROM generated_clips WHERE created_at >= NOW() - INTERVAL '24 hours');" \
    </dev/null
)"
IFS='|' read -r tasks_total tasks_day clips_total clips_day <<<"$counts"

while IFS= read -r volume; do
  [[ -n "$volume" ]] || continue
  [[ "$volume" =~ ^supoclip_[A-Za-z0-9_.-]+$ ]] || {
    echo "Unsafe Arx Clips volume name: $volume" >&2
    exit 1
  }
  size="$(
    docker run --rm --network none --pull=never \
      -v "$volume:/volume:ro" \
      --entrypoint sh postgres:15-alpine \
      -c 'du -sh /volume | cut -f1'
  )"
  printf '%s|%s\n' "$volume" "$size" >>"$volume_rows"
done < <(
  docker volume ls \
    --filter label=com.docker.compose.project=supoclip \
    --format '{{.Name}}' | LC_ALL=C sort
)

latest_backup() {
  local pattern="$1" match
  match="$(find "$BACKUP_DIR" -maxdepth 1 -type f -name "$pattern" -printf '%T@|%f\n' 2>/dev/null | LC_ALL=C sort -t'|' -k1,1nr | head -n1 || true)"
  if [[ -n "$match" ]]; then
    local file="${match#*|}"
    printf '`%s` (%s)' "$file" "$(du -h "$BACKUP_DIR/$file" | cut -f1)"
  else
    printf 'none'
  fi
}

{
  echo '# Arx Clips Status'
  echo
  echo "- Date (Europe/Helsinki): $(TZ=Europe/Helsinki date +%F)"
  echo "- Application commit: \`$head_hash\`"
  echo "- Upstream main: \`$upstream_hash\`"
  echo "- Commits behind upstream: $behind"
  echo "- Last database backup: $(latest_backup 'db-*.sql.gz')"
  echo "- Last media backup: $(latest_backup 'media-*.tar.gz')"
  echo
  echo '## Container uptime'
  echo
  echo '| Container | Started | Uptime | State | Health |'
  echo '|---|---|---:|---|---|'
  while IFS='|' read -r name started uptime state health; do
    printf '| `%s` | %s | %s | %s | %s |\n' "$name" "$started" "$uptime" "$state" "$health"
  done <"$container_rows"
  echo
  echo '## Docker Compose'
  echo
  echo '```text'
  printf '%s\n' "$compose_summary"
  echo '```'
  echo
  echo '## Database activity'
  echo
  echo '| Metric | Total | Last 24 hours |'
  echo '|---|---:|---:|'
  echo "| Tasks | $tasks_total | $tasks_day |"
  echo "| Clips | $clips_total | $clips_day |"
  echo
  echo '## Disk use'
  echo
  echo "- \`/opt/supoclip\`: $(du -sh "$ROOT_DIR" | cut -f1)"
  while IFS='|' read -r volume size; do
    echo "- \`$volume\`: $size"
  done <"$volume_rows"
} >"$tmp"

if [[ ! -f "$APP_DIR/ops/STATUS.md" ]] || ! cmp -s "$tmp" "$APP_DIR/ops/STATUS.md"; then
  mv -f -- "$tmp" "$APP_DIR/ops/STATUS.md"
  git -C "$APP_DIR" add -- ops/STATUS.md
  git -C "$APP_DIR" commit --only \
    -m "ops: status $(TZ=Europe/Helsinki date +%F)" \
    -- ops/STATUS.md
  assert_safe_tracked_files "$APP_DIR"
  git -C "$APP_DIR" push origin main
fi
