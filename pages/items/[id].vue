<script setup lang="ts">
import { useRouter } from "vue-router";
import { ref, nextTick, onMounted } from "vue";
import { useState } from "#app";
import type { ISearchResult } from "~/types/serchTypes";
import { ClientOnly } from "#components";
import L, { type LeafletEventHandlerFn } from "leaflet";
import "leaflet/dist/leaflet.css";

const router = useRouter();

const LeafletMap = ref<L.Map>();

const handlerBack = () => {
  router.back();
};

const handlerMain = () => {
  router.push("/");
};

const eventItem = useState<Partial<ISearchResult>>("eventItem");

useHead({
  title: `${eventItem.value.title}:[Kuda-Go]`,
});

const initLeafLetMap = () => {
  if (!eventItem.value.place) {
    return;
  }
  LeafletMap.value = L.map("map", {
    center: new L.LatLng(
      eventItem.value.place?.coords?.lat as number,
      eventItem.value.place?.coords?.lon as number
    ),
    zoom: 16,
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 25,
    attribution: "© OpenStreetMap contributors",
  }).addTo(LeafletMap.value);

  // L.marker([52.103839, 4.252742], { icon: customDivIcon }).addTo(leafletMap.value)
  if (LeafletMap.value) {
    const marker = L.marker([
      eventItem.value.place?.coords?.lat as number,
      eventItem.value.place?.coords?.lon as number,
    ])
      .addTo(LeafletMap.value)
      .bindTooltip(
        (Locations[eventItem.value.place.location] +
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

onMounted(() => {
  nextTick(() => {
    initLeafLetMap();
  });
});
</script>

<template>
  <ClientOnly>
    <section class="p-2 text-[1em]/[1.2em] lg:text-[0.8rem]/[1rem]">
      <div class="w-fit mx-auto my-10">
        {{ $route.params.id }}
        <div>{{ eventItem.id }}</div>
        <div>
          {{ eventItem.title }}
        </div>

        <div>
          {{ eventItem.place }}
        </div>
      </div>

      <div
        v-if="!eventItem.place"
        class="w-[80vw] lg:w-[60vw] mx-auto my-10 text-center"
      >
        <h4>Нет данных по гео-локации</h4>
      </div>
      <div
        v-if="eventItem.place"
        id="map"
        class="w-[95vw] h-[45vh] lg:w-[75vw] lg:h-[55vh] mx-auto"
      ></div>

      <div class="flex items-center gap-2 justify-evenly my-10">
        <button
          type="button"
          aria-label="На Главную"
          class="bg-slate-700 text-slate-100 active:scale-90 p-1 min-w-[60px] min-h-[30px] cursor-pointer rounded-md"
          @click="handlerMain"
        >
          На Главную
        </button>

        <button
          type="button"
          aria-label="Вернуться"
          class="bg-slate-700 text-slate-100 active:scale-90 p-1 min-w-[60px] min-h-[30px] cursor-pointer rounded-md"
          @click="handlerBack"
        >
          Вернуться
        </button>
      </div>
    </section>
  </ClientOnly>
</template>

<style scoped>
.my-labels {
  background-color: black;
  color: white;
}
</style>
