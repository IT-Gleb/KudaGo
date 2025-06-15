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
  <div class="w-fit mx-auto my-5">{{ count }}</div>
</template>
