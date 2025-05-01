<script setup lang="ts">
import { useCityes } from "~/store/cityStore";
import { storeToRefs } from "pinia";

const store = useCityes();
const { towns } = storeToRefs(store);
const { SetItem } = store;

const City = ref<TCity>({ id: 103, slug: "*", name: "*" });

// const handleChange = (event: Event) => {
//   const { value } = <HTMLSelectElement>event.target;

//   //console.log(value);
//   SetItem(value);
// };
watch(City, () => {
  //console.log(City.value.name);
  SetItem(City.value?.slug as string);
});
</script>

<template>
  <div class="flex flex-row gap-x-2 items-center">
    <div>Город:</div>
    <select
      name="selectCity"
      class="p-1 outline-none border border-black bg-white dark:text-indigo-950"
      v-model="City"
    >
      <option
        v-for="item of towns"
        :key="item.id"
        :value="item"
        :selected="City.slug === '*'"
      >
        {{ item.name }}
      </option>
    </select>
  </div>
</template>
