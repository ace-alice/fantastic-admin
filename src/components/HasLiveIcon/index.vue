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
  name: "has-live-icon",
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
    border-radius: 50px;
    background-color: #ffce00;
    vertical-align: middle;
    display: inline-block;
  }
  span:nth-child(1) {
    left: 0;
    height: 70%;
  }
  span:nth-child(2) {
    left: 6px;
    height: 100%;
  }
  span:nth-child(3) {
    left: 13px;
    height: 65%;
  }
}
</style>
