<template>
  <div
    :class="{
      'match-tab': true,
      'cut-height': !allHeight || showVideo || showAnimate,
    }"
  >
    <LazyImage :img-url="prevImg" class="back-btn" @click.stop="goBack" />
    <div class="bo-event-name">
      <div>
        <LazyImage :img-url="matchInfo.game_logo" />
        <div>{{ matchInfo.event_name || "IA ESPORT" }}</div>
      </div>
      <div>
        <div>BO{{ matchInfo.bo }}</div>
        <LiveIcon v-show="+matchInfo.category_id === 3" />
      </div>
    </div>
    <div class="video-animate">
      <LazyImage
        :img-url="videoImage"
        v-if="videoHas"
        @click.stop="toShowVideo"
      />
      <LazyImage
        :img-url="animateImage"
        v-if="animationHas"
        @click.stop="toShowAnimate"
      />
    </div>
    <div class="play-info">
      <div class="team-name">{{ matchInfo.team_name_1 }}</div>
      <LazyImage :img-url="matchInfo.team_logo_1" />
      <div class="score-box">
        <div>{{ matchInfo.score_1 || 0 }}</div>
        -
        <div>{{ matchInfo.score_2 || 0 }}</div>
        <div class="start-time">
          {{ parseTime(matchInfo.game_start_time, "{h}:{i}") }}
        </div>
      </div>
      <LazyImage :img-url="matchInfo.team_logo_1" />
      <div class="team-name">{{ matchInfo.team_name_2 }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { parseTime } from "@/utils";
import useImageResource from "@/hooks/useImageResource";
import useRouteHook from "@/hooks/useRouteHook";
const LiveIcon = defineAsyncComponent(
  () => import("@/components/LiveIcon/index.vue")
);
import {
  defineAsyncComponent,
  getCurrentInstance,
  inject,
  onMounted,
  onUnmounted,
  ref,
} from "vue";
import videoAndAnimationHook from "@/hooks/videoAndAnimationHook";
export default {
  name: "ia-match-tab",
  props: {
    matchInfo: {
      type: Object,
      default: () => null,
    },
  },
  components: { LiveIcon },
  emits: ["showVideoEmit", "showAnimateEmit"],
  setup(props: any, { emit }: any) {
    const { prevImg } = useImageResource();
    const { routerJump } = useRouteHook();
    const { animationHas, videoHas } = videoAndAnimationHook(props.matchInfo);

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const videoImage = new URL("@/assets/icons/live.png" ,import.meta.url).href;

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const animateImage = new URL("@/assets/icons/score.png" ,import.meta.url).href;

    const showVideo = inject("showVideo");

    const showAnimate = inject("showAnimate");

    const goBack = () => {
      routerJump("MatchList");
    };

    const allHeight = ref(true);

    const { proxy }: any = getCurrentInstance();

    function toShowVideo() {
      if (!videoHas.value) return;
      emit("showVideoEmit");
    }

    function toShowAnimate() {
      if (!animationHas.value) return;
      emit("showAnimateEmit");
    }

    onMounted(() => {
      proxy.mittBus.on("changeHeightBus", (tag: boolean) => {
        allHeight.value = tag;
      });
    });

    onUnmounted(() => {
      proxy.mittBus.off("changeHeightBus");
    });

    return {
      prevImg,
      goBack,
      allHeight,
      videoImage,
      animateImage,
      animationHas,
      videoHas,
      toShowVideo,
      showVideo,
      toShowAnimate,
      showAnimate,
      parseTime,
    };
  },
};
</script>

<style scoped lang="scss">
.match-tab {
  height: 220px;
  background: #171923;
  flex-shrink: 0;
  margin: 16px 0;
  overflow: hidden;
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  .play-info {
    display: flex;
    align-items: center;
    .lazy-image {
      height: 64px;
      width: 64px;
      margin: 0 36px;
      transition: all 0.25s ease-in-out;
    }
    .team-name {
      font-family: PingFangSC-Regular, PingFangSC-Medium, monospace;
      font-size: 18px;
      color: rgba(255, 255, 255, 0.6);
    }
    .score-box {
      display: flex;
      align-items: center;
      font-family: Gotham-Medium, PingFangSC-Medium, monospace;
      font-size: 32px;
      color: #ffffff;
      font-weight: 500;
      transition: all 0.25s ease-in-out;
      position: relative;
      .start-time {
        background: none !important;
        position: absolute;
        bottom: -60px;
        left: calc(50% - 36px);
        transform: translateY(0);
        font-family: PingFangSC-Regular, monospace;
        font-size: 14px;
        color: #fe5e00;
        font-weight: 400;
        transition: all 0.2s ease-in-out;
      }
      div {
        transition: all 0.25s ease-in-out;
        height: 52px;
        width: 48px;
        line-height: 52px;
        text-align: center;
        background: rgba(255, 255, 255, 0.08);
        border-radius: 8px;
        margin: 0 12px;
      }
    }
  }
  .video-animate {
    position: absolute;
    right: 40px;
    top: 28px;
    display: flex;
    align-items: center;
    transition: all 0.25s ease-in-out;
    cursor: url("~@/assets/icons/home_mouse.png"), auto;
    .lazy-image {
      height: 24px;
      width: 24px;
      & + .lazy-image {
        margin-left: 12px;
      }
    }
  }
  &:after {
    position: absolute;
    content: "";
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
    background: url("../../../../assets/images/schedule-header-bg.png")
      no-repeat;
    background-size: 100% 260px;
    z-index: -1;
    opacity: 0.6;
  }
  transition: all 0.25s ease-in-out;
  .back-btn {
    position: absolute;
    height: 32px;
    width: 32px;
    top: 24px;
    left: 32px;
    transition: all 0.25s ease-in-out;
    cursor: url("~@/assets/icons/home_mouse.png"), auto;
  }
  .bo-event-name {
    transition: all 0.25s ease-in-out;
    position: absolute;
    top: 28px;
    left: 88px;
    font-family: PingFangSC-Regular, PingFangSC-Medium, monospace;
    font-size: 14px;
    & > div {
      display: flex;
      align-items: center;
      &:nth-child(1) {
        color: #ffffff;
        .lazy-image {
          height: 24px;
          width: 24px;
          margin-right: 24px;
        }
      }
      &:nth-child(2) {
        color: rgba(255, 255, 255, 0.6);
        padding: 4px 48px;
      }
    }
  }
}
.cut-height {
  height: 82px;
  overflow: hidden;
  .start-time {
    transform: translateY(60px) !important;
  }
  .play-info {
    display: flex;
    align-items: center;
    .lazy-image {
      height: 32px;
      width: 32px;
      margin: 0 12px;
    }
    .team-name {
      font-size: 14px;
    }
    .score-box {
      font-size: 24px;
      div {
        height: 34px;
        width: 32px;
        line-height: 34px;
        margin: 0 8px;
      }
    }
  }
  .video-animate {
    top: 12px;
    right: 24px;
  }
  .back-btn {
    top: 8px;
    left: 16px;
  }
  .bo-event-name {
    top: 12px;
    left: 72px;
  }
}
</style>
