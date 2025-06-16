<script setup lang="ts">
const count = ref<number>(0);

function increment() {
  count.value++;
}

const decrement = () => {
  count.value--;
};

defineExpose({ increment, decrement });
</script>

<template>
  <div class="w-fit mx-auto my-5 p-2 bg-slate-100">{{ count }}</div>
</template>
