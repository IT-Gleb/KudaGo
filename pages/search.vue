<script setup lang="ts">
import { useSearchData } from "~/components/search/controller/SearchDataController";
import type { TSearchDataObject } from "~/types/serchTypes";
import { FormatDateFromNumber } from "~/utils/functions";
import loaderComponent from "~/components/loader/loaderComponent.vue";

const itemsOnPage: number = 15;

const router = useRouter();

const paramSearch = useState<string>("searchTxt");

const handleMain = () => {
  router.replace({ path: "/" });
};

const currentPage = ref<number>(1);

const { status, searchdata, error, execute } = useSearchData(
  paramSearch,
  currentPage
);

const serchItems = computed(() => {
  if (searchdata.value) {
    return searchdata.value.count !== null ? searchdata.value.count : 0;
  } else {
    return 0;
  }
});
</script>

<template>
  <section class="p-1 lg:w-[80%] mx-auto">
    <div class="flex flex-row items-center justify-between my-10">
      <button
        type="button"
        aria-label="На главную"
        class="min-w-[60px] min-h-[30px] p-2 place-content-center bg-slate-600 text-slate-100 active:scale-90 cursor-pointer"
        @click="handleMain"
      >
        На главную
      </button>

      <div>
        Параметры поиска:
        <span v-if="paramSearch !== ''"
          ><mark>{{ paramSearch }}</mark></span
        >
      </div>
      <button
        type="button"
        aria-label="Обновить"
        class="min-w-[60px] min-h-[30px] p-1 bg-indigo-950 text-slate-300 active:scale-90 cursor-pointer rounded-md"
        @click="async () => await execute()"
      >
        Обновить
      </button>
    </div>

    <div class="my-10">
      <div
        v-if="status === 'pending'"
        class="w-[34px] h-[34px] mx-auto text-orange-600 dark:text-slate-400"
      >
        <loader-component />
      </div>
      <div v-if="error !== null">{{ error }}</div>
    </div>
    <div v-if="status !== 'pending' && status !== 'error' && serchItems < 1">
      <h4>Нет Данных</h4>
    </div>

    <div v-if="(status === 'success' || status === 'idle') && serchItems > 0">
      Найдено: {{ serchItems }}

      <div class="my-10 text-[1rem]/[1.2rem] font-light">
        <div
          v-for="([key, value], index) in Object.entries(searchdata?.results as TSearchDataObject)"
          :key="index"
          class="my-5 font-bold font-['Roboto'] p-1"
        >
          <h5 class="text-orange-600">
            {{
              (key as string) === "unknow"
                ? "Дата начала не указана"
                : FormatDateFromNumber(Number(key))
            }}
          </h5>
          <hr class="text-orange-700" />
          <div
            class="ml-2 mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            <article v-for="item in value" :key="item.id" class="">
              <header
                class="bg-orange-200 h-[80px] p-1 place-content-center overflow-hidden"
              >
                <h6 class="font-['Roboto'] text-[1em]/[1.25em] text-pretty">
                  {{ item.title }}
                </h6>
              </header>
              <main>
                <div
                  v-if="item.first_image"
                  class="w-full object-cover object-center"
                >
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
                <p
                  class="indent-5 text-pretty font-light first-letter:uppercase text-[1.4em]/[1.4em] sm:text-[1.1em]/[1.1em] lg:text-[0.8em]/[1.2em] mt-1"
                >
                  {{ item.description }}
                </p>
                <div class="grid grid-cols-2 p-1">
                  <hr class="col-span-2 mt-2 text-orange-600" />
                  <span
                    class="font-light text-[0.76em]/[1em] place-content-center"
                    >Место проведения:
                  </span>
                  <span>{{
                    item.place !== null
                      ? Locations[item.place?.location as unknown as string]
                      : "Не указано"
                  }}</span>
                  <hr class="col-span-2 text-orange-600" />
                  <span
                    class="font-light text-[0.76em]/[1em] place-content-center"
                    >Начало(время):</span
                  >
                  <span>{{
                    item.daterange !== null &&
                    item.daterange.start_time !== null
                      ? FormatTimeFromNumber(
                          item.daterange?.start_time as number
                        )
                      : "Не указано"
                  }}</span>
                </div>
              </main>
              <footer class="text-right p-2 place-content-center">
                <NuxtLink :to="item.item_url" target="_blank">
                  Первоисточник
                </NuxtLink>
              </footer>
            </article>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
