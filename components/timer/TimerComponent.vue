<script setup lang="ts">
import { ref } from "vue";
import { vIntersectionObserver } from "@vueuse/components";

const DateStr = ref<string>();
const timerRef = ref<number>(-1);
const delayTimer: number = 1200;

function formatDate(): string {
  const dt: number = Date.now();
  return Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(dt);
}

DateStr.value = formatDate();

function clearTimer() {
  if (timerRef.value !== -1) {
    window.clearInterval(timerRef.value);
    timerRef.value = -1;
  }
}

function onVisible([entry]: IntersectionObserverEntry[]) {
  const isVisible: boolean = entry.isIntersecting ?? false;
  if (isVisible) {
    clearTimer();
    timerRef.value = window.setInterval(() => {
      DateStr.value = formatDate();
    }, delayTimer);
  } else {
    clearTimer();
  }
}

onUnmounted(() => {
  clearTimer();
});
</script>

<template>
  <span
    v-intersection-observer="[onVisible, { threshold: [1] }]"
    class="font-mono font-bold whitespace-nowrap"
    ><small>{{ DateStr }}</small></span
  >
</template>
