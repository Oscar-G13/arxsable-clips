#!/usr/bin/env bash
set -Eeuo pipefail
source /opt/supoclip/app/ops/common.sh
umask 077

exec 9>"$ROOT_DIR/.git-ops.lock"
flock -n 9 || {
  echo "Another Arx Clips Git operation is running" >&2
  exit 1
}

exec >>"$APP_DIR/ops/upstream-sync.log" 2>&1
echo "[$(TZ=Europe/Helsinki date --iso-8601=seconds)] upstream check start"

assert_main_branch
assert_clean_repository
git -C "$APP_DIR" fetch origin main
[[ "$(git -C "$APP_DIR" rev-parse HEAD)" == "$(git -C "$APP_DIR" rev-parse origin/main)" ]] || {
  echo "Refusing: live main differs from origin/main" >&2
  exit 1
}
git -C "$APP_DIR" fetch upstream main

new_count="$(git -C "$APP_DIR" rev-list --count main..upstream/main)"
if [[ "$new_count" == 0 ]]; then
  echo "[$(TZ=Europe/Helsinki date --iso-8601=seconds)] upstream main has no new commits"
  exit 0
fi

export GH_TOKEN
GH_TOKEN="$(<"$ROOT_DIR/secrets/github-token")"
export GH_PROMPT_DISABLED=1
export GH_NO_UPDATE_NOTIFIER=1
export GH_CONFIG_DIR="$ROOT_DIR/gh-config"
mkdir -p "$GH_CONFIG_DIR"
chmod 700 "$GH_CONFIG_DIR"

branch="upstream-sync-$(TZ=Europe/Helsinki date +%F)"
body="$(mktemp "$ROOT_DIR/.upstream-pr-body.XXXXXX")"
worktree_root=""

write_body() {
  {
    echo 'Automated, review-only merge of new Arx Clips upstream commits.'
    echo
    echo '## New upstream commits'
    git -C "$APP_DIR" log --format='- %h %s' main..upstream/main
    echo
    echo '## New migration files'
    migrations="$(
      git -C "$APP_DIR" diff --diff-filter=A --name-only main..upstream/main -- \
        backend/migrations/ backend/src/migrations/sql/ frontend/prisma/migrations/
    )"
    if [[ -n "$migrations" ]]; then
      while IFS= read -r file; do printf -- '- `%s`\n' "$file"; done <<<"$migrations"
    else
      echo '- None'
    fi
    echo
    echo 'This PR is not automatically merged or deployed. Apply any schema changes manually after a backup; never run `prisma migrate deploy` against this database.'
  } >"$body"
}

cleanup() {
  if [[ -n "$worktree_root" && -d "$worktree_root/worktree" ]]; then
    git -C "$worktree_root/worktree" merge --abort >/dev/null 2>&1 || true
    git -C "$APP_DIR" worktree remove --force "$worktree_root/worktree" >/dev/null 2>&1 || true
  fi
  [[ -z "$worktree_root" || ! -d "$worktree_root" ]] || rmdir "$worktree_root" 2>/dev/null || true
  [[ ! -e "$body" ]] || unlink -- "$body"
}
trap cleanup EXIT

write_body

if git -C "$APP_DIR" ls-remote --exit-code --heads origin "$branch" >/dev/null 2>&1; then
  existing="$(gh pr list --repo "$GITHUB_REPO" --state open --head "$branch" --json url --jq '.[0].url // empty')"
  if [[ -n "$existing" ]]; then
    echo "Existing upstream PR: $existing"
    exit 0
  fi
  gh pr create \
    --repo "$GITHUB_REPO" \
    --base main \
    --head "$branch" \
    --title "Sync upstream $(TZ=Europe/Helsinki date +%F)" \
    --body-file "$body"
  exit 0
fi

git -C "$APP_DIR" branch -D "$branch" >/dev/null 2>&1 || true
worktree_root="$(mktemp -d "$ROOT_DIR/.upstream-sync.XXXXXX")"
git -C "$APP_DIR" worktree add -b "$branch" "$worktree_root/worktree" origin/main

if ! git -C "$worktree_root/worktree" merge --no-ff --no-edit upstream/main; then
  conflicts="$(git -C "$worktree_root/worktree" diff --name-only --diff-filter=U || true)"
  git -C "$worktree_root/worktree" merge --abort >/dev/null 2>&1 || true
  printf 'Upstream merge conflicted; aborted. Conflicts:\n%s\n' "$conflicts" >&2
  exit 1
fi

assert_safe_tracked_files "$worktree_root/worktree"
git -C "$worktree_root/worktree" push -u origin "$branch"
gh pr create \
  --repo "$GITHUB_REPO" \
  --base main \
  --head "$branch" \
  --title "Sync upstream $(TZ=Europe/Helsinki date +%F)" \
  --body-file "$body"

echo "[$(TZ=Europe/Helsinki date --iso-8601=seconds)] upstream PR created"
