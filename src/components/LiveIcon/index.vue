<template>
  <div class="live-icon">
    <span></span>
    <span></span>
    <span></span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "live-icon",
  components: {},
  setup() {
    return {};
  },
});
</script>

<style lang="scss" scoped>
@keyframes movement {
  0% {
    height: 30%;
  }
  100% {
    height: 100%;
  }
}
.live-icon {
  position: relative;
  width: 16px;
  height: 16px;
  margin: 0 8px;
  span {
    position: absolute;
    bottom: 0;
    width: 3px;
    height: 100%;
    border-radius: 50px;
    background-color: #fe5e00;
    vertical-align: middle;
    display: inline-block;
  }
  span:nth-child(1) {
    left: 0;
    animation: 500ms linear 0s infinite alternate none running movement;
  }
  span:nth-child(2) {
    left: 6px;
    animation: 500ms linear 0.3s infinite alternate none running movement;
  }
  span:nth-child(3) {
    left: 13px;
    animation: 500ms linear 0.6s infinite alternate none running movement;
  }
}
</style>
