-- The backend migration runner can reach this migration on a clean database
-- before Prisma has created the announcements table. Keep both migration
-- tracks safe and idempotent instead of failing application startup.
CREATE TABLE IF NOT EXISTS announcements (
    id TEXT NOT NULL PRIMARY KEY,
    title VARCHAR(120) NOT NULL,
    description VARCHAR(2000) NOT NULL,
    href VARCHAR(500) NOT NULL,
    action VARCHAR(80) NOT NULL,
    is_published BOOLEAN NOT NULL DEFAULT false,
    published_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

UPDATE announcements
SET description = replace(description, 'SupoClip', 'Arx Clips'),
    updated_at = NOW()
WHERE description LIKE '%SupoClip%';

UPDATE processing_cache
SET analysis_json = replace(analysis_json, 'SupoClip', 'Arx Clips'),
    updated_at = NOW()
WHERE analysis_json LIKE '%SupoClip%';
