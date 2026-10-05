import { describe, expect, it } from "vitest";
import { resolveSiteUrl } from "./siteMeta";

describe("resolveSiteUrl", () => {
  it("prefers SITE_URL and trims trailing slashes", () => {
    expect(
      resolveSiteUrl({ SITE_URL: "https://meal.example.com/", VERCEL_PROJECT_PRODUCTION_URL: "x.vercel.app" }),
    ).toBe("https://meal.example.com");
  });

  it("falls back to the Vercel production domain, then Netlify's URL", () => {
    expect(resolveSiteUrl({ VERCEL_PROJECT_PRODUCTION_URL: "sharethemealapp.vercel.app" })).toBe(
      "https://sharethemealapp.vercel.app",
    );
    expect(resolveSiteUrl({ URL: "https://sharethemeal.netlify.app" })).toBe("https://sharethemeal.netlify.app");
  });

  it("returns an empty string when no usable URL is set", () => {
    expect(resolveSiteUrl({})).toBe("");
    expect(resolveSiteUrl({ URL: "not a url" })).toBe("");
  });
});
