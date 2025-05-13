<script setup lang="ts">
import { ref } from "vue";
const DateStr = ref<string>();
const timerRef = ref<number>(0);
const delayTimer = ref<number>(1500);

function formatDate(): string {
  const dt = new Date();
  return Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(dt.valueOf());
}

DateStr.value = formatDate();

onMounted(() => {
  timerRef.value = window.setInterval(() => {
    DateStr.value = formatDate();
  }, delayTimer.value);
});

onUnmounted(() => {
  window.clearInterval(timerRef.value);
});
</script>

<template>
  <span>{{ DateStr }}</span>
</template>
