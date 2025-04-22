// import { ref, watchEffect } from "vue";

// export const useMediaQuery = (query: string) => {
//   const matches = ref(true);
//   if (typeof window === undefined) {
//     return false;
//   }

//   watchEffect((onInvalidate) => {
//     if (typeof window === undefined) {
//       return;
//     }

//     const media = window.matchMedia(query);

//     if (media.matches !== matches.value) {
//       matches.value = media.matches;
//     }

//     const onChange = () => {
//       matches.value = media.matches;
//     };

//     media.addEventListener("resize", onChange);

//     onInvalidate(() => {
//       media.removeEventListener("resize", onChange);
//     });
//   });

//   return matches;
// };
