UPDATE "service_statuses"
SET
    "status" = 'degraded',
    "headline" = 'YouTube link imports unavailable',
    "description" = 'YouTube is blocking this server''s direct downloader. Upload a video file instead for now.',
    "updated_at" = CURRENT_TIMESTAMP
WHERE
    "id" = 'video-downloads'
    AND "status" = 'degraded'
    AND "headline" = 'Investigating'
    AND "description" = 'We are investigating slow video downloads. Importing videos from YouTube may take longer than usual or fail with a timeout. Please avoid repeatedly retrying the same video while we investigate. We will update this page when we have more information.';
