<script lang="ts">
import Navigate from "~/components/nav/Navigate.vue";
export default defineComponent({ components: { Navigate } });
</script>

<template>
  <div class="flex flex-col min-h-[100vh]">
    <header
      class="w-full text-center min-h-[4vh] bg-slate-600 dark:bg-sky-950 text-slate-100 dark:text-slate-300 place-content-center"
    >
      <Navigate />
    </header>
    <main class="w-full flex-auto">
      <slot />
    </main>
    <footer
      class="w-full text-center min-h-[4vh] bg-slate-700 dark:bg-sky-950 text-slate-100 dark:text-slate-300 place-content-center"
    >
      Это footer Lorem ipsum dolor sit amet consectetur adipisicing elit.
      Laudantium, numquam!
    </footer>
  </div>
</template>
