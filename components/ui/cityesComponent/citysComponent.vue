<script setup lang="ts">
import { useCityes } from "~/store/cityStore";
import { storeToRefs } from "pinia";

const store = useCityes();
const { towns, SelectedItem } = storeToRefs(store);
const { SetItem } = store;

const City = ref<TCity>();

// const handleChange = (event: Event) => {
//   const { value } = <HTMLSelectElement>event.target;

//   //console.log(value);
//   SetItem(value);
// };

watch(SelectedItem, () => {
  //console.log(SelectedItem.value.slug);
  City.value = SelectedItem.value;
});

watch(City, () => {
  //console.log(City.value.name);
  SetItem(City.value?.slug as string);
  //  console.log(City.value.slug, props.select.slug);
});

onMounted(() => {
  City.value = towns.value[0];
});
</script>

<template>
  <div class="flex flex-row gap-x-2 items-center">
    <div>Город:</div>
    <select
      name="selectCity"
      id="selectCity"
      class="p-1 outline-none border border-black dark:border-slate-100 bg-white dark:bg-slate-300 dark:text-indigo-950"
      v-model="City"
    >
      <option v-for="item of towns" :key="item.id" :value="item">
        {{ item.name }}
      </option>
    </select>
  </div>
</template>
