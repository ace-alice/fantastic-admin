<script lang="ts">
import { defineAsyncComponent, defineComponent } from 'vue'
import getUniversalListHook from '@/hooks/getUniversalListHook'
import EmptyBox from '@/components/Empty/index.vue'
import matchListToTopHook from '@/hooks/matchListToTopHook'
import ToTopBox from '@/components/ToTopBox/index.vue'
const DateSelectBox = defineAsyncComponent(
  () => import('../../components/DateSelectBox/index.vue'),
)
const EndBetItem = defineAsyncComponent(
  () => import('@/components/EndBetItem/index.vue'),
)

export default defineComponent({
  name: 'EndMatchBox',
  components: { DateSelectBox, EndBetItem, EmptyBox, ToTopBox },
  setup() {
    const {
      matchListData,
      weekDateOptions,
      currentDate,
      changeCurrentDate,
      loadList,
    } = getUniversalListHook('end')

    const { toTopHandle, scrollbarRef, scrollHandle, hasToTop }
      = matchListToTopHook()

    return {
      matchListData,
      weekDateOptions,
      currentDate,
      changeCurrentDate,
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
  <div class="list-box EndMatchBox" :style="{ '--scrollbar-height': 90 }">
    <DateSelectBox
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
          <EndBetItem
            v-for="match in matchListData"
            :key="match.id"
            :match-info="match"
          />
        </transition-group>
      </el-scrollbar>
      <EmptyBox v-show="!loadList && matchListData.length === 0" type="live" />
    </div>
    <ToTopBox v-if="hasToTop" @to-top="toTopHandle" />
  </div>
</template>

<!-- suppress CssInvalidPseudoSelector -->
<style lang="scss" scoped>
.EndMatchBox {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .universal-scrollbar {
    &:deep(.el-scrollbar) {
      .el-scrollbar__wrap {
        scroll-behavior: smooth;
      }
    }
    height: calc(100% - (calc(var(--scrollbar-height) * 1px)));
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
