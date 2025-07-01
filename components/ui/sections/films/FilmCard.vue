<script setup lang="ts">
import type { IFilmsResult } from "~/types/filmTypes";

const props = defineProps<{ item: IFilmsResult }>();
const mpaa_rating_string = ref<string>("Нет возрастных ограничений");

watch(
  props.item,
  () => {
    if (props.item.mpaa_rating) {
      switch (props.item.mpaa_rating.toLowerCase()) {
        case "g":
          mpaa_rating_string.value = "Нет возрастных ограничений";
          break;
        case "pg":
          mpaa_rating_string.value = "Рекомендуется присутствие родителей";
          break;
        case "pg-13":
          mpaa_rating_string.value = "Детям до 13 лет просмотр не желателен";
          break;
        case "r":
          mpaa_rating_string.value =
            "Лицам до 17 лет обязательно присутствие взрослого";
          break;
        case "nc-17":
          mpaa_rating_string.value = "Лицам до 18 лет просмотр запрещен";
          break;
        default:
          mpaa_rating_string.value = "Нет возрастных ограничений";
          break;
      }
    }
  },
  { deep: true }
);
</script>

<template>
  <article
    class="w-[99%] lg:w-[80%] mx-auto grid grid-cols-[160px_1fr] sm:grid-cols-[240px_1fr] gap-x-2 gap-y-4 p-2 mt-2 odd:bg-slate-50 dark:odd:bg-slate-950"
  >
    <div
      class="w-[160px] h-[240px] lg:w-[240px] lg:h-[360px] object-cover object-center overflow-hidden rounded-lg"
    >
      <img
        :src="
          item.poster !== null && typeof item.poster.image !== undefined
            ? item.poster.image
            : 'NoPoster.webp'
        "
        alt=""
        loading="lazy"
        decoding="async"
        class="block w-full h-full"
      />
    </div>
    <div class="grid grid-cols-[100px_1fr] lg:grid-cols-[140px_1fr] gap-2 ml-2">
      <div class="col-span-2">
        <h4
          class="text-[clamp(1rem,1.8rem,2.6rem)]/[clamp(1.2rem,2.1rem,3.1rem)] text-balance"
        >
          {{ item.title }}
        </h4>
      </div>
      <div class="font-bold"><small>Рейтинг (IMDB):</small></div>
      <div>{{ item.imdb_rating ? item.imdb_rating : "нет" }}</div>
      <div class="font-bold"><small>Возрастные ограничения:</small></div>
      <div class="col-span-2 md:col-auto indent-5 text-pretty">
        {{
          item.mpaa_rating
            ? mpaa_rating_string + " -> " + item.mpaa_rating
            : "нет"
        }}
      </div>

      <div class="font-bold"><small>Год выпуска:</small></div>
      <div>{{ item.year }}</div>
      <div class="font-bold"><small>Страна:</small></div>
      <div class="col-span-2 md:col-auto indent-5 text-pretty">
        {{ item.country }}
      </div>
      <div v-if="item.budget as number > 0" class="font-bold">
        <small>Бюджет фильма:</small>
      </div>
      <div
        v-if="item.budget as number > 0"
        class="col-span-2 md:col-auto indent-3 text-pretty"
      >
        {{
          Intl.NumberFormat("en-EN", {
            style: "currency",
            currency: "USD",
          }).format(item.budget as number)
        }}
      </div>
      <div v-if="item.director" class="font-bold">
        <small>Режиссер:</small>
      </div>
      <div
        v-if="item.director"
        class="col-span-2 md:col-auto indent-5 text-pretty"
      >
        {{ item.director }}
      </div>
      <div v-if="item.stars" class="font-bold">
        <small>Актеры:</small>
      </div>
      <div v-if="item.stars" class="col-span-2 md:col-auto indent-5">
        {{ item.stars }}
      </div>
      <div v-if="item.description" class="font-bold">
        <small>Описание:</small>
      </div>
      <p
        v-if="item.description && item.description?.length > 0"
        class="indent-2 col-span-2 md:col-auto"
      >
        {{ item.description }}
      </p>
      <div class="font-bold"><small>Жанр:</small></div>
      <div class="col-span-2 md:col-auto">
        <p
          v-for="aa in item.genres"
          :key="aa.id"
          class="first-letter:uppercase"
        >
          {{ aa.name.trim() + " -> " + aa.slug.trim() }}
        </p>
      </div>
    </div>
  </article>
</template>
