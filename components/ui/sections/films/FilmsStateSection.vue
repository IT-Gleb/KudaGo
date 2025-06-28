<script setup lang="ts">
import { FilterStore } from "~/store/filterFilmStore";
import FilmsSection from "./FilmsSection.vue";
import FilteredFilmsSection from "./FilteredFilmsSection.vue";
import FilmsFilterComponent from "./FilmsFilterComponent.vue";

const store = FilterStore();
const { hasFilteredData } = storeToRefs(store);
</script>

<template>
  <section class="w-[98%] lg:w-[80%] mx-auto p-2">
    <div class="my-4 p-1">
      <FilmsFilterComponent />
    </div>
  </section>

  <FilmsSection v-if="!hasFilteredData" />
  <FilteredFilmsSection v-if="hasFilteredData" />
</template>
