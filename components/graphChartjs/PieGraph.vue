<script setup lang="ts">
import {
  Chart as ChartJS,
  Legend,
  Title,
  Tooltip,
  ArcElement,
  PieController,
} from "chart.js";
import { ref } from "vue";

ChartJS.register(Legend, Title, Tooltip, ArcElement, PieController);

const ChartRef = ref();
const PieChart = ref<ChartJS>();

onMounted(() => {
  PieChart.value = new ChartJS(ChartRef.value, {
    type: "pie",
    data: {
      labels: ["HTML", "CSS", "TypeScript", "Javascript", "TileWindCSS"],
      datasets: [
        {
          label: "Значение: ",
          data: [20, 30, 40, 50, 30],
          backgroundColor: ["blue", "green", "grey", "navy", "yellow"],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: { autoPadding: true },
      backgroundColor: "gray",
      plugins: {
        title: {
          display: true,
          position: "top",
          text: "My Skills",
          padding: { top: 5, bottom: 10 },
        },
        legend: {
          display: true,
          position: "top",
        },
      },
    },
  });
  //(PieChart.value as ChartJS).draw();
});

onUnmounted(() => {
  (PieChart.value as ChartJS).destroy();
});
</script>

<template>
  <div
    class="w-[320px] md:w-[480px] md:h-[320px] lg:w-[900px] lg:h-[600px] mx-auto my-10 border bg-white object-cover object-left-top"
  >
    <canvas
      ref="ChartRef"
      id="pieGraph"
      width="100%"
      height="100%"
      class="cursor-pointer"
    ></canvas>
  </div>
</template>
