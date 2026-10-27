// @vitest-environment node
import { afterEach, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "./middleware";

vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      getSession: vi.fn().mockResolvedValue(null),
    },
  },
}));

afterEach(() => vi.unstubAllEnvs());

it("requires a session for product-update opt-outs and application pages", async () => {
  vi.stubEnv("NEXT_PUBLIC_LANDING_ONLY_MODE", "true");
  for (const method of ["GET", "POST"]) {
    const response = await middleware(new NextRequest(
      "https://app.example.com/email/product-updates/unsubscribe?token=v1.signed", { method },
    ));
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "https://app.example.com/sign-in?next=%2Femail%2Fproduct-updates%2Funsubscribe%3Ftoken%3Dv1.signed",
    );
  }
  const blocked = await middleware(new NextRequest("https://app.example.com/dashboard"));
  expect(blocked.status).toBe(307);
  expect(blocked.headers.get("location")).toBe(
    "https://app.example.com/sign-in?next=%2Fdashboard",
  );

  const dottedPath = await middleware(
    new NextRequest("https://app.example.com/private/export.json"),
  );
  expect(dottedPath.status).toBe(307);

  const nextAsset = await middleware(
    new NextRequest("https://app.example.com/_next/static/chunk.js"),
  );
  expect(nextAsset.headers.get("x-middleware-next")).toBe("1");

  for (const publicAsset of [
    "/arx-clips-logo.png",
    "/clips/source.jpg",
    "/clips/podcast-1.jpg",
    "/clips/podcast-2.jpg",
  ]) {
    const response = await middleware(
      new NextRequest(`https://app.example.com${publicAsset}`),
    );
    expect(response.headers.get("x-middleware-next")).toBe("1");
  }
});
