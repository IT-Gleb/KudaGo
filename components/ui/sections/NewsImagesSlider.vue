<script setup lang="ts">
import { ref, useTemplateRef } from "vue";
import nextSvg from "../svg/nextSvg.vue";
import { vIntersectionObserver } from "@vueuse/components";

//import type { TemplateRefsList } from "@vueuse/core";

const itemsRef = ref<HTMLDivElement[]>([]);
const ActiveIndex = ref<number>(0);

const props = defineProps<{ images: TNewsImages }>();
const targetIsVisible = shallowRef(true);

//const imgsRef = ref<TemplateRefsList<HTMLDivElement>[]>([]);
// if (props.images.length > 0) {
//   imgsRef.value.length = props.images.length;
// }
//const containerRef = useTemplateRef<HTMLDivElement>("imageContainer");
const root = useTemplateRef<HTMLDivElement>("root");

const ItemInView = (paramIndex: number) => {
  (itemsRef.value[paramIndex] as HTMLDivElement).scrollIntoView({
    behavior: "smooth",
    block: "nearest",
    inline: "center",
  });
};

const handleNext = () => {
  const { length } = itemsRef.value;
  if (length > 0) {
    ActiveIndex.value += 1;
    ActiveIndex.value = Math.min(ActiveIndex.value, length - 1);
  }
};

const handlePrev = () => {
  const { length } = itemsRef.value;
  if (length > 0) {
    ActiveIndex.value -= 1;
    ActiveIndex.value = Math.max(0, ActiveIndex.value);
  }
};

function onIntersectionObserver([entry]: IntersectionObserverEntry[]) {
  targetIsVisible.value = entry?.isIntersecting || false;
  if (targetIsVisible.value) {
    ActiveIndex.value = Number((entry.target as HTMLDivElement).dataset.item);
  }
}

watch(ActiveIndex, () => {
  //console.log(oldValue, newValue);
  ItemInView(ActiveIndex.value);
});
</script>

<template>
  <div class="flex flex-col w-fit mx-auto">
    <div class="w-fit my-5 relative">
      <button
        @click.prevent="handlePrev"
        class="w-[32px] h-[32px] sm:h-[64px] bg-transparent text-yellow-400 dark:text-slate-300 font-bold place-content-center cursor-pointer -scale-100 active:-scale-90 absolute left-0 md:left-8 top-[45%] z-10"
      >
        <div
          v-show="itemsRef.length > 1 && ActiveIndex > 0"
          class="w-[32px] h-[32px] md:w-[64px] md:h-[64px]"
          title="Предыдущий"
        >
          <nextSvg />
        </div>
      </button>
      <div
        ref="root"
        class="w-[320px] h-[214px] sm:w-[480px] sm:h-[320px] lg:w-[640px] lg:h-[384px] overflow-y-hidden overflow-x-scroll relative"
        style="
          scroll-snap-type: x mandatory;
          scroll-snap-align: center;
          scrollbar-width: none;
        "
      >
        <div class="absolute left-0 top-0 flex flex-row items-start">
          <div
            v-for="(item, index) in props.images"
            :key="index"
            ref="itemsRef"
            :data-item="index"
            class="w-[320px] sm:w-[480px] lg:w-[640px] object-left-top object-cover"
            v-intersection-observer="[
              onIntersectionObserver,
              { root, threshold: [0.25, 0.85] },
            ]"
          >
            <img
              :src="item.thumbnails['640x384']"
              :alt="item.source.name"
              decoding="async"
              loading="lazy"
              class="block w-full h-full"
            />
          </div>
        </div>
      </div>
      <button
        v-show="itemsRef.length > 1 && ActiveIndex < itemsRef.length - 1"
        @click.prevent="handleNext"
        class="w-[32px] h-[32px] sm:[w-64px] sm:h-[64px] bg-transparent text-yellow-400 dark:text-slate-300 font-bold place-content-center cursor-pointer active:scale-90 absolute right-0 md:right-8 top-[45%] z-10"
      >
        <div
          class="w-[32px] h-[32px] md:w-[64px] md:h-[64px]"
          title="Следующий"
        >
          <nextSvg />
        </div>
      </button>
    </div>
    <div
      v-show="itemsRef.length > 1"
      class="w-fit mx-auto flex flex-row items-center gap-x-3"
    >
      <div
        v-for="(i, index) in itemsRef"
        :key="index"
        class="w-[10px] h-[10px] lg:w-[16px] lg:h-[16px] rounded-full mb-5"
        :class="
          index === ActiveIndex
            ? 'bg-indigo-700 dark:bg-slate-400'
            : 'bg-transparent border border-indigo-700 dark:border-slate-400'
        "
      ></div>
    </div>
  </div>
</template>
