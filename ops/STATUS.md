# Arx Clips Status

- Date (Europe/Helsinki): 2026-10-27
- Application commit: `a4592550e968ec4936046043a51e51103d7c4afe`
- Upstream main: `8b8c68340b1b1239796ef5ecf6aa905fbab3f2fd`
- Commits behind upstream: 0
- Last database backup: `db-2026-10-27.sql.gz` (12K)
- Last media backup: `media-2026-10-27.tar.gz` (4.0K)

## Container uptime

| Container | Started | Uptime | State | Health |
|---|---|---:|---|---|
| `supoclip-backend` | 2026-10-27T07:41:44.636292654Z | 0d 00h 00m | running | healthy |
| `supoclip-frontend` | 2026-10-27T07:12:47.366366516Z | 0d 00h 29m | running | healthy |
| `supoclip-ollama` | 2026-10-27T07:25:38.565009493Z | 0d 00h 16m | running | healthy |
| `supoclip-postgres` | 2026-10-27T07:07:59.975247733Z | 0d 00h 34m | running | healthy |
| `supoclip-redis` | 2026-10-27T07:08:00.213283173Z | 0d 00h 34m | running | healthy |
| `supoclip-worker` | 2026-10-27T07:41:55.35861171Z | 0d 00h 00m | running | healthy |

## Docker Compose

```text
SERVICE    STATE     STATUS                    PORTS
backend    running   Up 27 seconds (healthy)   127.0.0.1:8000->8000/tcp
frontend   running   Up 29 minutes (healthy)   127.0.0.1:3107->3107/tcp
ollama     running   Up 16 minutes (healthy)   11434/tcp
postgres   running   Up 34 minutes (healthy)   5432/tcp
redis      running   Up 34 minutes (healthy)   127.0.0.1:6379->6379/tcp
worker     running   Up 17 seconds (healthy)   8000/tcp
```

## Database activity

| Metric | Total | Last 24 hours |
|---|---:|---:|
| Tasks | 0 | 0 |
| Clips | 0 | 0 |

## Disk use

- `/opt/supoclip`: 125M
- `supoclip_clips`: 4.0K
- `supoclip_ollama_data`: 12.8G
- `supoclip_postgres_data`: 47.7M
- `supoclip_redis_data`: 8.0K
- `supoclip_uploads`: 12.0K
