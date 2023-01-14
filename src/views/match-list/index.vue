<template>
  <div class="match-list">
    <HotMatchBox />
    <HandicapBox />
    <transition name="fade">
      <component
        :is="currentMatchBoxName"
        :handicap="currentHandicap"
        :key="currentHandicap"
      />
    </transition>
  </div>
</template>

<script lang="ts">
import { computed, defineAsyncComponent, defineComponent } from "vue";
import { storeToRefs } from "pinia";
import { gameInfoStore } from "@/store/gameInfo";

const HotMatchBox = defineAsyncComponent(
  () => import("./components/HotMatchBox/index.vue")
);
const UniversalMatchBox = defineAsyncComponent(
  () => import("./components/UniversalMatchBox/index.vue")
);
const EndMatchBox = defineAsyncComponent(
  () => import("./components/EndMatchBox/index.vue")
);
const ChampionMatchBox = defineAsyncComponent(
  () => import("./components/ChampionMatchBox/index.vue")
);
const HandicapBox = defineAsyncComponent(
  () => import("./components/HandicapBox/index.vue")
);

const handicapName: any = {
  end: "EndMatchBox",
  champion: "ChampionMatchBox",
};

export default defineComponent({
  name: "MatchList",
  components: {
    HotMatchBox,
    UniversalMatchBox,
    EndMatchBox,
    ChampionMatchBox,
    HandicapBox,
  },
  setup() {
    const { currentHandicap } = storeToRefs(gameInfoStore());

    const currentMatchBoxName = computed(() => {
      return handicapName[currentHandicap.value] || "UniversalMatchBox";
    });

    return { currentHandicap, currentMatchBoxName };
  },
});
</script>

<!--suppress CssInvalidPseudoSelector -->
<style lang="scss" scoped>
.match-list {
  display: flex;
  flex-direction: column;

  & > div {
    flex-shrink: 0;
    width: calc(100% - 30px);
    margin: auto;
  }
  .list-box {
    height: calc(100% - 56px);
    overflow: hidden;
  }
  &:deep(.el-scrollbar__thumb) {
    background: rgba(254, 94, 0, 0.5);
    border-radius: 7px;
    width: 6px;
  }
}
</style>
