<template>
  <div class="VideoAndAnimationBox">
    <div class="top">
      {{ baseInfo.eventName || "IA ESPORT" }}
    </div>
    <div class="bottom">
      <div>BO{{ baseInfo.bo || 0 }}</div>
      <div class="video-animate">
        <LazyImage v-if="baseInfo.hasVideo" :img-url="videoIcon" />
        <LazyImage v-if="baseInfo.hasAnimate" :img-url="animateIcon" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "VideoAndAnimationBox",
  components: {},
  props: {
    baseInfo: {
      type: Object,
      default: () => {
        return {
          bo: 0,
          eventName: "",
          hasVideo: false,
          hasAnimate: false,
        };
      },
    },
  },
  setup() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const videoIcon = new URL("@/assets/icons/live.png" ,import.meta.url).href;
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const animateIcon = new URL("@/assets/icons/score.png" ,import.meta.url).href;

    return { videoIcon, animateIcon };
  },
});
</script>

<style lang="scss" scoped>
.VideoAndAnimationBox {
  width: 12.3%;
  padding-right: 2.8%;
  flex-shrink: 0;
  .top {
    font-family: PingFangSC-Regular, PingFangSC-Medium, monospace;
    font-size: 14px;
    color: #ffffff;
  }
  .bottom {
    display: flex;
    align-items: center;
    font-family: PingFangSC-Regular, PingFangSC-Medium, monospace;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.6);
    margin-top: 2px;
    .video-animate {
      display: flex;
    }
    .lazy-image {
      height: 24px;
      margin-left: 12px;
    }
  }
}
</style>
