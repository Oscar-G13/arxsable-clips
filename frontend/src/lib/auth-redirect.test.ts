import { postAuthPath } from "./auth-redirect";

describe("postAuthPath", () => {
  it("returns a safe same-site next path", () => {
    expect(postAuthPath("?next=/settings/creator-program")).toBe(
      "/settings/creator-program",
    );
  });

  it("falls back to the dashboard for missing or unsafe next paths", () => {
    for (const search of [
      "",
      "?next=https://example.com",
      "?next=//example.com",
      "?next=/\\example.com",
    ]) {
      expect(postAuthPath(search)).toBe("/dashboard");
    }
  });
});
