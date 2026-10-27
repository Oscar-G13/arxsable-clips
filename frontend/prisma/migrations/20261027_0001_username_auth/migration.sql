ALTER TABLE "users"
ADD COLUMN IF NOT EXISTS "username" VARCHAR(30),
ADD COLUMN IF NOT EXISTS "displayUsername" VARCHAR(30);

CREATE UNIQUE INDEX IF NOT EXISTS "users_username_key"
ON "users"("username");
