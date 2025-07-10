<script setup lang="ts">
import ThemeButton from "~/components/ui/buttons/ThemeButton.vue";

const { locales, setLocale } = useI18n();
</script>

<template>
  <nav class="flex flex-row gap-x-4 justify-end uppercase my-2">
    <div class="flex gap-x-4 items-center place-content-center">
      <button
        v-for="locale in locales"
        :key="locale.code"
        @click="setLocale(locale.code)"
        type="button"
        class="min-w-[80px] min-h-[30px] p-2 rounded-md bg-indigo-950 text-white active:scale-90 focus:bg-slate-600 cursor-pointer"
      >
        {{ locale.name }}
      </button>
    </div>
    <div class="place-content-center mr-5">
      <ThemeButton />
    </div>
  </nav>
</template>
