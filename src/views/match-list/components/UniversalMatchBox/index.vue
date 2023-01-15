<script lang="ts">
import { computed, defineAsyncComponent, defineComponent } from 'vue'
import getUniversalListHook from '@/hooks/getUniversalListHook'
import EmptyBox from '@/components/Empty/index.vue'

import NoMore from '@/components/NoMore/index.vue'
import ToTopBox from '@/components/ToTopBox/index.vue'
import matchListToTopHook from '@/hooks/matchListToTopHook'
const UniversalBetItem = defineAsyncComponent(
  () => import('@/components/UniversalBetItem/index.vue'),
)
const DateSelectBox = defineAsyncComponent(
  () => import('../../components/DateSelectBox/index.vue'),
)

export default defineComponent({
  name: 'UniversalMatchBox',
  components: { UniversalBetItem, DateSelectBox, EmptyBox, NoMore, ToTopBox },
  props: {
    handicap: {
      type: String,
      default: 'code',
    },
  },
  setup(props) {
    const {
      matchListData,
      currentDate,
      weekDateOptions,
      changeCurrentDate,
      loadList,
    } = getUniversalListHook(props.handicap as any)

    const hasDateSelect = computed(() => {
      return ['live', 'fix', 'parlay'].includes(props.handicap)
    })

    const { toTopHandle, scrollbarRef, scrollHandle, hasToTop }
      = matchListToTopHook()
    return {
      matchListData,
      currentDate,
      weekDateOptions,
      changeCurrentDate,
      hasDateSelect,
      loadList,
      toTopHandle,
      scrollbarRef,
      scrollHandle,
      hasToTop,
    }
  },
})
</script>

<template>
  <div
    class="list-box UniversalMatchBox"
    :style="{ '--scrollbar-height': hasDateSelect ? 90 : 14 }"
  >
    <DateSelectBox
      v-if="hasDateSelect"
      :week-date-options="weekDateOptions"
      :current-date="currentDate"
      @change="changeCurrentDate"
    />
    <div class="universal-scrollbar">
      <el-scrollbar
        v-show="matchListData.length > 0"
        ref="scrollbarRef"
        @scroll="scrollHandle"
      >
        <transition-group name="list">
          <UniversalBetItem
            v-for="match in matchListData"
            :key="match.id"
            :match-info="match"
          />
        </transition-group>
        <NoMore />
      </el-scrollbar>
      <EmptyBox
        v-show="!loadList && matchListData.length === 0"
        :type="handicap === 'live' ? 'default' : 'live'"
      />
    </div>
    <ToTopBox v-if="hasToTop" @to-top="toTopHandle" />
  </div>
</template>

<!-- suppress CssInvalidPseudoSelector -->
<style lang="scss" scoped>
.UniversalMatchBox {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  .universal-scrollbar {
    height: calc(100% - (calc(var(--scrollbar-height) * 1px)));
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
}
</style>
