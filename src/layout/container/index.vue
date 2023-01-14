<template>
  <div class="main-container">
    <router-view v-slot="{ Component }">
      <keep-alive :include="keepName">
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>
<script lang="ts">
import { ref, defineComponent } from "vue";
export default defineComponent({
  name: "LayoutContainer",
  setup() {
    const keepName = ref(["MatchList"]);
    return { keepName };
  },
});
</script>
<style lang="scss" scoped>
.main-container {
  background: var(--color-bg-primary);
  height: calc(100% - 92px);
  overflow: hidden;
  ::-webkit-scrollbar {
    display: none;
  }
  & > div {
    background: var(--color-bg-second);
    border-top-left-radius: 16px;
    border-bottom-left-radius: 16px;
    overflow: auto;
    height: 100%;
    width: 100%;
  }
}
</style>
