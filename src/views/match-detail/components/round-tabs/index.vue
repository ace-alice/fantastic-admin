<script lang="ts">
import type { PropType } from 'vue'
import { defineComponent, getCurrentInstance, inject, ref, watch } from 'vue'
import useImageResource from '@/hooks/useImageResource'
import { setItemName } from '@/utils'

export default defineComponent({
  name: 'RoundTabs',
  components: {},
  props: {
    roundList: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    gameLang: { type: String, default: '' },
    tabIndex: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const { prevImg } = useImageResource()
    const currentIndex = ref(props.tabIndex)

    const { proxy }: any = getCurrentInstance()

    const showChart = inject('showChart')

    watch(
      () => props.tabIndex,
      (newVal) => {
        currentIndex.value = newVal
        if (
          proxy.$refs.scrollbarRef
          && proxy.$refs[`scrollbar${currentIndex.value}`]
        ) {
          const scrollbarCurrent
            = Array.isArray(proxy.$refs[`scrollbar${currentIndex.value}`])
              ? proxy.$refs[`scrollbar${currentIndex.value}`][0]
              : proxy.$refs[`scrollbar${currentIndex.value}`]
          proxy.$refs.scrollbarRef.setScrollLeft(
            scrollbarCurrent.offsetLeft / 2,
          )
        }
      },
      { deep: true },
    )

    function toTab(tabIndex: number) {
      if (tabIndex >= 0 && tabIndex < props.roundList.length) {
        proxy.mittBus.emit('scrollToEmit', tabIndex)
      }
    }

    function changeChartStatus(status: string) {
      proxy.mittBus.emit('scrollToEmit', status)
    }

    return {
      setItemName,
      currentIndex,
      prevImg,
      toTab,
      changeChartStatus,
      showChart,
    }
  },
})
</script>

<template>
  <div class="round-tabs">
    <div class="chart-btn">
      <!--      <div v-tooltip="{ width: 10, message: 'item.text' }">chart-btn</div> -->
      <!--      <div -->
      <!--        :class="{ reverse: showChart }" -->
      <!--        @click.stop=" -->
      <!--          changeChartStatus(showChart ? 'notShowChart' : 'showChart') -->
      <!--        " -->
      <!--      > -->
      <!--        <LazyImage :img-url="prevImg" /> -->
      <!--      </div> -->
    </div>
    <div class="round-box">
      <el-scrollbar ref="scrollbarRef">
        <div class="round-list">
          <div
            v-for="(item, index) in roundList"
            :ref="`scrollbar${index}`"
            :key="index"
            class="scrollbar-box"
            :class="{ 'tab-active': currentIndex === index }"
            @click.stop="toTab(index)"
          >
            {{ setItemName(+item, gameLang) }}
          </div>
        </div>
      </el-scrollbar>
    </div>
    <div class="change-btn-group">
      <div
        :class="{ disabled: currentIndex === 0 }"
        @click="toTab(currentIndex - 1)"
      >
        <LazyImage :img-url="prevImg" />
      </div>
      <div
        :class="{ disabled: currentIndex === roundList.length - 1 }"
        @click="toTab(currentIndex + 1)"
      >
        <LazyImage :img-url="prevImg" />
      </div>
    </div>
  </div>
</template>

<!-- suppress CssInvalidPseudoSelector -->
<style lang="scss" scoped>
.round-tabs {
  height: 80px;
  width: 100%;
  flex-shrink: 0;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  .chart-btn {
    display: flex;
    width: 15%;
    padding: 0 2.5%;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
    .reverse {
      transform: rotate(-90deg) !important;
    }
    & > div {
      font-family: PingFangSC-Regular, PingFangSC-Medium, monospace;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.6);
      flex-shrink: 0;
      &:nth-child(1) {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      &:nth-child(2) {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 32px;
        width: 32px;
        margin-left: 8px;
        transform: rotate(90deg);
        transition: all 0.25s ease-in-out;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 50%;
        cursor: url("@/assets/icons/home_mouse.png"), auto;
        .lazy-image {
          height: 24px;
          width: 24px;
        }
      }
    }
  }
  .change-btn-group {
    width: 12.5%;
    padding: 0 2.5%;
    flex-shrink: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .disabled {
      background-color: rgba(255, 255, 255, 0.05);
      cursor: not-allowed;
    }
    & > div {
      height: 24px;
      width: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.2);
      cursor: url("@/assets/icons/home_mouse.png"), auto;
      transition: transform 0.2s ease-in-out;
      &:hover {
        transform: scale(1.06);
        &:nth-child(2) {
          transform: rotate(180deg) scale(1.06);
        }
      }
      &:nth-child(2) {
        transform: rotate(180deg);
      }
    }
    .lazy-image {
      height: 20px;
      width: 20px;
      transform: translateX(-1.5px);
    }
  }
  .round-box {
    max-width: 70%;
    height: 100%;
    overflow: scroll;
    display: flex;
    align-items: center;
    &:deep(.el-scrollbar) {
      .el-scrollbar__thumb {
        display: none;
      }
    }
    .round-list {
      display: flex;
      height: 80px;
      align-items: center;
      padding: 0 5px;
    }
  }
  .scrollbar-box {
    padding: 2px 24px;
    line-height: 28px;
    font-family: PingFangSC-Regular, PingFangSC-Medium, monospace;
    font-size: 16px;
    color: rgba(255, 255, 255, 0.6);
    letter-spacing: 1px;
    cursor: url("@/assets/icons/home_mouse.png"), auto;
    flex-shrink: 0;
    border-radius: 16px;
    transition: all 0.3s ease-in-out;
    & + .scrollbar-box {
      margin-left: 24px;
    }
  }
  .tab-active {
    background-image: linear-gradient(90deg, #f16720 0%, #fd8908 94%);
    color: var(--color-white);
  }
}
</style>
