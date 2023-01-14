import { computed, watch, getCurrentInstance } from "vue";
import router from "@/router";
import { storeToRefs } from "pinia";
import { socketCacheStore } from "@/store/socketCache";
type ChangeType = "none" | "live" | "animation";
export default function videoAndAnimationHook(
  matchInfo: any,
  change: ChangeType = "none"
) {
  const { proxy } = getCurrentInstance() as any;

  const { videoInfoCache, animationInfoCache } = storeToRefs(
    socketCacheStore()
  );

  // socket推送的视频列表
  const videoList = computed(() => {
    return videoInfoCache.value.filter((video: any) => {
      return video.game_id == matchInfo.id;
    });
  });
  // socket推送的动画列表
  const animationList = computed(() => {
    return animationInfoCache.value.filter((animation: any) => {
      return animation.game_id == matchInfo.id;
    });
  });

  watch(
    () => videoList.value,
    (newVal) => {
      if (
        newVal.length > 0 &&
        router.currentRoute.value.name == "matchDetail" &&
        change == "live"
      ) {
        proxy.mittBus.emit("newVideoPush", newVal[0].url);
      }
    },
    { deep: true }
  );

  watch(
    () => animationList.value,
    (newVal) => {
      if (
        newVal.length > 0 &&
        router.currentRoute.value.name == "matchDetail" &&
        change == "animation"
      ) {
        proxy.mittBus.emit("newAnimationPush", newVal[0].has_push_pc);
      }
    },
    { deep: true }
  );

  // 是否有视频
  const videoHas = computed(() => {
    return (
      !matchInfo.is_end &&
      !matchInfo.is_finish &&
      !matchInfo.is_del &&
      (matchInfo.media_content || videoList.value.length > 0)
    );
  });
  // 是否有动画
  const animationHas = computed(() => {
    return (
      !matchInfo.is_end &&
      !matchInfo.is_finish &&
      !matchInfo.is_del &&
      (matchInfo.has_push_url || animationList.value.length > 0)
    );
  });

  return { videoList, animationList, videoHas, animationHas };
}
