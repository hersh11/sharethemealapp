import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import siteMeta, { resolveSiteUrl } from "./tools/siteMeta.js";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      react(),
      siteMeta({
        siteUrl: resolveSiteUrl(env),
        structuredData: {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "ShareTheMeal",
          description:
            "Post surplus food for nearby NGOs and hunger spots, choose pickup or drop-off, and track every donation.",
          applicationCategory: "LifestyleApplication",
          operatingSystem: "Web",
          isAccessibleForFree: true,
          author: { "@type": "Person", name: "Harsh Narain", url: "https://github.com/hersh11" },
        },
      }),
    ],
    test: {
      environment: "jsdom",
      setupFiles: ["./src/test/setup.js"],
    },
  };
});
