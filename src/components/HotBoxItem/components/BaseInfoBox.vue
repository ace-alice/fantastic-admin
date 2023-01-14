<template>
  <div class="VideoAndAnimationBox">
    <LazyImage :img-url="baseInfo.logo" />
    <div class="event-name">
      <span v-tooltip="{ width: 70, message: baseInfo.eventName }">{{
        baseInfo.eventName
      }}</span>
    </div>
    <div class="deliver"></div>
    <div class="bo">BO{{ baseInfo.bo || 0 }}</div>
    <LiveIcon v-if="baseInfo.isLive" />
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent } from "vue";
const LiveIcon = defineAsyncComponent(
  () => import("@/components/LiveIcon/index.vue")
);

export default defineComponent({
  name: "VideoAndAnimationBox",
  components: { LiveIcon },
  props: {
    baseInfo: {
      type: Object,
      default: () => {
        return {
          bo: 0,
          eventName: "",
          hasVideo: false,
          hasAnimate: false,
          logo: "",
          isLive: false,
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
  flex-grow: 1;
  display: flex;
  overflow: hidden;
  align-items: center;
  .lazy-image {
    width: 24px;
    height: 24px;
    flex-shrink: 0;
  }
  .deliver {
    height: 16px;
    width: 2px;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
    margin-right: 8px;
  }
  .event-name {
    padding: 0 6px;
    overflow: hidden;
    max-width: calc(100% - 80px);
    white-space: nowrap;
    text-overflow: ellipsis;
    font-family: PingFangSC-Regular, PingFangSC-Medium, monospace;
    font-size: 14px;
    color: #f2f2f6;
    letter-spacing: 0;
    font-weight: 400;
    z-index: 5;
  }
}
</style>
