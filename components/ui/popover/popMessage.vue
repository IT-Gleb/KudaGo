<script setup lang="ts">
import { PopMessageStore } from "~/store/popMessagesStore";

const popTop = ref<number>(window.innerHeight - 50);

const messagesStore = PopMessageStore();
const { messages } = storeToRefs(messagesStore);

const calculateHeight = (param: string[]) => {
  let windowHeight = window.innerHeight;
  let myHeight = Number(
    popRef.value!.getBoundingClientRect().height.toFixed(1)
  );
  if (myHeight < 1) {
    myHeight = 55;
  }
  // console.log(myHeight);
  param.length < 2
    ? (popTop.value = windowHeight - myHeight - 10)
    : (popTop.value = windowHeight - myHeight - 5);
  // console.log(popTop.value);
};

messagesStore.$subscribe(
  (mutation, state) => {
    //mutation.type может быть "direct" | "patch object" | "patch function"
    if (mutation.type !== "direct") {
      return;
    }
    // console.log(mutation, state);
    calculateHeight(state.messages);
    if (state.messages.length > 0) {
      popRef.value?.showPopover();
    } else {
      handleClose();
    }
  },
  {
    flush: "sync",
    deep: true,
  }
);

const popRef = ref<HTMLDivElement>();
const timerRef = ref<NodeJS.Timeout | null>(null);

const clearTimer = () => {
  if (timerRef.value !== null) {
    clearTimeout(timerRef.value);
    timerRef.value = null;
  }
};

const showThisPopover = () => {
  popRef.value?.showPopover();
  timerRef.value = setTimeout(() => {
    popRef.value?.hidePopover();
    clearTimer();
  }, 30000);
};

const handleClose = () => {
  popRef.value?.hidePopover();
  clearTimer();
};

onUnmounted(() => {
  clearTimer();
});

defineExpose({ popRef, showThisPopover });
</script>

<template>
  <div
    id="pop"
    ref="popRef"
    popover="manual"
    class="w-[96%] left-1 xl:w-[60%] bg-slate-700 transition-all text-slate-100 dark:bg-slate-500 dark:text-yellow-100 font-['Roboto'] font-[500] rounded-md place-content-center p-1 overflow-hidden"
    :style="{ top: `${popTop}px` }"
  >
    <div class="flex flex-row gap-2 items-start justify-between p-2">
      <div class="flex flex-col items-start gap-2">
        <span v-for="item in messages" class="block w-fit mx-auto" :key="item">
          {{ item }}
        </span>
      </div>

      <button
        type="button"
        popovertarget="pop"
        popovertargetaction="hide"
        class="px-2 min-w-[28px] min-h-[28px] cursor-pointer bg-slate-500 text-white active:scale-90 ml-[5rem] rounded-md float-right"
        @click="handleClose"
      >
        <span aria-hidden="true">x</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
[popover] {
  @starting-style {
    opacity: 1;
  }

  &:popover-open {
    opacity: 1;
    animation: popoverUp 0.35s ease;
  }
  &:not(:popover-open) {
    transform: scale(0);
    transition: all 0.35s ease-out;
    animation: popverHide 0.5s ease-out;
  }
}

@keyframes popoverUp {
  0% {
    opacity: 0.5;
    /* top: 120%; */
    /* transform: scaleX(0.25); */
    transform: translateY(300%);
  }
  100% {
    opacity: 1;
    /* top: 90%; */
    /* transform: scaleX(1); */
    transform: translateY(0);
  }
}

@keyframes popoverHide {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
</style>
