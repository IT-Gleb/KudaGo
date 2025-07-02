import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-01",
  devtools: { enabled: false },
  css: ["~/assets/css/main.css"],
  ssr: true,
  imports: {
    autoImport: true,
  },
  vite: {
    plugins: [tailwindcss()],
  },
  modules: [
    "motion-v/nuxt",
    "@vueuse/nuxt",
    "@nuxt/fonts",
    "@pinia/nuxt",
    "@nuxtjs/sitemap",
  ],
  nitro: {
    prerender: {
      // routes: ["/sitemap.xml"],
      routes: ["/api/__sitemap__/urls"],
    },
  },

  site: {
    //url:"https://kuda-go.vercel.app",
    url: `${process.env.NUXT_SITE_NAME}`,
    name: "Сайт на API Kuda Go by Gleb Torgashin",
  },

  sitemap: {
    sources: ["/api/__sitemap__/urls"],
    // urls() {
    //   return ["/abc", "/bbb", "/sega"]
    // },
    // urls:["/","/primers","/sitemap.xml"],
  },

  app: {
    head: {
      charset: "utf-8",
      title: "KudaGo API",
      htmlAttrs: {
        lang: "ru",
      },
      viewport: "width=device-width, initial-scale=1, maximum-scale=5",
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },

  routeRules: {
    // "/api/news": {
    //   //ssr: true,
    //   prerender: true,
    //   // swr: true,
    //   // cache: {
    //   //   maxAge: 10,
    //   // },
    // },
    // "/api/films": { prerender: true },
    // "/": {
    //   swr: true,
    //   cache: {
    //     maxAge: 3600,
    //   },
    // },
    "/api/cityes": {
      swr: true,
      cache: {
        maxAge: 10,
      },
    },
  },
});
