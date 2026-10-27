#!/usr/bin/env bash
set -Eeuo pipefail

readonly ROOT_DIR=/opt/supoclip
readonly APP_DIR=/opt/supoclip/app
readonly BACKUP_DIR=/opt/supoclip/backups
readonly GITHUB_REPO=Oscar-G13/arxsable-clips

compose() {
  docker compose \
    --project-name supoclip \
    --project-directory "$APP_DIR" \
    -f "$APP_DIR/docker-compose.yml" \
    -f "$APP_DIR/docker-compose.override.yml" \
    "$@"
}

assert_main_branch() {
  [[ "$(git -C "$APP_DIR" symbolic-ref --short HEAD)" == main ]] || {
    echo "Refusing: $APP_DIR is not on main" >&2
    return 1
  }
}

assert_clean_repository() {
  [[ -z "$(git -C "$APP_DIR" status --porcelain)" ]] || {
    echo "Refusing: $APP_DIR has uncommitted changes" >&2
    git -C "$APP_DIR" status --short >&2
    return 1
  }
}

assert_safe_tracked_files() {
  local repo="${1:-$APP_DIR}"
  local bad value line key

  bad="$({
    git -C "$repo" ls-files |
      grep -E '(^|/)(\.env|CREDENTIALS\.txt|PREFLIGHT\.md|REPORT\.md)$|(^|/)backups/|(^|/)ops/.*\.log$|(^|/)(id_(rsa|dsa|ecdsa|ed25519)(\.pub)?|[^/]*\.(pem|key|p12|pfx))$' ||
      true
  })"
  [[ -z "$bad" ]] || {
    printf 'Refusing push; forbidden tracked files:\n%s\n' "$bad" >&2
    return 1
  }

  if [[ -r "$APP_DIR/.env" ]]; then
    while IFS= read -r line || [[ -n "$line" ]]; do
      [[ "$line" == *=* ]] || continue
      key="${line%%=*}"
      value="${line#*=}"
      case "$key" in
        *SECRET*|*PASSWORD*|*API_KEY*|*API_TOKEN*|REDIS_URL|DATABASE_URL)
          [[ -z "$value" ]] || ! git -C "$repo" grep -F -q -- "$value" || {
            echo "Refusing push; a live secret value is tracked" >&2
            return 1
          }
          ;;
      esac
    done <"$APP_DIR/.env"
  fi

  if [[ -s "$ROOT_DIR/secrets/github-token" ]]; then
    value="$(<"$ROOT_DIR/secrets/github-token")"
    [[ -z "$value" ]] || ! git -C "$repo" grep -F -q -- "$value" || {
      echo "Refusing push; the GitHub token is tracked" >&2
      return 1
    }
  fi
}
