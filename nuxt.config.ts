import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
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
    "@nuxt/content",
  ],
  nitro: {
    prerender: {
      routes: ["/sitemap.xml"],
    },
  },
  content: {},

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
