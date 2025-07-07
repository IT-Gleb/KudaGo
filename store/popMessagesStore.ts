import { defineStore } from "pinia";
import { ref, computed } from "vue";

const delayMsg: number = 5000;

export const PopMessageStore = defineStore("popMessages", () => {
  const messages = ref<string[]>([]);
  const timerRef = ref<NodeJS.Timeout | null>(null);

  const queueSize = computed(() => messages.value.length);

  function ClearTimeOut() {
    if (timerRef.value !== null) {
      clearInterval(timerRef.value);
    }
    timerRef.value = null;
  }

  function DeleteFirst() {
    if (messages.value.length > 0) {
      messages.value.shift();
    }
    if (messages.value.length < 1) {
      ClearTimeOut();
    }
  }

  function PopPush(param: string) {
    messages.value.push(param);
    if (messages.value.length > 0 && timerRef.value === null) {
      timerRef.value = setInterval(() => {
        DeleteFirst();
      }, delayMsg);
    }
  }

  return {
    queueSize,
    messages,
    PopPush,
  };
});
