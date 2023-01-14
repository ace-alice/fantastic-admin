<template>
  <div :class="{ 'point-chart': true, 'show-chart': showChart }">
    point-chart
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from "vue";

export default defineComponent({
  name: "point-chart",
  components: {},
  setup() {
    const showChart = inject("showChart");
    return { showChart };
  },
});
</script>

<style lang="scss" scoped>
.point-chart {
  height: 0;
  width: calc(100% - 48px);
  background: rgba(0, 0, 0, 0.14);
  border-radius: 8px;
  margin: auto;
  overflow: hidden;
  transition: all 0.25s ease-in-out;
}
.show-chart {
  height: 318px;
  padding: 16px;
}
</style>
