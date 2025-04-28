<script setup lang="ts">
import { useCityes } from "~/store/cityStore";
import { storeToRefs } from "pinia";

const store = useCityes();
const { towns } = storeToRefs(store);
const { SetItem } = store;

const City = ref<TCity>();

watch(City, (newValue) => {
  if (newValue) {
    SetItem(newValue.slug);
  }
  //console.log(newValue?.slug);
});
</script>

<template>
  <div class="flex flex-row gap-x-2 items-center">
    <div>Город:</div>
    <select
      class="p-1 border border-black bg-white dark:text-indigo-950"
      v-model="City"
    >
      <option v-for="item of towns" :key="item.id" :value="item">
        {{ item.name }}
      </option>
    </select>
  </div>
</template>
