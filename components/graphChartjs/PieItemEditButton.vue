<script setup lang="ts">
const props = defineProps<{ run: () => void }>();

const handleClick = (event: MouseEvent) => {
  event.preventDefault();
  props.run();
};
</script>

<template>
  <button
    type="button"
    class="w-[18px] h-[18px] md:w-[24px] md:h-[24px] cursor-pointer active:scale-90"
    title="Изменить"
    @click="handleClick"
  >
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.2178 3.94399L12.0953 2.09796C13.1323 1.07843 14.8135 1.07843 15.8504 2.09796L17.7279 3.94399C18.7648 4.96352 18.7648 6.61651 17.7279 7.63604L15.8504 9.48207M10.2178 3.94399L2.56463 11.4688C2.1365 11.8897 1.86755 12.4419 1.80237 13.0338L1.34134 17.2201C1.24381 18.1057 2.05713 18.8251 2.9425 18.6363L6.77269 17.82C7.27079 17.7138 7.72729 17.4689 8.08768 17.1146L15.8504 9.48207M10.2178 3.94399L15.8504 9.48207M13.0341 18.4932H18.6667"
        stroke="#99A1B7"
        stroke-width="1.5"
        stroke-linecap="round"
      />
    </svg>
  </button>
</template>
