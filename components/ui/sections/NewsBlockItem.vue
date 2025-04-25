<script setup lang="ts">
import { ref } from "vue";
import {
  FormatDateToString,
  TextToArray,
  ArrayGrowArray,
} from "~/utils/functions";

const detailsRef = ref(null);

const opened = ref(false);
const link_text = ref("new");
const link = ref("#");

const props = defineProps<{
  id: number;
  header: string;
  description?: string;
  text?: string;
  date_publication?: number;
  isodd?: boolean;
}>();

const textParagrafs = ref(TextToArray(props.text as string));

const handleClick = () => {
  opened.value ? (opened.value = false) : (opened.value = true);
};

const handleClose = () => {
  opened.value = false;
};

link_text.value = `${link_text.value}-${props.id}`;
link.value = link.value + link_text.value;

//console.log(props.date_publication?.toString(), "  ", Date.now().toString());
textParagrafs.value = ArrayGrowArray(textParagrafs.value);
</script>

<template>
  <details ref="detailsRef" :open="opened">
    <summary
      :id="link_text"
      class="flex flex-row items-start justify-between p-2"
      :class="
        props.isodd
          ? 'bg-slate-100 dark:bg-slate-600'
          : 'bg-indigo-100 dark:bg-slate-800'
      "
      @click.prevent="() => null"
    >
      <h6 class="hidden md:inline-block">{{ props.header }}</h6>
      <h5 class="md:hidden">{{ props.header }}</h5>
      <small>
        <button
          type="button"
          class="text-indigo-950 dark:text-slate-300 text-center cursor-pointer active:scale-90 hover:underline font-bold"
          @click="handleClick"
        >
          {{ opened ? "Свернуть" : "Развернуть" }}
        </button>
      </small>
    </summary>
    <slot />
    <article
      class="pt-4 px-2"
      :class="
        props.isodd
          ? 'bg-slate-50 dark:bg-slate-700'
          : 'bg-indigo-50 dark:bg-slate-600'
      "
    >
      <p class="indent-5 text-indigo-800 dark:text-yellow-400 font-bold">
        {{ props.description }}
      </p>
      <p class="indent-5 mt-1" v-for="item in textParagrafs">{{ item }}</p>
      <div
        class="flex flex-row gap-x-3 items-end mt-4 justify-end border-t p-2"
      >
        <small>
          <span>{{
            FormatDateToString(props.date_publication?.toString() as string)
          }}</span>
        </small>
        <small>
          <NuxtLink :to="link" class="font-bold">К началу</NuxtLink>
        </small>
        <small>
          <button
            type="button"
            @click="handleClose"
            class="hover:underline cursor-pointer active:scale-90 font-bold"
          >
            Свернуть
          </button>
        </small>
      </div>
    </article>
  </details>
</template>
