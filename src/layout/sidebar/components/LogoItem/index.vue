<template>
  <div :class="{ LogoItem: true, 'not-show': !isTradition }">
    <LazyImage :img-url="logoImg" @click="routerJump('Match')" />
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from "vue";
import useRouteHook from "@/hooks/useRouteHook";

export default defineComponent({
  name: "LogoItem",
  components: {},
  setup() {
    const { routerJump } = useRouteHook();
    const isTradition = inject("isTradition", true);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const logoImg = new URL("@/assets/images/logo.png" ,import.meta.url).href;

    return { routerJump, logoImg, isTradition };
  },
});
</script>

<style lang="scss" scoped>
.LogoItem {
  width: 100%;
  height: 74px;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  transition: all 0.4s ease-in-out;
  .lazy-image {
    width: 124px;
    height: 28px;
    cursor: url("~@/assets/icons/home_mouse.png"), auto;
    margin-left: 24px;
  }
}
.not-show {
  width: 0;
  height: 0;
}
</style>
