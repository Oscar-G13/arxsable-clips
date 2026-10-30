# Arx Clips Status

- Date (Europe/Helsinki): 2026-10-30
- Application commit: `7894da56bffb580819e9d1d080a14fc81fe67d8c`
- Upstream main: `3b39626f3d0bd05186391b8d345ca1c8bbf6015d`
- Commits behind upstream: 53
- Last database backup: `db-2026-10-27.sql.gz` (12K)
- Last media backup: `media-2026-10-27.tar.gz` (98M)

## Container uptime

| Container | Started | Uptime | State | Health |
|---|---|---:|---|---|
| `supoclip-backend` | 2026-10-27T18:41:30.961153712Z | 2d 12h 41m | running | healthy |
| `supoclip-frontend` | 2026-10-27T18:41:30.495080286Z | 2d 12h 41m | running | healthy |
| `supoclip-ollama` | 2026-10-27T18:41:30.571748213Z | 2d 12h 41m | running | healthy |
| `supoclip-postgres` | 2026-10-27T18:41:30.622105318Z | 2d 12h 41m | running | healthy |
| `supoclip-redis` | 2026-10-27T18:41:30.047398912Z | 2d 12h 41m | running | healthy |
| `supoclip-worker` | 2026-10-27T18:41:30.760906352Z | 2d 12h 41m | running | healthy |

## Docker Compose

```text
SERVICE    STATE     STATUS                PORTS
backend    running   Up 2 days (healthy)   127.0.0.1:8000->8000/tcp
frontend   running   Up 2 days (healthy)   127.0.0.1:3107->3107/tcp
ollama     running   Up 2 days (healthy)   11434/tcp
postgres   running   Up 2 days (healthy)   5432/tcp
redis      running   Up 2 days (healthy)   127.0.0.1:6379->6379/tcp
worker     running   Up 2 days (healthy)   8000/tcp
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
