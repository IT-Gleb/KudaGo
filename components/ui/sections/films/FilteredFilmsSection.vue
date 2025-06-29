<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import FilmCard from "./FilmCard.vue";
import FilteredPagination from "./FilteredPagination.vue";

import { FilterStore } from "~/store/filterFilmStore";
import type { IFilmsResult } from "~/types/filmTypes";
const countOnPage: number = 10;

const activePage = ref<number>(1);
const ItemsOnPage = ref<IFilmsResult[]>([]);

const store = FilterStore();

const { filtered, Size } = storeToRefs(store);

const handleData = () => {
  ItemsOnPage.value = filtered.value.results.slice(
    (activePage.value - 1) * countOnPage,
    (activePage.value - 1) * countOnPage + countOnPage
  );
  //   console.log(ItemsOnPage.value.length);
};

const totalPage = computed(() => Math.ceil(Size.value / countOnPage));

const handleActivePage = (param: number) => {
  activePage.value = param;
};

watch(activePage, () => {
  handleData();
});

watch(
  filtered,
  () => {
    activePage.value = 1;
    handleData();
  },
  { deep: true }
);

onMounted(() => {
  activePage.value = 1;
  handleData();
});
</script>

<template>
  <section class="w-[98%] md:w-[80%] mx-auto min-h-screen p-2">
    <h3>
      Фильмы
      <span
        class="text-[clamp(0.5rem,1rem,1.5rem)]/[clamp(0.75rem,1.2rem,1.75rem)]"
        >отфильтровано (<mark>{{ Size }}</mark
        >) страниц (<mark>{{ totalPage }}</mark
        >) текущая страница (<mark>{{ activePage }}</mark
        >)</span
      >
    </h3>

    <FilteredPagination
      v-if="Size > countOnPage"
      :onPage="countOnPage"
      :active-page="activePage"
      :change-page="handleActivePage"
    />
    <FilmCard v-for="item in ItemsOnPage" :key="item.id" :item="item" />
    <FilteredPagination
      v-if="Size > countOnPage"
      :onPage="countOnPage"
      :active-page="activePage"
      :change-page="handleActivePage"
    />
  </section>
</template>
