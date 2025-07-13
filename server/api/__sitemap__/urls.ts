import { defineSitemapEventHandler } from "#imports";
import type { SitemapUrlInput } from "#sitemap/types";

export default defineSitemapEventHandler(() => {
  return [
    {
      loc: "/",
      // Specify which sitemap this URL belongs to
      //   _sitemap: "pages",
      changefreq: "daily",
      priority: 0.2,
      lastmod: new Date(),
      _i18nTransform: true,
    },
    {
      loc: "/primers",
      // Specify which sitemap this URL belongs to
      //   _sitemap: "pages",
      changefreq: "monthly",
      priority: 0.1,
      lastmod: new Date("2025-06-30T22:00:00"),
      _i18nTransform: true,
    },
  ] satisfies SitemapUrlInput[];
});
