<script setup lang="ts">
import Rus from "~/components/svg/Rus.vue";
import Usa from "~/components/svg/Usa.vue";
import { useI18n } from "#i18n";

const { setLocale, locales } = useI18n();
const isRusLocale = ref<boolean>(locales.value[0].code === "ru");

const handleLocale = () => {
  isRusLocale.value = !isRusLocale.value;
};

watch(isRusLocale, async (newValue: boolean) => {
  newValue ? await setLocale("ru") : await setLocale("en");
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
