<script setup lang="ts">
import type { ISearchResult } from "~/types/serchTypes";
import { useState } from "#app";

const props = defineProps<{ item: ISearchResult; date: number | string }>();
const stateItem = useState<Partial<ISearchResult>>("eventItem", () => ({}));

const handleSetItem = () => {
  stateItem.value = props.item;
};
</script>

<template>
  <article class="bg-slate-50 dark:bg-slate-950">
    <header
      class="bg-orange-200 dark:bg-black h-[70px] p-1 place-content-center overflow-hidden line-clamp-3"
    >
      <NuxtLink :to="`/items/${item.id}`" @click="handleSetItem">
        <h6
          class="font-['Roboto'] text-[1.3em]/[1.5em] lg:text-[0.9em]/[1.1em]"
        >
          {{ item.title }}
        </h6>
      </NuxtLink>
    </header>
    <main>
      <div v-if="item.first_image" class="w-full h-[160px] overflow-hidden">
        <div class="object-cover object-center">
          <img
            :src="
              item.first_image?.thumbnails !== null
                ? item.first_image?.thumbnails['640x384']
                : item.first_image.image
            "
            alt=""
            loading="lazy"
            decoding="async"
            class="block max-w-full max-h-full"
          />
        </div>
      </div>
      <div class="w-full h-[46px] md:h-[64px] overflow-hidden mt-1">
        <p
          class="indent-5 px-1 line-clamp-2 md:line-clamp-3 font-light first-letter:uppercase text-[1.2em]/[1.2em] sm:text-[1.1em]/[1.1em] lg:text-[0.8em]/[1.2em]"
        >
          {{ item.description }}
        </p>
      </div>
      <div class="grid grid-cols-2 p-1">
        <hr class="col-span-2 mt-2 text-orange-600 dark:text-slate-500" />
        <span class="font-light text-[0.76em]/[1em] place-content-center"
          >Место проведения:
        </span>
        <span
          ><small>{{
            item.place !== null
              ? Locations[item.place?.location as unknown as string]
              : "Не указано"
          }}</small></span
        >
        <hr class="col-span-2 text-orange-600 dark:text-slate-500" />
        <span class="font-light text-[0.76em]/[1em] place-content-center"
          >Начало(Дата):</span
        >
        <span
          ><small>{{
            item.daterange !== null && item.daterange.start_time !== null
              ? FormatDateFromNumber(Number(props.date))
              : "Не указано"
          }}</small></span
        >
        <hr class="col-span-2 text-orange-600 dark:text-slate-500" />
        <span class="font-light text-[0.76em]/[1em] place-content-center"
          >Начало(время):</span
        >
        <span
          ><small>{{
            item.daterange !== null && item.daterange.start_time !== null
              ? FormatTimeFromNumber(item.daterange?.start_time as number)
              : "Не указано"
          }}</small></span
        >
      </div>
    </main>
    <footer
      class="text-right p-2 place-content-center bg-orange-100 dark:bg-black"
    >
      <NuxtLink :to="item.item_url" target="_blank">
        <small>Первоисточник</small>
      </NuxtLink>
    </footer>
  </article>
</template>
