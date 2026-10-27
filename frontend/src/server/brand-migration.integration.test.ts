import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { describe, expect, it } from "vitest";

const frontendMigration = resolve(
  process.cwd(),
  "prisma/migrations/20261027_0003_rebrand_arx_clips/migration.sql",
);
const backendMigration = resolve(
  process.cwd(),
  "../backend/src/migrations/sql/20261027_0003_rebrand_arx_clips.sql",
);

describe("Arx Clips data rebrand migration", () => {
  it("keeps both migration tracks identical and replaces only legacy display text", async () => {
    const sql = readFileSync(frontendMigration, "utf8");
    expect(readFileSync(backendMigration, "utf8")).toBe(sql);

    const db = new PGlite();
    await db.exec(`
      CREATE TABLE announcements (
        id text PRIMARY KEY,
        description varchar NOT NULL,
        updated_at timestamptz NOT NULL DEFAULT now()
      );
      CREATE TABLE processing_cache (
        cache_key varchar PRIMARY KEY,
        analysis_json text NOT NULL,
        updated_at timestamptz NOT NULL DEFAULT now()
      );
      INSERT INTO announcements (id, description) VALUES
        ('legacy', 'Make content about SupoClip.'),
        ('current', 'Arx Clips is ready.');
      INSERT INTO processing_cache (cache_key, analysis_json) VALUES
        ('legacy', '{"summary":"The SupoClip workflow"}'),
        ('current', '{"summary":"An Arx Clips workflow"}');
    `);

    await db.exec(sql);
    await db.exec(sql);

    expect((await db.query("SELECT id, description FROM announcements ORDER BY id")).rows).toEqual([
      { id: "current", description: "Arx Clips is ready." },
      { id: "legacy", description: "Make content about Arx Clips." },
    ]);
    expect((await db.query("SELECT cache_key, analysis_json FROM processing_cache ORDER BY cache_key")).rows).toEqual([
      { cache_key: "current", analysis_json: '{"summary":"An Arx Clips workflow"}' },
      { cache_key: "legacy", analysis_json: '{"summary":"The Arx Clips workflow"}' },
    ]);

    await db.close();
  });
});
