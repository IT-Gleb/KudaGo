<script setup lang="ts">
import ProgresSection from "~/components/ProgressBar_svg/ProgresSection.vue";
import "@cyhnkckali/vue3-color-picker/dist/style.css";
import { useI18n } from "#i18n";
import type { TMyLocale } from "~/types/myTypes";

const { t, setLocale, defaultLocale } = useI18n();

useHead({ title: "Примеры: Counter, ProgressBar, Pie Chart" });

onMounted(async () => {
  const item: TMyLocale = localStorage.getItem("locale") as TMyLocale;
  if (item) {
    await setLocale(item);
  } else {
    await setLocale(defaultLocale);
  }
});
</script>

<template>
  <div class="p-2 my-10 flex flex-col gap-2">
    <div
      class="my-5 place-content-center lg:w-[60%] text-left text-[1.6em]/[2em]"
    >
      <NuxtLink to="/" class="my-5 underline underline-offset-2"
        ><small>{{ t("links.onMainPage") }}</small></NuxtLink
      >
    </div>
    <Suspense>
      <ProgresSection />
    </Suspense>
    <div class="my-5 place-content-center text-right text-[1.6em]/[2em]">
      <NuxtLink to="/" class="underline underline-offset-2"
        ><small>{{ t("links.onMainPage") }}</small></NuxtLink
      >
    </div>
  </div>
</template>
