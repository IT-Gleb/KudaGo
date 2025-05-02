<script setup lang="ts">
import { ref } from "vue";
import {
  FormatDateToString,
  TextToArray,
  ArrayGrowArray,
} from "~/utils/functions";

const detailsRef = ref<HTMLDetailsElement | null>(null);

const opened = ref<boolean>(false);
// const link_text = ref<{ link: string; idStr: string }>({ link: "", idStr: "" });

const props = defineProps<{
  id: number;
  header: string;
  description?: string;
  text?: string;
  date_publication?: number;
  isodd?: boolean;
}>();

const textParagrafs = ref<string[]>(TextToArray(props.text as string));

const handleClick = () => {
  opened.value ? (opened.value = false) : (opened.value = true);
};

const handleClose = () => {
  opened.value = false;
};

// link_text.value.idStr = `new-${props.id}`;
// link_text.value.link = `#${link_text.value.idStr}`;

//console.log(props.date_publication?.toString(), "  ", Date.now().toString());
textParagrafs.value = ArrayGrowArray(textParagrafs.value);

const handleUp = () => {
  (detailsRef.value as HTMLElement).scrollIntoView({
    behavior: "smooth",
    block: "start",
    inline: "center",
  });
};
</script>

<template>
  <details ref="detailsRef" :open="opened">
    <summary
      class="flex flex-row items-start justify-between p-2"
      :class="
        props.isodd
          ? 'bg-slate-50 dark:bg-slate-600'
          : 'bg-indigo-50 dark:bg-slate-800'
      "
      @click.prevent="() => null"
    >
      <h6 class="hidden md:inline-block">{{ props.header }}</h6>
      <h5 class="md:hidden">{{ props.header }}</h5>
      <button
        type="button"
        class="text-indigo-950 dark:text-slate-300 text-center cursor-pointer active:scale-90 hover:underline font-bold"
        @click="handleClick"
      >
        <small>
          {{ opened ? "Свернуть" : "Развернуть" }}
        </small>
      </button>
    </summary>

    <article
      class="pt-4 px-2 flex flex-col items-start bg-white dark:bg-slate-700"
    >
      <div>
        <div class="mx-2 md:float-right">
          <slot />
        </div>
        <p class="indent-5 text-indigo-800 dark:text-yellow-400 font-bold">
          {{ props.description }}
        </p>
        <p
          class="indent-5 mt-1 first-letter:uppercase"
          v-for="item in textParagrafs"
        >
          {{ item }}
        </p>
      </div>
      <div
        class="w-full flex flex-row gap-x-3 items-end mt-4 justify-end border-t p-2"
      >
        <span
          ><small>{{
            FormatDateToString(props.date_publication?.toString() as string)
          }}</small></span
        >

        <button
          type="button"
          @click="handleUp"
          class="font-bold hover:underline active:scale-90 cursor-pointer"
        >
          <small>К началу</small>
        </button>

        <button
          type="button"
          @click="handleClose"
          class="hover:underline cursor-pointer active:scale-90 font-bold"
        >
          <small> Свернуть </small>
        </button>
      </div>
    </article>
  </details>
</template>
