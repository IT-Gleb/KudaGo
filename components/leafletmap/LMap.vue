<script setup lang="ts">
import { ref, nextTick, onMounted } from "vue";

import L, { icon, type LeafletEventHandlerFn } from "leaflet";
import "leaflet/dist/leaflet.css";
import type { ISerchPlace } from "~/types/serchTypes";
import { hasPlaceData } from "~/utils/functions";

const mapMaxZoom: number = 19;
const currentMapZoom: number = 16;
const placeMap: string = "PlaceMap";

const props = defineProps<{ place: ISerchPlace | null | undefined }>();
const hasPlace = computed(() => hasPlaceData(props.place));

const LeafletMap = ref<L.Map>();

//Инициализировать карту
const initLeafLetMap = () => {
  if (!hasPlace.value) {
    return;
  }
  LeafletMap.value = L.map(placeMap, {
    center: new L.LatLng(
      props.place?.coords?.lat as number,
      props.place?.coords?.lon as number
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
      [props.place?.coords?.lat as number, props.place?.coords?.lon as number],
      { icon: mIcon, alt: Locations[props.place?.location as string] }
    )
      .addTo(LeafletMap.value)
      .bindTooltip(
        (Locations[props.place?.location as string] +
          " - " +
          props.place?.address) as string,
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
          props.place?.coords?.lat as number,
          props.place?.coords?.lon as number,
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
  <div class="w-[98%] mx-auto">
    <div
      v-if="hasPlace"
      class="flex gap-4 items-start justify-evenly flex-wrap"
    >
      <div :id="placeMap" class="w-[90vw] h-[65vh]"></div>
      <button
        type="button"
        aria-label="Обновить карту"
        class="min-w-[60px] min-h-[30px] active:scale-90 bg-slate-800 text-slate-100 p-1 cursor-pointer"
        @click="handlerRedrawMap"
      >
        Update Map
      </button>
    </div>
  </div>
</template>
