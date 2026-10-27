import { readdirSync, readFileSync } from "node:fs";
import { extname, join, relative, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { DEFAULT_SITE_URL, GITHUB_URL, SITE_NAME } from "./site";

const textExtensions = new Set([".json", ".svg", ".ts", ".tsx", ".txt"]);
const legacyRoots = [["Supo", "Clip"].join(""), ["Sup", "Clip"].join("")];
const legacyNames = legacyRoots.flatMap((name) => [name, `${name}s`]);
const legacyPublicUrls = [
  "supoclip.com",
  "www.supoclip.com",
  "api.supoclip.com",
  "mcp.supoclip.com",
  "apps.apple.com/us/app/supoclip",
  "producthunt.com/products/supoclip",
];

function textFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return textFiles(path);
    return textExtensions.has(extname(path)) ? [path] : [];
  });
}

describe("Arx Clips branding", () => {
  it("uses the Arx identity and repository as canonical metadata", () => {
    expect(SITE_NAME).toBe("Arx Clips");
    expect(DEFAULT_SITE_URL).toBe("https://clips.arxsable.ai");
    expect(GITHUB_URL).toBe("https://github.com/Oscar-G13/arxsable-clips");
  });

  it("does not ship the legacy identity in customer-facing source or messages", () => {
    const frontendRoot = process.cwd();
    const directories = [
      resolve(frontendRoot, "messages"),
      resolve(frontendRoot, "src/app"),
      resolve(frontendRoot, "src/components"),
    ];
    const files = [
      ...directories.flatMap((directory) => textFiles(directory)),
      resolve(frontendRoot, "public/llms.txt"),
      resolve(frontendRoot, "src/lib/site.ts"),
    ];
    const leaks = files.flatMap((file) => {
      const contents = readFileSync(file, "utf8");
      return legacyNames.some((name) => contents.includes(name))
        || legacyPublicUrls.some((url) => contents.includes(url))
        ? [relative(frontendRoot, file)]
        : [];
    });

    expect(leaks).toEqual([]);
  });
});
