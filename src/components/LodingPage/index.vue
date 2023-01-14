<template>
  <div class="index_load_page" v-show="sourceLoad"></div>
</template>

<script lang="ts">
import { defineComponent, nextTick, ref } from "vue";

export default defineComponent({
  name: "globalLoading",
  props: {
    period: {
      type: Number,
      default: 5,
    },
  },

  setup(props) {
    const percent = ref(0);
    const sourceLoad = ref(true);
    let timer: any = null;

    function loading() {
      sourceLoad.value = true;
      nextTick(() => {
        let speed = 12;
        timer = setInterval(() => {
          percent.value += speed;

          speed < 1 ? (speed = 1) : (speed = Math.floor(speed / 1.1));
          if (percent.value > 99) {
            percent.value = 99;
          }
        }, 20);

        setTimeout(() => {
          if (timer) {
            percent.value = 100;
            sourceLoad.value = false;
            clearInterval(timer);
            timer = null;
          }
        }, props.period * 1000);
      });
    }

    function done() {
      if (timer) {
        percent.value = 100;
        sourceLoad.value = false;
        clearInterval(timer);
        timer = null;
      }
    }

    function end() {
      sourceLoad.value = false;
    }

    return { percent, sourceLoad, loading, done, end };
  },
});
</script>

<style lang="scss" scoped>
.index_load_page {
  position: absolute;
  z-index: 10000;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-image: url("~@/assets/images/loading-bg.png");
  background-size: 100% 100%;
}
</style>
