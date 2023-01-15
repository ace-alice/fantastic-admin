<script lang="ts">
import { computed, defineComponent } from 'vue'
import { storeToRefs } from 'pinia'
import HotMatchBox from './components/HotMatchBox/index.vue'
import UniversalMatchBox from './components/UniversalMatchBox/index.vue'
import EndMatchBox from './components/EndMatchBox/index.vue'
import ChampionMatchBox from './components/ChampionMatchBox/index.vue'
import HandicapBox from './components/HandicapBox/index.vue'
import { gameInfoStore } from '@/store/gameInfo'

const handicapName: any = {
  end: 'EndMatchBox',
  champion: 'ChampionMatchBox',
}

export default defineComponent({
  name: 'MatchList',
  components: {
    HotMatchBox,
    UniversalMatchBox,
    EndMatchBox,
    ChampionMatchBox,
    HandicapBox,
  },
  setup() {
    const { currentHandicap } = storeToRefs(gameInfoStore())

    const currentMatchBoxName = computed(() => {
      return handicapName[currentHandicap.value] || 'UniversalMatchBox'
    })

    return { currentHandicap, currentMatchBoxName }
  },
})
</script>

<template>
  <div class="match-list">
    <HotMatchBox />
    <HandicapBox />
    <transition name="fade">
      <component
        :is="currentMatchBoxName"
        :key="currentHandicap"
        :handicap="currentHandicap"
      />
    </transition>
  </div>
</template>

<!-- suppress CssInvalidPseudoSelector -->
<style lang="scss" scoped>
.match-list {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: 100%;

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
