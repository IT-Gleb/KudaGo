<script setup lang="ts">
import Rus from "~/components/svg/Rus.vue";
import Usa from "~/components/svg/Usa.vue";
import { useI18n } from "#i18n";
import type { TMyLocale } from "~/types/myTypes";

const { setLocale, defaultLocale } = useI18n();
const isRusLocale = ref<boolean>(defaultLocale === "ru");

const handleLocale = () => {
  isRusLocale.value = !isRusLocale.value;
};

const saveLocale = async (param: boolean) => {
  const item: TMyLocale = param ? "ru" : "en";
  await setLocale(item);
  localStorage.setItem("locale", item);
  isRusLocale.value = item === "ru";
};

watch(isRusLocale, async (newValue: boolean) => {
  await saveLocale(newValue);
});

onBeforeMount(async () => {
  const item: TMyLocale = localStorage.getItem("locale") as TMyLocale;
  if (item !== null) {
    setLocale(item);
  } else {
    await setLocale(defaultLocale);
    localStorage.setItem("locale", defaultLocale);
  }
  isRusLocale.value = item === "ru";
});
</script>

<template>
  <button
    type="button"
    class="w-[32px] h-[32px] rounded-full overflow-hidden active:scale-90 cursor-pointer object-cover object-left-top"
    @click="handleLocale"
  >
    <Rus v-if="isRusLocale" />
    <Usa v-if="!isRusLocale" />
  </button>
</template>
