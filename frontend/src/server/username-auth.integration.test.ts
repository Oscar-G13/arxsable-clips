// @vitest-environment node
import { readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import { expect, it } from "vitest";

it("adds idempotent unique username fields in either migration order", async () => {
  const frontend = readFileSync("prisma/migrations/20261027_0001_username_auth/migration.sql", "utf8");
  const backend = readFileSync("../backend/src/migrations/sql/20261027_0001_username_auth.sql", "utf8");

  for (const migrations of [[frontend, backend], [backend, frontend]]) {
    const db = new PGlite();
    try {
      await db.exec("CREATE TABLE users (id text PRIMARY KEY)");
      await db.exec(migrations[0]);
      await db.exec("INSERT INTO users (id, username, \"displayUsername\") VALUES ('user-1', 'oscar', 'oscar')");
      await db.exec(migrations[1]);

      const columns = await db.query<{ column_name: string }>(
        "SELECT column_name FROM information_schema.columns WHERE table_name='users' AND column_name IN ('username', 'displayUsername') ORDER BY column_name"
      );
      expect(columns.rows).toEqual([{ column_name: "displayUsername" }, { column_name: "username" }]);
      await expect(
        db.exec("INSERT INTO users (id, username) VALUES ('user-2', 'oscar')")
      ).rejects.toThrow(/unique constraint/);
    } finally {
      await db.close();
    }
  }
}, 30_000);
