<script setup lang="ts">
import { nanoid } from "nanoid";
import { FilmsSectionId } from "~/utils/functions";
import { useI18n, type LocaleMessageType, type VueMessageType } from "#i18n";

const { tm, rt, locale } = useI18n();

type TMainScreenItem = {
  id: string;
  label: string;
  href: string;
};
const config = useRuntimeConfig();

//console.log(config.public.nuxtSiteName);
const MainMenuItems = ref<TMainScreenItem[]>([]);
const { length } = tm("mainMenu");
tm("mainMenu")
  .slice(0, length)
  .map((item: LocaleMessageType<VueMessageType>) => rt(item))
  .forEach((item: string, index: number) =>
    MainMenuItems.value.push({
      id: nanoid(),
      label: item,
      href:
        index === 1
          ? `${config.public.nuxtSiteName}/__sitemap__/${
              locale.value.startsWith("en") ? "en-EN" : "ru-RU"
            }.xml` //`${config.public.nuxtSiteName}/sitemap.xml`
          : index === 2
          ? ""
          : index === 3
          ? "/primers"
          : "#",
    })
  );

const handleFilmsClick = () => {
  const filmsId = document.getElementById(FilmsSectionId);
  if (filmsId) {
    (filmsId as HTMLElement).scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "start",
    });
  }
};
</script>

<template>
  <div
    class="text-[clamp(3vw,4vw,4vw)]/[clamp(3vw,4vw,4vw)] sm:text-[clamp(2.4vw,3vw,2.8vw)]/[clamp(2.4vw,3vw,2.8vw)] md:text-[clamp(1.25vw,2vw,1.8vw)]/[clamp(1.25vw,2vw,1.8vw)] font-['Inter'] flex flex-row flex-wrap items-start md:items-center max-[1023px]:text-slate-200 dark:max-[915px]:text-slate-300 lg:text-indigo-950 dark:lg:text-slate-300 gap-4 justify-center uppercase font-bold"
  >
    <NuxtLink
      rel="noopener"
      v-for="(menuItem, index) in MainMenuItems"
      :key="menuItem.id"
      :to="menuItem.href"
      @click="index === 2 ? handleFilmsClick() : null"
      class="px-1 py-[2px] cursor-pointer hover:bg-slate-300 hover:text-indigo-950 md:hover:bg-indigo-950 md:hover:text-slate-200 dark:hover:bg-slate-300 dark:hover:text-indigo-950"
      >{{ menuItem.label }}</NuxtLink
    >
  </div>
</template>
