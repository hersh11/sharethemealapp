// Build-time metadata that depends on the site's public URL: the canonical
// link, og:url, JSON-LD structured data, robots.txt and sitemap.xml.
//
// The URL comes from SITE_URL if set, otherwise from the host during the build:
// Vercel's VERCEL_PROJECT_PRODUCTION_URL (your custom domain once one is added,
// the .vercel.app domain before that) or Netlify's URL. Local builds have none
// of these, so the URL-dependent parts are left out.

export const resolveSiteUrl = (env) => {
  const candidates = [
    env.SITE_URL,
    env.VERCEL_PROJECT_PRODUCTION_URL && `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`,
    env.URL,
  ];
  const url = candidates.find((value) => /^https?:\/\/\S+$/.test(value?.trim() ?? ""));
  return url ? url.trim().replace(/\/+$/, "") : "";
};

export default function siteMeta({ siteUrl, structuredData }) {
  const homeUrl = siteUrl ? `${siteUrl}/` : "";
  const jsonLd = { ...structuredData, ...(homeUrl ? { url: homeUrl } : {}) };

  return {
    name: "site-meta",

    transformIndexHtml() {
      const tags = [
        {
          tag: "script",
          attrs: { type: "application/ld+json" },
          children: JSON.stringify(jsonLd),
          injectTo: "head",
        },
      ];

      if (homeUrl) {
        tags.push(
          { tag: "link", attrs: { rel: "canonical", href: homeUrl }, injectTo: "head" },
          { tag: "meta", attrs: { property: "og:url", content: homeUrl }, injectTo: "head" },
        );
      }

      return tags;
    },

    generateBundle() {
      const robots = ["User-agent: *", "Allow: /"];

      if (homeUrl) {
        robots.push("", `Sitemap: ${siteUrl}/sitemap.xml`);
        this.emitFile({
          type: "asset",
          fileName: "sitemap.xml",
          source: [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
            `  <url><loc>${homeUrl}</loc></url>`,
            "</urlset>",
            "",
          ].join("\n"),
        });
      }

      this.emitFile({ type: "asset", fileName: "robots.txt", source: `${robots.join("\n")}\n` });
    },
  };
}
