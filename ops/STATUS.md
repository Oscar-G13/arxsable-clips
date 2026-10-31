# Arx Clips Status

- Date (Europe/Helsinki): 2026-10-31
- Application commit: `1303a157dfe0ea2a904426d106d2171b86679639`
- Upstream main: `08ec76dbbc96ded0b918b4242145c98600f4948a`
- Commits behind upstream: 59
- Last database backup: `db-2026-10-27.sql.gz` (12K)
- Last media backup: `media-2026-10-27.tar.gz` (98M)

## Container uptime

| Container | Started | Uptime | State | Health |
|---|---|---:|---|---|
| `supoclip-backend` | 2026-10-27T18:41:30.961153712Z | 3d 12h 41m | running | healthy |
| `supoclip-frontend` | 2026-10-27T18:41:30.495080286Z | 3d 12h 41m | running | healthy |
| `supoclip-ollama` | 2026-10-27T18:41:30.571748213Z | 3d 12h 41m | running | healthy |
| `supoclip-postgres` | 2026-10-27T18:41:30.622105318Z | 3d 12h 41m | running | healthy |
| `supoclip-redis` | 2026-10-27T18:41:30.047398912Z | 3d 12h 41m | running | healthy |
| `supoclip-worker` | 2026-10-27T18:41:30.760906352Z | 3d 12h 41m | running | healthy |

## Docker Compose

```text
SERVICE    STATE     STATUS                PORTS
backend    running   Up 3 days (healthy)   127.0.0.1:8000->8000/tcp
frontend   running   Up 3 days (healthy)   127.0.0.1:3107->3107/tcp
ollama     running   Up 3 days (healthy)   11434/tcp
postgres   running   Up 3 days (healthy)   5432/tcp
redis      running   Up 3 days (healthy)   127.0.0.1:6379->6379/tcp
worker     running   Up 3 days (healthy)   8000/tcp
```

## Database activity

| Metric | Total | Last 24 hours |
|---|---:|---:|
| Tasks | 1 | 0 |
| Clips | 3 | 0 |

## Disk use

- `/opt/supoclip`: 1.6G
- `supoclip_clips`: 4.0K
- `supoclip_ollama_data`: 12.8G
- `supoclip_postgres_data`: 47.8M
- `supoclip_redis_data`: 8.0K
- `supoclip_uploads`: 151.0M
- `supoclip_whisper_models`: 461.2M
