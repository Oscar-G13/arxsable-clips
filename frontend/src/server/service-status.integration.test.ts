// @vitest-environment node
import { readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";

const migration = readFileSync(new URL("../../prisma/migrations/20261013120000_add_service_statuses/migration.sql", import.meta.url), "utf8");
const clarification = readFileSync(new URL("../../prisma/migrations/20261027_0002_clarify_youtube_import_status/migration.sql", import.meta.url), "utf8");
const backendClarification = readFileSync("../backend/src/migrations/sql/20261027_0002_clarify_youtube_import_status.sql", "utf8");

describe("service status migration", () => {
  let db: PGlite;
  beforeAll(async () => { db = new PGlite(); await db.exec(migration); });
  afterAll(async () => { await db.close(); });

  it("clarifies the seeded placeholder without overwriting a real operator status", async () => {
    expect(backendClarification).toBe(clarification);
    expect((await db.query("SELECT id, status FROM service_statuses")).rows).toEqual([{ id: "video-downloads", status: "degraded" }]);
    await db.exec(clarification);
    expect((await db.query("SELECT status, headline, description FROM service_statuses")).rows).toEqual([{
      status: "degraded",
      headline: "YouTube link imports unavailable",
      description: "YouTube is blocking this server's direct downloader. Upload a video file instead for now.",
    }]);

    await db.exec("UPDATE service_statuses SET status = 'outage', headline = 'Confirmed outage', description = 'An operator verified the incident.', updated_at = CURRENT_TIMESTAMP WHERE id = 'video-downloads'");
    await db.exec(clarification);
    await db.exec(migration);
    expect((await db.query("SELECT status, headline FROM service_statuses")).rows).toEqual([{ status: "outage", headline: "Confirmed outage" }]);
  });

  it("rejects unsupported status values", async () => {
    await expect(db.exec("UPDATE service_statuses SET status = 'typo' WHERE id = 'video-downloads'")).rejects.toThrow();
  });
});
