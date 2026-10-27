UPDATE announcements
SET description = replace(description, 'SupoClip', 'Arx Clips'),
    updated_at = NOW()
WHERE description LIKE '%SupoClip%';

UPDATE processing_cache
SET analysis_json = replace(analysis_json, 'SupoClip', 'Arx Clips'),
    updated_at = NOW()
WHERE analysis_json LIKE '%SupoClip%';
