<script setup lang="ts">
import { nanoid } from "nanoid";

type TFilmObject = {
  id: string;
  name: string;
  link: string;
};

const shablon: string = "https://rutube.ru/play/embed/%s";
const ids: TFilmObject[] = [
  {
    id: nanoid(),
    name: "Отпетые мошенники",
    link: "80d9d631ec25cfd5f2c854025e1947a8",
  },
];

const filmUrl = ref<string>("");

const reg = new RegExp("%s", "gmi");

filmUrl.value = shablon.replace(reg, ids[0].link);
</script>

<template>
  <div
    class="my-10 w-[320px] h-[212px] sm:w-[420px] sm:h-[280px] lg:w-[720px] lg:h-[405px] aspect-video mx-auto object-cover object-center"
  >
    <iframe
      width="720"
      height="405"
      :src="filmUrl"
      frameBorder="0"
      allow="clipboard-write; autoplay"
      allowFullScreen
      class="block w-full h-full"
    ></iframe>
  </div>
</template>

<!-- width="720"
      height="405" -->
