<script lang="ts">
import Navigate from "~/components/nav/Navigate.vue";
export default defineComponent({ components: { Navigate } });
</script>

<template>
  <div>
    <header class="w-full text-center min-h-[4vh] bg-slate-600 text-slate-100">
      <Navigate />
    </header>
    <main class="w-full min-h-[89vh] flex-auto grow">
      <slot />
    </main>
    <footer class="text-center min-h-[4vh] bg-slate-800 text-slate-100">
      Это footer
    </footer>
  </div>
</template>
