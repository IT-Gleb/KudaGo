<script setup lang="ts">
import { useRouter } from "vue-router";
import { ref, nextTick, onMounted } from "vue";
import { useState } from "#app";
import type {
  ISearchResult,
  ISerchPlace,
  Search_Root,
} from "~/types/serchTypes";
import { ClientOnly } from "#components";
import L, { icon, type LeafletEventHandlerFn } from "leaflet";
import "leaflet/dist/leaflet.css";

const mapMaxZoom: number = 19;
const currentMapZoom: number = 16;
const placeMap: string = "PlaceMap";

const router = useRouter();

const LeafletMap = ref<L.Map>();

const handlerBack = () => {
  router.back();
};

const handlerMain = () => {
  router.push("/");
};

const isObject = (param: unknown) => {
  let res: boolean = false;
  if (typeof param === "object") {
    return true;
  }
  if (typeof param === "string") {
    try {
      JSON.parse(param);
      res = true;
    } catch (err) {
      res = false;
    }
  }

  return res;
};

const eventItem = useState<Partial<ISearchResult>>("eventItem");

if (isObject(eventItem.value.body_text as string)) {
  eventItem.value.body_text = JSON.parse(eventItem.value.body_text as string);
}

function formatTextToHTML(param: string): string {
  // console.log(param);
  const reg = new RegExp(`^[А-Я][\\s\\S]+?\\?$`, "gmu");
  let txt: string = `${param}`;
  try {
    reg
      .exec(txt)
      ?.forEach((item) => (txt = txt.replaceAll(item, `<h4>${item}</h4>`)));
    // ?.forEach((item) => (txt = txt.replaceAll(item, `<h4>${item}</h4>`)));
    // console.log(txt);
  } catch (err) {
    return txt;
  }

  return txt;
}

const TextBlocks = computed<string | { id: string; text: string }[]>(() => {
  if (!eventItem.value.body_text) {
    return "";
  }
  if (isObject(eventItem.value.body_text)) {
    let tmpTexts: { id: string; text: string }[] = [];
    (eventItem.value.body_text as unknown as Search_Root).blocks.forEach(
      (item) => {
        if (item.text.length > 0) {
          tmpTexts = [
            ...tmpTexts,
            { id: item.key, text: formatTextToHTML(item.text) },
          ];
        }
      }
    );
    return tmpTexts;
  } else {
    return eventItem.value.body_text;
  }
});

useHead({
  title: `${eventItem.value.title}:[Kuda-Go]`,
});

const hasPlaceData = (): boolean => {
  let res: boolean = false;

  if (eventItem.value.place !== null && eventItem.value.place !== undefined) {
    const { coords } = eventItem.value.place as ISerchPlace;
    if (coords) {
      const { lat, lon } = coords;
      res = lat !== null && lon !== null;
    }
  }

  return res;
};

const hasPlace = computed(() => hasPlaceData());

//Инициализировать карту
const initLeafLetMap = () => {
  if (!hasPlace.value) {
    return;
  }
  LeafletMap.value = L.map(placeMap, {
    center: new L.LatLng(
      eventItem.value.place?.coords?.lat as number,
      eventItem.value.place?.coords?.lon as number
    ),
    zoom: currentMapZoom,
    attributionControl: false,
  });

  const mIcon = L.icon({
    iconUrl: "/svg/markerIcon.svg",
    iconSize: [24, 50],
    iconAnchor: [12, 49],
    tooltipAnchor: [45, -30],
  });

  // const mIcon = L.divIcon({
  //   className: "icon-class",
  //   iconSize: [36, 92],
  //   iconAnchor: [30, 91],
  //   tooltipAnchor: [40, -45],
  // });

  const MyAttrControl = L.control.attribution().addTo(LeafletMap.value);
  MyAttrControl.setPrefix("<a href='https://leafletjs.com/'>Maps</a>");

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: mapMaxZoom,
    attribution: "© openstreetmaps",
    subdomains: ["a", "b", "c"],
  }).addTo(LeafletMap.value);
  //Транспорт
  //Нужен ключ
  // L.tileLayer(
  //   "http://a.tile2.opencyclemap.org/transport/{z}/{x}/{y}.png"
  // ).addTo(LeafletMap.value);
  // L.tileLayer(
  //   "http://{s}.tile2.opencyclemap.org/transport/{z}/{x}/{y}.png"
  // ).addTo(LeafletMap.value);

  // L.marker([52.103839, 4.252742], { icon: customDivIcon }).addTo(leafletMap.value)
  if (LeafletMap.value) {
    const marker = L.marker(
      [
        eventItem.value.place?.coords?.lat as number,
        eventItem.value.place?.coords?.lon as number,
      ],
      { icon: mIcon, alt: Locations[eventItem.value.place?.location as string] }
    )
      .addTo(LeafletMap.value)
      .bindTooltip(
        (Locations[eventItem.value.place?.location as string] +
          " - " +
          eventItem.value.place?.address) as string,
        {
          permanent: true,
          offset: new L.Point(50, -30),
          direction: "center",
          className: "my-labels",
        }
      );
    // .bindPopup("<br> " + eventItem.value.title);
    if (marker.dragging) {
      marker.dragging.enable();
    }
  }

  //L.polygon(()=>[pnt.Latitude, pnt.Longitude]), { color: 'red' }).addTo(LeafletMap.value)
};

const handlerRedrawMap = () => {
  if (LeafletMap.value) {
    LeafletMap.value.remove();
    LeafletMap.value = undefined;
    initLeafLetMap();
    if (LeafletMap.value) {
      (LeafletMap.value as L.Map).setView(
        [
          eventItem.value.place?.coords?.lat as number,
          eventItem.value.place?.coords?.lon as number,
        ],
        16
      );

      (LeafletMap.value as L.Map).invalidateSize(true);
    }
  }
};

onMounted(() => {
  nextTick(() => {
    initLeafLetMap();
  });
});
</script>

<template>
  <ClientOnly>
    <section
      class="p-2 text-[1em]/[1.2em] lg:text-[0.8rem]/[1rem] w-[98vw] lg:w-[75vw] xl:w-[70vw] mx-auto"
    >
      <div class="w-fit mx-auto my-10">
        {{ $route.params.id }}
        <div>{{ eventItem.id }}</div>

        <div class="flex items-center gap-2 justify-evenly my-10">
          <button
            type="button"
            aria-label="Вернуться"
            class="bg-slate-700 text-slate-100 active:scale-90 p-1 min-w-[60px] min-h-[30px] cursor-pointer rounded-md"
            @click="handlerBack"
          >
            Вернуться
          </button>

          <button
            type="button"
            aria-label="На Главную"
            class="bg-slate-700 text-slate-100 active:scale-90 p-1 min-w-[60px] min-h-[30px] cursor-pointer rounded-md"
            @click="handlerMain"
          >
            На Главную
          </button>
        </div>

        <div>
          <h4 class="text-[1.6em]/[1.65em]">{{ eventItem.title }}</h4>
        </div>

        <div
          v-if="eventItem.first_image?.thumbnails !== null"
          class="max-w-fit mx-auto object-cover object-center my-10 p-1"
        >
          <img
            :src="eventItem.first_image?.thumbnails['640x384']"
            alt=""
            loading="lazy"
            decoding="async"
            class="block max-w-full max-h-full"
          />
        </div>

        <div
          v-if="typeof TextBlocks === 'object'"
          class="mt-5 w-fit mx-auto flex flex-col flex-wrap gap-2 items-start justify-evenly"
        >
          <div
            v-for="item in TextBlocks"
            :key="item.id"
            class="indent-3 p-1 text-pretty [&>div>h4]:text-[1.2em]/[1.25em]"
          >
            <div v-html="item.text"></div>
          </div>
        </div>
        <div v-else class="indent-3 p-1 text-pretty">
          <p>{{ TextBlocks }}</p>
        </div>

        <div class="my-10">
          {{ eventItem.place }}
        </div>
      </div>

      <div
        v-if="!hasPlace"
        class="w-[80vw] lg:w-[60vw] mx-auto my-10 text-center"
      >
        <h4>Нет данных по гео-локации</h4>
      </div>
      <div
        v-if="hasPlace"
        class="flex gap-4 items-start justify-evenly flex-wrap"
      >
        <div
          v-if="eventItem.place"
          :id="placeMap"
          class="w-[95%] h-[55vh] mx-auto"
        ></div>

        <button
          type="button"
          aria-label="Обновить карту"
          class="min-w-[60px] min-h-[30px] active:scale-90 bg-slate-800 text-slate-100 p-1 cursor-pointer"
          @click="handlerRedrawMap"
        >
          Update Map
        </button>
      </div>

      <div class="flex items-center gap-2 justify-evenly my-10">
        <button
          type="button"
          aria-label="Вернуться"
          class="bg-slate-700 text-slate-100 active:scale-90 p-1 min-w-[60px] min-h-[30px] cursor-pointer rounded-md"
          @click="handlerBack"
        >
          Вернуться
        </button>
        <button
          type="button"
          aria-label="На Главную"
          class="bg-slate-700 text-slate-100 active:scale-90 p-1 min-w-[60px] min-h-[30px] cursor-pointer rounded-md"
          @click="handlerMain"
        >
          На Главную
        </button>
      </div>
    </section>
  </ClientOnly>
</template>

<style scoped>
.icon-class {
  color: green;
}
.my-labels {
  background-color: black !important;
  color: white !important;
}
.leaflet-control-attribution {
  display: none !important;
}
</style>
