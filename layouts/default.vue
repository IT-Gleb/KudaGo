<script setup lang="ts">
import { ref } from "vue";
import Navigate from "~/components/nav/Navigate.vue";
import { getNowYear } from "~/utils/functions";
const thisYear = ref(getNowYear());
//export default defineComponent({ components: { Navigate } });
</script>

<template>
  <div class="flex flex-col min-h-[100vh]">
    <header
      class="w-full text-center bg-slate-200 dark:bg-slate-950 dark:text-slate-300 place-content-center"
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
