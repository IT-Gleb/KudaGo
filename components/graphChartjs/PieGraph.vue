<script setup lang="ts">
import {
  Chart as ChartJS,
  // Decimation,
  // Legend,
  // Title,
  // SubTitle,
  Tooltip,
  ArcElement,
  PieController,
  type ChartConfiguration,
  type ChartOptions,
} from "chart.js";
import { ref, reactive, watch } from "vue";
import { PieStore } from "~/store/pieStore";
import { storeToRefs } from "pinia";
import { nanoid } from "nanoid";
import { getNowYear } from "#imports";

ChartJS.register(
  PieController,
  // Legend,
  // Decimation,
  // Title,
  // SubTitle,
  Tooltip,
  ArcElement
);

const ChartRef = ref();
const PieChart = ref<ChartJS>();
const isUpdate = ref<boolean>(false);
const Index = ref<number>(0);

export type TPieChartItem = {
  id: string;
  label: string;
  value: number;
  bgColor: string;
};

export type TPieChartData = TPieChartItem[];

const PieItem = reactive<TPieChartItem>({
  id: "",
  label: "",
  value: 0,
  bgColor: "",
});

const store = PieStore();
const { Items } = storeToRefs(store);
const { setActiveIndex } = store;

const chartConfigOptions: ChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  layout: { autoPadding: true },
  animation: { duration: 500, delay: 100, loop: false, easing: "easeOutQuart" },

  plugins: {
    title: {
      display: true,
      text: "Какой-то график".toUpperCase(),
      align: "center",
      padding: { top: 5, bottom: 2 },
      color: "#1976d2",
      font: { size: 24, family: "Tahoma" },
      position: "top",
      fullSize: false,
    },
    subtitle: {
      display: true,
      text: `данные за ${getNowYear()} г.`,
      align: "center",
      font: { family: "Tahoma", size: 18 },
      color: "#1976d2",
      fullSize: true,
      padding: {
        bottom: 10,
      },
    },
    legend: {
      display: true,
      position: "bottom",
      fullSize: true,
      labels: {
        color: "#3e2723",
        font: { weight: 600, family: "Tahoma,Verdana" },
        useBorderRadius: true,
        borderRadius: 10,
      },
    },
    tooltip: {
      enabled: true,
      backgroundColor: "#fff176a9",
      titleColor: "#1a237e",
      displayColors: true,
      borderColor: "black",
      borderWidth: 1,
      bodyColor: "#004d40",
    },
  },
};

const ChartConfig: ChartConfiguration = {
  type: "pie",
  data: {
    labels: Items.value.map((item) => item.label),
    datasets: [
      {
        label: "Значение: ",
        data: Items.value.map((item) => item.value),
        backgroundColor: Items.value.map((item) => item.bgColor),
      },
    ],
  },

  options: chartConfigOptions,
};

onMounted(() => {
  PieChart.value = new ChartJS(ChartRef.value, ChartConfig);
  //(PieChart.value as ChartJS).draw();
});

onUnmounted(() => {
  (PieChart.value as ChartJS).destroy();
});

const handleClick = (event: MouseEvent) => {
  const activeElements = (PieChart.value as ChartJS).getElementsAtEventForMode(
    event,
    "nearest",
    { intersect: true },
    true
  );
  if (activeElements.length > 0) {
    // isUpdate.value = !isUpdate.value;

    const datasetIndex = activeElements[0].datasetIndex;

    Index.value = activeElements[0].index;

    let pData = (PieChart.value as ChartJS).data.datasets[datasetIndex].data[
      Index.value
    ] as number;
    //@ts-ignore
    const textPie = (PieChart.value as ChartJS).data.labels[Index.value];

    PieItem.label = textPie as string;
    PieItem.value = pData;
    //@ts-ignore
    PieItem.bgColor = ChartConfig.data.datasets[datasetIndex].backgroundColor[
      Index.value
    ] as string;

    setActiveIndex(Index.value);
  }
};

watch(
  () => PieItem,
  () => {
    PieItem.id === "" ? (PieItem.id = nanoid()) : null;
    // setItem(PieItem);
  },
  { deep: true }
);

function updateChartData(paramChart: ChartJS) {
  paramChart.data.labels = Items.value.map((item) => item.label);
  paramChart.data.datasets[0].data = Items.value.map((item) => item.value);
  paramChart.data.datasets[0].backgroundColor = Items.value.map(
    (item) => item.bgColor
  );

  paramChart.update();
}

function resizeChart(err?: Error) {
  if (err) {
    console.clear();
    console.log(err);
  }
  const w = isUpdate.value
    ? (PieChart.value as ChartJS).width - 0.1
    : (PieChart.value as ChartJS).width + 0.1;
  const h = !isUpdate.value
    ? (PieChart.value as ChartJS).height - 0.1
    : (PieChart.value as ChartJS).height + 0.1;
  (PieChart.value as ChartJS).resize(w, h);
}

watch(
  () => Items,
  () => {
    //console.log("update chart");
    if (Items.value.length < 1) {
      (PieChart.value as ChartJS).clear();
    }

    try {
      updateChartData(PieChart.value as ChartJS);
    } catch (err) {
      resizeChart(err as Error);
    } finally {
      resizeChart();
    }
  },
  { deep: true }
);

const ClearChart = () => {
  try {
    (PieChart.value as ChartJS).clear();
  } catch (err) {
    console.log(err);
  }
  Items.value = [];
};

defineExpose({ ClearChart });
</script>

<template>
  <div class="w-fit mx-auto">
    <div
      class="min-w-[320px] md:w-[480px] md:h-[320px] lg:w-[768px] lg:h-[512px] xl:w-[1000px] xl:h-[667px] mx-auto bg-white dark:bg-amber-500 object-cover object-left-top"
    >
      <canvas
        ref="ChartRef"
        id="pieGraph"
        width="100%"
        height="100%"
        class="block w-full h-full cursor-pointer"
        @click="handleClick"
      ></canvas>
    </div>
    <div class="w-fit mx-auto mt-10 flex items-center gap-x-[30px]">
      <div v-for="item in Items" class="flex items-center gap-x-3">
        <div
          class="w-[14px] h-[14px] rounded-full"
          :style="{ backgroundColor: `${item.bgColor}` }"
        ></div>
        <div class="textFont text-[15px]/[24px]">{{ item.label }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.textFont {
  font-family: "Inter";
  font-weight: 400;
}
</style>
