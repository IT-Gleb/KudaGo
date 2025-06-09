<script setup lang="ts">
const maxWidth: number = 200;

export type TProgressView = "normal" | "dashboard";
export type TProgressState = "in-progress" | "success" | "warning" | "error";
export type TColorBar = Record<TProgressState, { color: string }>;

const progressOptions: TColorBar = {
  "in-progress": { color: "60a5fa" },
  success: { color: "#87c500" },
  warning: { color: "#f97316" },
  error: { color: "#ec2424" },
};

const props = withDefaults(
  defineProps<{
    width: number;
    value: number;
    max?: number;
    view: TProgressView;
    state?: TProgressState;
  }>(),
  {
    width: 200,
    max: 100,
    value: 0,
    view: "normal",
    state: "in-progress",
  }
);

const calculateRadius = (paramRadius: number): number => {
  return Math.round(2 * (Math.PI * paramRadius));
};

const circleStrokeWidth = ref<number>(props.width <= maxWidth ? 8 : 12);
const circleRadius = ref<number>(
  Math.round(props.width / 2 - circleStrokeWidth.value)
);

const value = ref<number>(props.value);
const max = ref<number>(props.max);
const textX = ref<string>("50%");
const fontSize = ref<number>(20);
const total = ref<number>(calculateRadius(circleRadius.value));
const animateStrokeArray = ref<string>("");
const innerState = ref<TProgressState>(props.state);

const calculateTextX = (paramWidth: number): string => {
  return `${paramWidth / 2 - value.value.toString().length / 2}`;
};

watch(
  () => props.state,
  (newValue) => {
    innerState.value = newValue;
  }
);

watch(
  () => props.width,
  (newValue) => {
    circleRadius.value = Math.round(newValue / 2 - circleStrokeWidth.value);
    newValue < maxWidth ? (fontSize.value = 14) : (fontSize.value = 20);
    circleStrokeWidth.value = newValue < maxWidth ? 8 : 12;
    total.value = calculateRadius(circleRadius.value);
    textX.value = calculateTextX(newValue);
    let tmp: number = (value.value * total.value) / 100;
    animateStrokeArray.value = `${tmp} ${total.value}`;
  }
);

watch(
  () => props.value,
  (newValue) => {
    value.value = Math.min(newValue, max.value);
    textX.value = calculateTextX(props.width);
    let tmp: number = (value.value * total.value) / 100;
    if (innerState.value === "in-progress") {
      animateStrokeArray.value = `${tmp} ${total.value}`;
    }
    value.value >= max.value
      ? (innerState.value = "success")
      : (innerState.value = "in-progress");
  }
);
</script>

<template>
  <svg
    v-if="props.view === 'normal'"
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    view-box="0 0 200 200"
    fill="none"
    :width="props.width"
    :height="props.width"
    class="cursor-pointer border border-indigo-900"
  >
    <defs>
      <linearGradient
        id="greenRedGradient"
        gradientUnits="userSpaceOnUse"
        spreadMethod="pad"
        x1="0%"
        y1="0%"
        x2="0%"
        y2="100%"
      >
        <stop offset="0%" stop-color="#87c500"></stop>
        <stop offset="100%" stop-color="#ec2424"></stop>
      </linearGradient>
      <clipPath id="cutLeft">
        <rect x="0%" y="50%" width="100%" height="100%"></rect>
      </clipPath>
      <clipPath id="cutRight">
        <rect x="0%" y="0%" width="100%" height="50%"></rect>
      </clipPath>
    </defs>
    <circle
      cx="50%"
      cy="50%"
      :r="circleRadius"
      fill="none"
      stroke="#ccc"
      :stroke-width="circleStrokeWidth"
      stroke-linecap="square"
    ></circle>
    <circle
      cx="50%"
      cy="50%"
      :r="circleRadius"
      fill="none"
      :stroke="
        innerState === 'in-progress'
          ? 'url(#greenRedGradient)'
          : innerState === 'warning'
          ? progressOptions[innerState].color
          : innerState === 'success'
          ? progressOptions[innerState].color
          : innerState === 'error'
          ? progressOptions[innerState].color
          : 'url(#greenRedGradient)'
      "
      :stroke-width="circleStrokeWidth"
      stroke-linecap="square"
      :stroke-dasharray="animateStrokeArray"
    ></circle>

    <circle
      cx="50%"
      cy="50%"
      :r="circleRadius"
      fill="none"
      :stroke="
        innerState === 'in-progress'
          ? 'url(#greenRedGradient)'
          : innerState === 'warning'
          ? progressOptions[innerState].color
          : innerState === 'success'
          ? progressOptions[innerState].color
          : innerState === 'error'
          ? progressOptions[innerState].color
          : 'url(#greenRedGradient)'
      "
      :stroke-width="circleStrokeWidth"
      stroke-linecap="square"
      :stroke-dasharray="animateStrokeArray"
      clip-path="url(#cutLeft)"
    ></circle>
    <text
      v-if="innerState === 'in-progress'"
      y="52%"
      :x="textX"
      font-family="Tahoma,Verdana"
      font-weight="500"
      text-anchor="middle"
      :font-size="fontSize"
      fill="blue"
    >
      {{ value }}%
    </text>
  </svg>
</template>

<style lang="css" scoped>
svg circle {
  will-change: auto;
  transform-origin: center center;
  transform: rotate(-90deg);
  transition: stroke-dasharray 240ms linear;
}
svg text {
  user-select: none;
}
</style>
