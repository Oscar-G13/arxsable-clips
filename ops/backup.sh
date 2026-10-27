#!/usr/bin/env bash
set -Eeuo pipefail
source /opt/supoclip/app/ops/common.sh
umask 077

mkdir -p "$BACKUP_DIR"
chmod 700 "$BACKUP_DIR"

exec 9>"$ROOT_DIR/.backup.lock"
flock -n 9 || {
  echo "A SupoClip backup is already running" >&2
  exit 1
}

exec >>"$APP_DIR/ops/backup.log" 2>&1
echo "[$(TZ=Europe/Helsinki date --iso-8601=seconds)] backup start"

backup_date="$(TZ=Europe/Helsinki date +%F)"
db_final="$BACKUP_DIR/db-$backup_date.sql.gz"
media_final="$BACKUP_DIR/media-$backup_date.tar.gz"
db_tmp="$(mktemp "$BACKUP_DIR/.db-$backup_date.sql.gz.XXXXXX")"
media_tmp="$(mktemp "$BACKUP_DIR/.media-$backup_date.tar.gz.XXXXXX")"

cleanup() {
  [[ ! -e "$db_tmp" ]] || unlink -- "$db_tmp"
  [[ ! -e "$media_tmp" ]] || unlink -- "$media_tmp"
}
trap cleanup EXIT

compose exec -T postgres \
  pg_dump --no-owner --no-privileges -U supoclip -d supoclip \
  </dev/null | gzip -9 >"$db_tmp"
gzip -t "$db_tmp"

docker run --rm \
  --network none \
  --pull=never \
  --name "supoclip-media-backup-$$" \
  --label com.docker.compose.project=supoclip \
  -v supoclip_uploads:/media/uploads:ro \
  -v supoclip_clips:/media/clips:ro \
  postgres:15-alpine \
  tar -C /media -czf - uploads clips >"$media_tmp"
tar -tzf "$media_tmp" >/dev/null

chmod 600 "$db_tmp" "$media_tmp"
mv -f -- "$db_tmp" "$db_final"
mv -f -- "$media_tmp" "$media_final"

find "$BACKUP_DIR" -maxdepth 1 -type f \
  \( -name 'db-*.sql.gz' -o -name 'media-*.tar.gz' \) \
  -mtime +14 -delete

echo "[$(TZ=Europe/Helsinki date --iso-8601=seconds)] backup complete: $(basename "$db_final"), $(basename "$media_final")"
