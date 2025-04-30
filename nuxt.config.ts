import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  imports: {
    autoImport: true,
  },
  vite: {
    plugins: [tailwindcss()],
  },
  modules: ["motion-v/nuxt", "@vueuse/nuxt", "@nuxt/fonts", "@pinia/nuxt"],
  app: {
    head: {
      charset: "utf-8",
      title: "KudaGo API",
      htmlAttrs: {
        lang: "ru",
      },
      viewport: "width=device-width, initial-scale=1, maximum-scale=1",
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },
  routeRules: {
    "/api/news": {
      swr: true,
      cache: {
        maxAge: 10,
      },
    },
    "/api/cityes": {
      ssr: false,
    },
  },
});
