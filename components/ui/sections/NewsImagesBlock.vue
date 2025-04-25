<script setup lang="ts">
import { ref } from "vue";
import nextSvg from "../svg/nextSvg.vue";

const itemsRef = ref<HTMLDivElement[]>([]);
const ActiveIndex = ref<number>(0);

const props = defineProps<{ images: TNewsImages }>();

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
    ActiveIndex.value++;
    ActiveIndex.value = Math.min(ActiveIndex.value, length - 1);
    ItemInView(ActiveIndex.value);
  }
};

const handlePrev = () => {
  const { length } = itemsRef.value;
  if (length > 0) {
    ActiveIndex.value--;
    ActiveIndex.value = Math.max(0, ActiveIndex.value);
    ItemInView(ActiveIndex.value);
  }
};
</script>

<template>
  <div class="flex flex-col sm:flex-row items-center w-fit mx-auto my-5">
    <button
      v-show="itemsRef.length > 1"
      @click.prevent="handlePrev"
      class="w-[32px] h-[32px] sm:h-[200px] bg-transparent text-indigo-950 dark:text-slate-300 font-bold place-content-center cursor-pointer -scale-100 active:-scale-90"
    >
      <nextSvg />
    </button>
    <div
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
          ref="itemsRef"
          :key="index"
          class="w-[320px] sm:w-[480px] lg:w-[640px] object-center object-cover"
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
      v-show="itemsRef.length > 1"
      @click.prevent="handleNext"
      class="w-[32px] h-[32px] sm:h-[200px] bg-transparent text-indigo-950 dark:text-slate-300 font-bold place-content-center cursor-pointer active:scale-90"
    >
      <nextSvg />
    </button>
  </div>
</template>
