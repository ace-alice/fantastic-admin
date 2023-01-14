<template>
  <div class="detail-loading" v-if="!init"></div>
  <div class="match-detail" v-else>
    <DetailHeader
      :match-info="matchDetail"
      @showVideoEmit="showVideoHandle"
      @showAnimateEmit="showAnimateHandle"
    />
    <div class="bottom-box">
      <LiveBox
        :matchDetail="matchDetail"
        v-if="showVideo"
        @closeVideo="showVideoHandle"
      />
      <AnimateBox
        :matchDetail="matchDetail"
        v-if="showAnimate"
        @closeAnimate="showAnimateHandle"
      />
      <RoundTabs
        :round-list="roundList"
        :tab-index="tabIndex"
        :gameLang="matchDetail['game_lang']"
        @changeChartStatus="changeChartStatus"
      />
      <PointChart />
      <DetailContent
        :match-info="matchDetail"
        @setTabIndex="setTabIndex"
        @changeChartStatus="changeChartStatus"
      />
    </div>
    <div class="footer"></div>
  </div>
</template>

<script lang="ts">
import DetailHeader from "./components/detail-header/index.vue";
import DetailContent from "./components/detail-content/index.vue";
import RoundTabs from "./components/round-tabs/index.vue";
import PointChart from "./components/point-chart/index.vue";
import LiveBox from "./components/live-box/index.vue";
import AnimateBox from "./components/animate-box/index.vue";
import { defineComponent } from "vue";
import matchDetailHook from "@/hooks/matchDetailHook";
export default defineComponent({
  name: "ia-match-detail",
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
    } = matchDetailHook();

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
    };
  },
});
</script>

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
