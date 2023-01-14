<template>
  <el-scrollbar>
    <GameItem
      :item-info="item"
      v-for="(item, index) in gameList"
      :key="item.id"
      :style="{ '--margin-top': 48 + index * 5 + 'px' }"
    />
  </el-scrollbar>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";
import { gameInfoStore } from "@/store/gameInfo";
const GameItem = defineAsyncComponent(
  () => import("./components/gameItem.vue")
);
import { storeToRefs } from "pinia";
import listAnimateHook from "@/hooks/listAnimateHook";
export default {
  name: "GameList",
  components: { GameItem },
  setup() {
    const { gameList } = storeToRefs(gameInfoStore());

    const { beforeEnter, paragraphEnter } = listAnimateHook();

    return { gameList, beforeEnter, paragraphEnter };
  },
};
</script>

<!--suppress CssInvalidPseudoSelector -->
<style scoped lang="scss">
:deep(.el-scrollbar) {
  .el-scrollbar__bar {
    display: none !important;
  }
}
.item:nth-child(1) {
  border-radius: 0 26px 0 0;
}
.item:last-child {
  border-radius: 0 0 26px 0;
}
.has-bg + .has-bg {
  position: relative;
  &::after {
    position: absolute;
    content: "";
    height: 26px;
    width: 100%;
    background: #373e46;
    top: 0;
    left: 0;
    z-index: -1;
    cursor: not-allowed;
  }
}
</style>
