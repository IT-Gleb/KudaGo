<script setup lang="ts">
const props = defineProps<{ message: string }>();
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
  }, 3000);
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
    class="w-[96%] xl:w-[60%] mx-auto bg-slate-700 text-slate-100 dark:bg-slate-500 dark:text-yellow-100 font-['Roboto'] font-[500] rounded-md shadow-md shadow-slate-950 dark:shadow-black place-content-center text-center p-1"
    :style="{ top: `${randomIntegerFromMinMax(85, 96)}%` }"
  >
    <span class="w-fit mx-auto">
      {{ props.message }}
    </span>

    <button
      type="button"
      popovertarget="pop"
      popovertargetaction="hide"
      class="px-2 min-w-[20px] min-h-[20px] cursor-pointer bg-slate-500 text-white active:scale-90 ml-[5rem] rounded-md"
      @click="handleClose"
    >
      <span aria-hidden="true">x</span>
    </button>
  </div>
</template>

<style scoped>
[popover] {
  @starting-style {
    opacity: 1;
  }

  &:popover-open {
    opacity: 1;
    animation: popoverUp 0.35s ease-in;
  }
  &:not(:popover-open) {
    transform: scale(0);
    transition: all 0.35s ease-out;
    animation: popverHide 0.5s ease-out;
  }
}

@keyframes popoverUp {
  0% {
    /* opacity: 0.5; */
    /* top: 0%; */
    transform: scaleX(0.25);
  }
  100% {
    opacity: 1;
    /* top: 94%; */
    transform: scaleX(1);
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
