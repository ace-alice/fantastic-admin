import { defineStore } from "pinia";
import { ref, Ref } from "vue";

export const globalApiConfigStore = defineStore("globalApiConfig", () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let timer: any = null;
  const currentTime: Ref<number> = ref(0);
  function openTimer() {
    timer = setInterval(() => {
      currentTime.value = new Date().getTime();
    }, 1000);
  }
  function closeTimer() {
    clearInterval(timer);
    timer = null;
    currentTime.value = 0;
  }

  return {
    currentTime,
    openTimer,
    closeTimer,
  };
});
