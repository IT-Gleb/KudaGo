<script setup lang="ts">
import { vIntersectionObserver } from "@vueuse/components";
import { useTemplateRef, shallowRef } from "vue";

const props = defineProps<{ compsLength: number }>();
const observeEmit = defineEmits(["onObserve"]);

const isChecked = shallowRef(false);
const checkDivRef = useTemplateRef<HTMLDivElement>("checkDivRef");

const objIndex = ref<number>(-1);

function onCheckerVisible([entry]: IntersectionObserverEntry[]) {
  isChecked.value = entry?.isIntersecting || false;
}

watch(isChecked, () => {
  isChecked.value ? objIndex.value++ : (objIndex.value += 0);
  objIndex.value = Math.min(objIndex.value, props.compsLength - 1);
  observeEmit("onObserve", objIndex.value, isChecked.value);
});
</script>

<template>
  <div
    v-if="objIndex < props.compsLength - 1"
    ref="checkDivRef"
    class="bg-white text-indigo-900 dark:bg-slate-800 dark:text-slate-400 w-full h-[40px] text-center p-1 place-content-center"
    v-intersection-observer="[
      onCheckerVisible,
      { root: checkDivRef, threshold: [0.5, 1] },
    ]"
  >
    Загрузка данных...
  </div>
</template>
