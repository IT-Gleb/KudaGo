<script setup lang="ts">
import { ref } from "vue";
import Navigate from "~/components/nav/Navigate.vue";
import { getNowYear } from "~/utils/functions";
import { useI18n } from "#imports";

const thisYear = ref<string>(getNowYear());
const { t } = useI18n();
//export default defineComponent({ components: { Navigate } });

const currRoute = useRoute();
const isMainPage = computed(
  () => currRoute.path === "/" || currRoute.path === "/en"
);
</script>

<template>
  <div class="flex flex-col min-h-[100vh]">
    <header
      class="w-full text-center bg-slate-200 dark:bg-slate-950 place-items-center dark:text-slate-300 place-content-center flex flex-row gap-x-2 justify-between"
    >
      <span
        class="pl-2 text-[0.85em]/[1.1em] uppercase font-['Roboto'] font-semibold"
      >
        {{ !isMainPage ? t("subHead") : "" }}</span
      >
      <Navigate />
    </header>
    <main class="w-full flex-auto">
      <slot />
    </main>
    <footer
      class="w-full text-center min-h-[6vh] bg-indigo-950 dark:bg-slate-950 text-slate-100 dark:text-slate-300 place-content-center"
    >
      &copy;2001-{{ thisYear }}г.
    </footer>
  </div>
</template>
