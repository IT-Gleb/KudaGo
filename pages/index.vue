<script setup>
import Museum from "~/components/svg/Museum.vue";
import RaveConcert from "~/components/svg/RaveConcert.vue";
</script>

<template>
  <section
    class="h-[93dvh] flex flex-col gap-0 bg-[linear-gradient(to_bottom,theme(colors.slate.200),theme(colors.indigo.950)_40%)] dark:bg-[linear-gradient(to_bottom,theme(colors.indigo.950),theme(colors.slate.900)_40%)]"
  >
    <div
      class="bg-slate-200 dark:bg-slate-950 w-full h-[48%] place-content-center flex flex-col lg:flex-row items-center justify-evenly"
    >
      <div
        class="w-full md:w-[55%] uppercase text-[length:clamp(12vw,22vw,20vw)] md:text-[length:clamp(5vw,12vw,12vw)] font-bold text-slate-800 dark:text-slate-300 pl-20"
      >
        куда
      </div>
      <div
        class="w-[300px] md:w-[460px] lg:w-[680px] object-fill text-indigo-950 dark:text-slate-600 -scale-x-90"
      >
        <Museum />
      </div>
    </div>
    <div
      class="w-full h-[19%] md:h-[42%] bg-slate-200 dark:bg-slate-950 [mask-image:url('/svg/wave.svg')] [mask-position:left_top] [mask-repeat:no-repeat] [mask-size:100%]"
    ></div>
    <div
      class="bg-indigo-950 bg-[url('/svg/tusa.svg')] bg-repeat-x bg-contain bg-bottom-left dark:bg-slate-900 w-full h-[75%] lg:h-[33%] overflow-hidden place-content-start xl:place-content-center flex flex-col-reverse gap-5 lg:gap-0 md:flex-row items-center justify-center"
    >
      <div
        class="w-[320px] xl:ml-20 xl:w-[450px] text-slate-400 dark:text-slate-600 mask-b-from-20% mask-b-to-90%"
      >
        <RaveConcert />
      </div>
      <div
        class="md:w-[70%] md:ml-[12%] md:text-left uppercase text-[length:clamp(12vw,22vw,14vw)] md:text-[length:clamp(5vw,11vw,11vw)] font-bold text-slate-200"
      >
        сходить
      </div>
    </div>
  </section>
</template>
