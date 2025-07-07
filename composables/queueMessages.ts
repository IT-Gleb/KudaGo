import { ref, computed, watch } from "vue";

export const usePopMessages = () => {
  const messagesQueue = ref<string[]>([]);
  const messagesSize = computed(() => messagesQueue.value.length);
  const timerRef = ref<NodeJS.Timeout | null>(null);

  function PopPush(param: string) {
    messagesQueue.value.push(param);
    console.log("add: ", param);
  }
  function RemoveFirst() {
    const tmp = messagesQueue.value.shift();
    console.log("deleted: ", tmp);
  }

  function ClearTimer() {
    if (timerRef.value !== null) {
      clearInterval(timerRef.value);
    }
    timerRef.value = null;
    // console.log("timer: ", timerRef.value);
  }

  watch(
    messagesQueue,
    () => {
      if (messagesQueue.value.length > 0 && timerRef.value === null) {
        timerRef.value = setInterval(() => {
          RemoveFirst();
        }, 5000);
      }

      if (messagesQueue.value.length < 1 && timerRef.value !== null) {
        ClearTimer();
      }
    },
    { deep: true }
  );

  return {
    messagesQueue,
    messagesSize,
    PopPush,
  };
};
