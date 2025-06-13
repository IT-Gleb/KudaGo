<script setup lang="ts">
import {
  Chart as ChartJS,
  Legend,
  Title,
  SubTitle,
  Tooltip,
  ArcElement,
  PieController,
  type ChartConfiguration,
} from "chart.js";
import { ref, reactive, watch } from "vue";
import { PieStore } from "~/store/pieStore";
import { storeToRefs } from "pinia";
import { nanoid } from "nanoid";
import { getNowYear } from "#imports";

ChartJS.register(PieController, Legend, Title, SubTitle, Tooltip, ArcElement);

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
const { setItem, setActiveIndex } = store;

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
  options: {
    responsive: true,
    maintainAspectRatio: false,
    layout: { autoPadding: true },

    plugins: {
      title: {
        display: true,
        text: "Какой-то график".toUpperCase(),
        align: "center",
        padding: { top: 5, bottom: 10 },
        color: "#1976d2",
        font: { size: 24, family: "Tahoma" },
        position: "top",
        fullSize: true,
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
        position: "top",
        fullSize: true,
        labels: {
          color: "#3e2723",
          font: { weight: 600, family: "Tahoma,Verdana" },
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
  },
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
    isUpdate.value = !isUpdate.value;

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
    setItem(PieItem);
  },
  { deep: true }
);

watch(
  () => Items.value,
  () => {
    isUpdate.value = !isUpdate.value;

    // ChartConfig.data.datasets[0].data = Items.value.map((item) => item.value);
    // ChartConfig.data.labels = Items.value.map((item) => item.label);
    // ChartConfig.data.datasets[0].backgroundColor = Items.value.map(
    //   (item) => item.bgColor
    // );

    (PieChart.value as ChartJS).data.datasets[0].data = Items.value.map(
      (item) => item.value
    );
    (PieChart.value as ChartJS).data.labels = Items.value.map(
      (item) => item.label
    );
    (PieChart.value as ChartJS).data.datasets[0].backgroundColor =
      Items.value.map((item) => item.bgColor);

    try {
      (PieChart.value as ChartJS).update();
    } catch (err) {
      console.log(err);
      const w = isUpdate.value
        ? (PieChart.value as ChartJS).width - 0.1
        : (PieChart.value as ChartJS).width + 0.1;
      const h = !isUpdate.value
        ? (PieChart.value as ChartJS).height - 0.1
        : (PieChart.value as ChartJS).height + 0.1;
      (PieChart.value as ChartJS).resize(w, h);
    } finally {
    }
  },
  { deep: true }
);
</script>

<template>
  <div
    class="w-[320px] md:w-[480px] md:h-[320px] lg:w-[900px] lg:h-[600px] mx-auto bg-white dark:bg-amber-500 object-cover object-left-top"
  >
    <canvas
      ref="ChartRef"
      id="pieGraph"
      width="100%"
      height="100%"
      class="cursor-pointer"
      @click="handleClick"
    ></canvas>
  </div>
</template>
