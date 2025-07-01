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
    },
    {
      loc: "/primers",
      // Specify which sitemap this URL belongs to
      //   _sitemap: "pages",
      changefreq: "monthly",
      priority: 0.1,
      lastmod: new Date(),
    },
  ] satisfies SitemapUrlInput[];
});
