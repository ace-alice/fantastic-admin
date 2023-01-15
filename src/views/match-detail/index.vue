<!-- eslint-disable vue/v-on-event-hyphenation -->
<script lang="ts">
import { defineComponent } from 'vue'
import DetailHeader from './components/detail-header/index.vue'
import DetailContent from './components/detail-content/index.vue'
import RoundTabs from './components/round-tabs/index.vue'
import PointChart from './components/point-chart/index.vue'
import LiveBox from './components/live-box/index.vue'
import AnimateBox from './components/animate-box/index.vue'
import matchDetailHook from '@/hooks/matchDetailHook'
export default defineComponent({
  name: 'IaMatchDetail',
  components: {
    DetailHeader,
    DetailContent,
    RoundTabs,
    PointChart,
    LiveBox,
    AnimateBox,
  },
  setup() {
    const {
      matchDetail,
      tabIndex,
      setTabIndex,
      showChart,
      changeChartStatus,
      init,
      showVideo,
      showVideoHandle,
      showAnimate,
      showAnimateHandle,
      roundList,
    } = matchDetailHook()

    return {
      matchDetail,
      tabIndex,
      setTabIndex,
      showChart,
      changeChartStatus,
      init,
      showVideo,
      showVideoHandle,
      showAnimate,
      showAnimateHandle,
      roundList,
    }
  },
})
</script>

<template>
  <div v-if="!init" class="detail-loading" />
  <div v-else class="match-detail">
    <DetailHeader
      :match-info="matchDetail"
      @showVideoEmit="showVideoHandle"
      @showAnimateEmit="showAnimateHandle"
    />
    <div class="bottom-box">
      <LiveBox
        v-if="showVideo"
        :match-detail="matchDetail"
        @closeVideo="showVideoHandle"
      />
      <AnimateBox
        v-if="showAnimate"
        :match-detail="matchDetail"
        @closeAnimate="showAnimateHandle"
      />
      <RoundTabs
        :round-list="roundList"
        :tab-index="tabIndex"
        :game-lang="matchDetail.game_lang"
        @changeChartStatus="changeChartStatus"
      />
      <PointChart />
      <DetailContent
        :match-info="matchDetail"
        @setTabIndex="setTabIndex"
        @changeChartStatus="changeChartStatus"
      />
    </div>
    <div class="footer" />
  </div>
</template>

<style lang="scss" scoped>
.detail-loading {
  background-color: #01fb66;
}
.match-detail {
  display: flex;
  flex-direction: column;
  align-items: center;

  & > div {
    width: 97.4%;
  }
  .footer {
    height: 13px;
    flex-shrink: 0;
  }
  .bottom-box {
    flex-grow: 1;
    overflow: hidden;
    //scroll-behavior: smooth;
    background: var(--color-bg-primary);
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.15);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
  }
}
</style>
