<script setup lang="ts">
import { nanoid } from "nanoid";
import { FilmsSectionId } from "~/utils/functions";

type TMainScreenItem = {
  id: string;
  label: string;
  href: string;
};
const config = useRuntimeConfig();

//console.log(config.public.nuxtSiteName);

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

const MainMenuItems = ref<TMainScreenItem[]>([
  { id: nanoid(), label: "Новости", href: "#" },
  {
    id: nanoid(),
    label: "Контент",
    href: `${config.public.nuxtSiteName}/sitemap.xml`,
  },
  { id: nanoid(), label: "Фильмы", href: "" },
  { id: nanoid(), label: "Примеры", href: "/primers" },
]);
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
