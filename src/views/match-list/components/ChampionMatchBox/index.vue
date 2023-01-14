<template>
  <div class="list-box ChampionMatchBox">
    <el-scrollbar
      v-show="currentMatchList.length > 0"
      ref="scrollbarRef"
      @scroll="scrollHandle"
    >
      <transition-group name="list">
        <ChampionBetItem
          v-for="match in currentMatchList"
          :key="match.id"
          :matchInfo="match"
        />
      </transition-group>
      <NoMore />
    </el-scrollbar>
    <EmptyBox v-show="!loadList && currentMatchList.length === 0" type="live" />
    <ToTopBox @toTop="toTopHandle" v-if="hasToTop" />
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent } from "vue";
import getChampionListHook from "@/hooks/getChampionListHook";
const ChampionBetItem = defineAsyncComponent(
  () => import("@/components/ChampionBetItem/index.vue")
);
import EmptyBox from "@/components/Empty/index.vue";
import NoMore from "@/components/NoMore/index.vue";
import matchListToTopHook from "@/hooks/matchListToTopHook";
import ToTopBox from "@/components/ToTopBox/index.vue";

export default defineComponent({
  name: "ChampionMatchBox",
  components: { ChampionBetItem, EmptyBox, NoMore, ToTopBox },
  setup() {
    const { currentMatchList, loadList } = getChampionListHook();
    const { toTopHandle, scrollbarRef, scrollHandle, hasToTop } =
      matchListToTopHook();
    return {
      currentMatchList,
      loadList,
      toTopHandle,
      scrollbarRef,
      scrollHandle,
      hasToTop,
    };
  },
});
</script>

<!--suppress CssInvalidPseudoSelector -->
<style lang="scss" scoped>
.ChampionMatchBox {
  &:deep(.el-scrollbar) {
    .el-scrollbar__wrap {
      scroll-behavior: smooth;
    }
  }
  .ia-empty {
    height: 100%;
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding-bottom: 240px;
  }
}
</style>
