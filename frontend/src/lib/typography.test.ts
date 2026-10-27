import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { createElement } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { cn } from "./utils";
import {
  CLAMPED_CONTENT_TITLE_CLASS,
  SAFE_CONTENT_TITLE_CLASS,
  TRUNCATED_CONTENT_TITLE_CLASS,
} from "./typography";

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = resolve(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(target);
    return entry.name.endsWith(".tsx") ? [target] : [];
  });
}

describe("safe title typography", () => {
  it("keeps long unbroken titles inside their container with descender clearance", () => {
    const filename = "v12044gdooooodbg2otvog6g5og8padh00-gypqj.MP4";
    render(createElement("h1", { className: cn("text-3xl", SAFE_CONTENT_TITLE_CLASS) }, filename));

    const title = screen.getByRole("heading", { level: 1, name: filename });
    expect(title).toHaveClass(...SAFE_CONTENT_TITLE_CLASS.split(" "));
    expect(SAFE_CONTENT_TITLE_CLASS).toContain("font-sans");
    expect(SAFE_CONTENT_TITLE_CLASS).toContain("leading-[1.25]");
    expect(SAFE_CONTENT_TITLE_CLASS).toContain("pb-[0.08em]");
    expect(SAFE_CONTENT_TITLE_CLASS).toContain("[overflow-wrap:anywhere]");
    expect(SAFE_CONTENT_TITLE_CLASS).toContain("max-w-full");
  });

  it("keeps wrapping, truncation, and clamping semantics separate", () => {
    const wrapped = cn("text-3xl", SAFE_CONTENT_TITLE_CLASS);
    const truncated = cn("text-xl", TRUNCATED_CONTENT_TITLE_CLASS);
    const clamped = cn("text-sm leading-snug", CLAMPED_CONTENT_TITLE_CLASS);

    expect(wrapped).toContain("leading-[1.25]");
    expect(wrapped).toContain("[overflow-wrap:anywhere]");
    expect(wrapped).not.toContain("truncate");
    expect(truncated).toContain("leading-[1.25]");
    expect(truncated).toContain("truncate");
    expect(truncated).not.toContain("[overflow-wrap:anywhere]");
    expect(clamped).toContain("leading-[1.25]");
    expect(clamped).toContain("line-clamp-2");
    expect(clamped).toContain("[overflow-wrap:anywhere]");
    expect(clamped).not.toContain("pb-[0.08em]");
  });

  it("does not load or apply the transparent-text shimmer effect", () => {
    const root = process.cwd();
    const sources = sourceFiles(resolve(root, "src"))
      .map((file) => readFileSync(file, "utf8"));

    for (const source of sources) {
      expect(source).not.toMatch(/\bshimmer\b/);
    }
    expect(readFileSync(resolve(root, "src/app/globals.css"), "utf8"))
      .not.toContain("tw-shimmer");
  });
});
