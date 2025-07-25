<script setup lang="ts">
import { markRaw, type Component } from "vue";
import Museum from "~/components/svg/Museum.vue";
import RaveConcert from "~/components/svg/RaveConcert.vue";
import MainScreenMenu from "~/components/ui/menus/MainScreenMenu/MainScreenMenu.vue";
import NewsBlock from "~/components/ui/sections/NewsBlock.vue";
import EventOfDay from "~/components/ui/sections/eventOfDay/EventOfDay.vue";
import DivObserveDataLoad from "~/components/ui/intersectObserve/DivObserveDataLoad.vue";
import MyErrorComponent from "~/components/ui/myError/MyErrorComponent.vue";
// import FilmsSection from "~/components/ui/sections/films/FilmsSection.vue";
import FilmsStateSection from "~/components/ui/sections/films/FilmsStateSection.vue";
import filmComponent from "~/components/ui/film/filmComponent.vue";
import { nanoid } from "nanoid";
import {
  useI18n,
  useLocaleHead,
  type LocaleMessageType,
  type VueMessageType,
} from "#i18n";
import type { TMyLocale } from "~/types/myTypes";

const { t, tm, rt, setLocale, defaultLocale } = useI18n();
const i18nHead = useLocaleHead({ seo: { canonicalQueries: ["ru"] } });

const { length } = tm("mainTitle");
const MainTitle: Array<string> = tm("mainTitle")
  .slice(0, length)
  .map((item: LocaleMessageType<VueMessageType>) => rt(item));

useHead({
  htmlAttrs: { lang: i18nHead.value.htmlAttrs.lang },
  title: "Новости:[Kuda Go]",
  meta: [
    { name: "description", content: t("title") },
    { name: "author", content: t("author") },
  ],
});

const ViewComponentsArray = reactive<
  { id: string; inview: boolean; component: Component }[]
>([
  { id: nanoid(), inview: false, component: markRaw(EventOfDay) },
  { id: nanoid(), inview: false, component: markRaw(NewsBlock) },
  { id: nanoid(), inview: false, component: markRaw(FilmsStateSection) },
  { id: nanoid(), inview: false, component: markRaw(filmComponent) },
]);
const handleObserve = (param1: number, param2: boolean) => {
  // console.log("index: ", param1, "value: ", param2);
  if (param2) {
    ViewComponentsArray[param1].inview = param2;
  }
};

onBeforeMount(async () => {
  const item: TMyLocale = localStorage.getItem("locale") as TMyLocale;
  if (item) {
    await setLocale(item);
  } else {
    await setLocale(defaultLocale);
  }
});

onMounted(() => {
  window.onbeforeunload = (event: BeforeUnloadEvent) => {
    return true;
  };
});

onUnmounted(() => {
  //window.onbeforeunload = null;
});
</script>

<template>
  <div>
    <section
      class="h-[95dvh] flex flex-col gap-0 bg-[linear-gradient(to_bottom,theme(colors.slate.200),theme(colors.indigo.950)_40%)] dark:bg-[linear-gradient(to_bottom,theme(colors.indigo.950),theme(colors.slate.900)_40%)] relative"
    >
      <div
        class="absolute max-[767px]:left-[5%] max-[1023px]:left-[25%] lg:left-[50%] max-[1023px]:top-[46%] lg:top-[40%] p-2 z-10"
      >
        <MainScreenMenu />
      </div>

      <div
        class="bg-slate-200 dark:bg-slate-950 w-full h-[48%] place-content-center flex flex-col md:flex-row items-center justify-evenly"
      >
        <div
          class="w-full md:w-[55%] uppercase text-[length:clamp(12vw,22vw,14vw)] md:text-[length:clamp(5vw,12vw,11vw)] font-['Inter'] font-bold text-slate-800 dark:text-slate-300 pl-20"
        >
          {{ MainTitle[0] }}
        </div>
        <div
          class="w-[280px] md:w-[380px] xl:w-[680px] object-fill text-indigo-950 dark:text-slate-600 -scale-x-90"
        >
          <Museum />
        </div>
      </div>
      <div
        class="w-full h-[18%] md:h-[42%] bg-slate-200 dark:bg-slate-950 [mask-image:url('/svg/wave.svg')] [mask-position:left_top] [mask-repeat:no-repeat] [mask-size:100%]"
      ></div>
      <div
        class="bg-indigo-950 bg-[url('/svg/tusa.svg')] bg-repeat-x bg-contain bg-bottom-left dark:bg-slate-900 w-full h-[75%] lg:h-[33%] overflow-hidden place-content-start xl:place-content-center flex flex-col-reverse gap-5 lg:gap-0 lg:flex-row items-center justify-center"
      >
        <div
          class="hidden xl:block lg:w-[320px] xl:ml-20 xl:w-[450px] text-slate-400 dark:text-slate-600 mask-b-from-20% mask-b-to-90%"
        >
          <RaveConcert />
        </div>
        <div
          class="md:w-[70%] md:ml-[12%] md:text-left uppercase text-[length:clamp(12vw,22vw,14vw)] md:text-[length:clamp(5vw,11vw,11vw)] font-['Inter'] font-bold text-slate-200 xl:pb-4"
        >
          {{ MainTitle[1] }}
        </div>
      </div>
    </section>
    <Suspense v-for="item in ViewComponentsArray" :key="item.id">
      <NuxtErrorBoundary
        @error="
          () => {
            console.log('Ups');
          }
        "
      >
        <component v-if="item.inview" :is="item.component"></component>
        <template #error="{ error, clearError }">
          <MyErrorComponent :err-object="error" :err-fn="clearError" />
        </template>
      </NuxtErrorBoundary>
    </Suspense>
    <DivObserveDataLoad
      :comps-length="ViewComponentsArray.length"
      @on-observe="handleObserve"
    />
  </div>
</template>
