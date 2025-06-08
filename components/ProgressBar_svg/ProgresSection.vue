<script setup lang="ts">
import ProgressBar from "./ProgressBar.vue";
</script>

<template>
  <section class="min-h-screen p-1 py-10">
    <div class="w-fit mx-auto mt-5">
      <ProgressBar
        :width="140"
        :progress-type="{ type: 'in-progress', color: '#60a5fa' }"
        :step="6"
        :progress="4"
      />
    </div>
  </section>
</template>
