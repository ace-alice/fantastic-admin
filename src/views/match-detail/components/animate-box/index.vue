<template>
  <div :class="{ 'animate-box': true, 'clear-margin': isMin }">
    <div :class="{ 'animate-video': true, 'min-animate': isMin }">
      <iframe width="100%" height="100%" :src="animateSrc"></iframe>
      <div class="close-icon" @click="closeAnimate">
        <LazyImage :img-url="closeImage" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  getCurrentInstance,
  onMounted,
  onUnmounted,
  ref,
} from "vue";
import videoAndAnimationHook from "@/hooks/videoAndAnimationHook";

export default defineComponent({
  name: "animate-box",
  props: {
    matchDetail: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  emits: ["closeAnimate"],
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance() as any;

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const closeImage = new URL("@/assets/icons/spread-02.png" ,import.meta.url).href;

    function closeAnimate() {
      emit("closeAnimate");
    }

    const animateSrc = ref(props.matchDetail.has_push_url || "");

    const { animationList } = videoAndAnimationHook(
      props.matchDetail,
      "animation"
    );

    const isMin = ref(false);

    onMounted(() => {
      // 当前
      proxy.mittBus.on("newAnimationPush", (value: string) => {
        if (animateSrc.value != value) {
          animateSrc.value = value;
        }
      });
      if (
        animationList.value.length > 0 &&
        animationList.value[0].has_push_pc != animateSrc.value
      ) {
        animateSrc.value = animationList.value[0].has_push_pc;
      }

      proxy.mittBus.on("setMiniAnimateBus", (isMinTag: boolean) => {
        isMin.value = isMinTag;
      });
    });

    onUnmounted(() => {
      proxy.mittBus.off("newAnimationPush");
      proxy.mittBus.off("setMiniAnimateBus");
    });

    return { closeAnimate, animateSrc, closeImage, isMin };
  },
});
</script>

<style lang="scss" scoped>
.clear-margin {
  margin: auto !important;
}
.animate-box {
  width: calc(100% - 5%);
  margin: 24px auto 0;
  position: relative;
  flex-shrink: 0;
  overflow: hidden;
  background-color: var(--color-bg-second);
  border-radius: 8px;
  .min-animate {
    position: fixed !important;
    bottom: -120px;
    left: -200px;
    background-color: #0d151d;
    z-index: 1000;
    max-width: 900px;
    transform: scale(0.5);
    .close-icon {
      transform: scale(2);
    }
  }
  .animate-video {
    position: relative;
    height: 548px;
    width: 100%;
    iframe {
      border: 0;
    }
    &::before {
      position: absolute;
      content: "";
      height: 547px;
      width: 10.5px;
      background-color: #13151a;
      top: 0;
      left: -10.5px;
    }
    &::after {
      position: absolute;
      content: "";
      height: 547px;
      width: 10.5px;
      background-color: #13151a;
      top: 0;
      right: -10.5px;
    }
    .close-icon {
      position: absolute;
      border-radius: 5px;
      right: 10px;
      top: 16px;
      z-index: 1000;
      cursor: url("~@/assets/icons/home_mouse.png"), auto;
      background-color: #1e2934;
      padding: 4px;
      .lazy-image {
        height: 24px;
        width: 24px;
      }
    }
  }
}
</style>
