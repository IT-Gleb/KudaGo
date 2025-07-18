import tailwindcss from "@tailwindcss/vite";
import { defineNuxtConfig } from "nuxt/config";

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
    "@nuxtjs/i18n",
  ],
  nitro: {
    prerender: {
      // routes: ["/sitemap.xml"],
      routes: ["/api/__sitemap__/urls"],
    },
  },
  i18n: {
    baseUrl: "https://kuda-go.vercel.app",
    strategy: "prefix_and_default",
    defaultLocale: "ru",
    locales: [
      { code: "ru", name: "Russian", language: "ru-RU", file: "ru.json" },
      { code: "en", name: "English", language: "en-US", file: "eng.json" },
    ],
    detectBrowserLanguage: false,
    bundle: {
      optimizeTranslationDirective: false,
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

  runtimeConfig: {
    public: {
      nuxtSiteName: "https://kuda-go.vercel.app",
    },
  },

  app: {
    head: {
      charset: "utf-8",
      title: "KudaGo API",
      htmlAttrs: {
        lang: "ru-RU",
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
    "/api/searchevent": {
      ssr: false,
    },
    "/api/cityes": {
      swr: true,
      cache: {
        maxAge: 10,
      },
    },
  },
});
