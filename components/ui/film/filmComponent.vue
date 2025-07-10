<script setup lang="ts">
import { nanoid } from "nanoid";

type TFilmObject = {
  id: string;
  name: string;
  link: string;
};

//https://vk.com/video-37492055_456246081

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
// filmUrl.value =
//   "https://vk.com/video_ext.php?oid=-37492055&id=456246081&hash=9fa60d6bf8d118d3";
// filmUrl.value =
//   "https://i.okcdn.ru/videoPreview?id=2791875873332&type=32&idx=8&tkn=tlvgB64VbNDUaamW5IRAEWwKD3M&fn=external_8";
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
      allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
      allowFullScreen
      class="block w-full h-full"
    ></iframe>
  </div>
</template>

<!-- width="720"
      height="405" -->
<!-- allow="clipboard-write; autoplay" -->

<!-- <iframe src="https://vk.com/video_ext.php?oid=-37492055&id=456246081&hash=9fa60d6bf8d118d3" width="640" height="360" frameborder="0" allowfullscreen="1" allow="autoplay; encrypted-media; fullscreen; picture-in-picture"></iframe> -->
