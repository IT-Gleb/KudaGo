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
  modules: ["motion-v/nuxt", "@vueuse/nuxt", "@nuxt/fonts"],
  routeRules: {
    "/api/news": {
      swr: true,
      cache: {
        maxAge: 30 * 60,
      },
    },
  },
});
