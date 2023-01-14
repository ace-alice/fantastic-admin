<template>
  <div :class="{ 'live-box': true, 'is-min': isMin }">
    <div class="live-video" :style="{ '--height': iframeStyle }">
      <div v-if="!isIframe" ref="dplayer" id="dplayer"></div>
      <div v-else class="iframe-box" v-html="currentVideoUrl"></div>
      <div class="close-icon" @click="closeVideo">
        <LazyImage :img-url="closeImage" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable no-useless-escape */
import {
  defineComponent,
  getCurrentInstance,
  nextTick,
  onMounted,
  onUnmounted,
  Ref,
  ref,
} from "vue";
import Player from "xgplayer";
import HlsJsPlayer from "xgplayer-hls.js";
import FlvPlayer from "xgplayer-flv";
import { base64decode } from "@/utils/base64DecodeChars";
import { getLocal } from "@/utils/storage";
import videoAndAnimationHook from "@/hooks/videoAndAnimationHook";

export default defineComponent({
  name: "live-box",
  components: {},
  props: {
    matchDetail: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  emits: ["closeVideo"],
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance() as any;
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const closeImage = new URL("@/assets/icons/spread-02.png", import.meta.url)
      .href;

    const isMin = ref(false);

    function closeVideo() {
      emit("closeVideo");
    }
    const player: Ref<any> = ref(null);

    const isIframe = ref(false);

    const iframeStyle = ref((720 * 720) / 1280);

    const currentVideoUrl = ref("");

    function initPlayer(url: string) {
      const commonOption = {
        el: proxy.$refs["dplayer"],
        url: url,
        isLive: true,
        // 是否自动播放
        autoplay: true,
        // 是否显示视频首帧
        videoInit: true,
        // 封面图
        poster: "",
        // 触发全屏时实现样式横屏全屏
        // rotateFullscreen: true,
        crossOrigin: true,
        // fitVideoSize: 'auto',
        width: "100%",
        height: "auto",
        // controlPlugins: [play, fullscreen, progress, volume, pip, flex],
        // pip: true, // 打开画中画功能
        lang: getLocal("langConfig")?.id == 1 ? "zh-cn" : "en",
        miniplayer: true,
        miniplayerConfig: {
          bottom: 10,
          left: 10,
          width: 512,
          height: 370,
          zIndex: 600,
        },
      };

      const flvTag = url.indexOf(".flv");
      const m3u8Tag = url.indexOf(".m3u8");

      if (flvTag != -1) {
        player.value = new FlvPlayer(Object.assign(commonOption, {}));
      } else if (m3u8Tag != -1) {
        player.value = new HlsJsPlayer(Object.assign(commonOption, {}));
      } else {
        player.value = new Player(Object.assign(commonOption, {}));
      }
    }

    const { videoList } = videoAndAnimationHook(props.matchDetail, "live");

    const isInit = ref(false);
    onMounted(() => {
      isInit.value = true;
      // 当有新视频推送时调用
      proxy.mittBus.on("newVideoPush", (value: any) => {
        if (
          currentVideoUrl.value &&
          currentVideoUrl.value.indexOf("twitch") !== -1
        ) {
          const startInx = currentVideoUrl.value.indexOf("https");
          const endInx = currentVideoUrl.value.indexOf("&parent");
          const host = currentVideoUrl.value.substring(startInx, endInx);
          const parent = window.location.host;
          let referrer = "";
          if (window.document.referrer) {
            const startInxR = window.document.referrer.indexOf("//");
            const len = window.document.referrer.length;
            referrer = window.document.referrer.substring(
              startInxR + 2,
              len - 1
            );
            currentVideoUrl.value = `<iframe src=\"${host}&parent=${parent}&parent=${referrer}\" allowfullscreen ></iframe>`;
          } else {
            currentVideoUrl.value = `<iframe src=\"${host}&parent=${parent}\" allowfullscreen ></iframe>`;
          }
        }
        if (
          value &&
          currentVideoUrl.value != value &&
          value.indexOf("iframe") !== -1
        ) {
          currentVideoUrl.value = value;
          isIframe.value = true;
          return;
        } else {
          isIframe.value = false;
        }
        if (
          value &&
          currentVideoUrl.value != value &&
          proxy.$refs["dplayer"] &&
          isInit.value
        ) {
          if (player.value) {
            player.value.pause();
            player.value.src = value;
            player.value.play();
            // player.value.reload();
          } else {
            initPlayer(value);
          }
        }
      });

      proxy.mittBus.on("setMiniplayerBus", (isMinTag: boolean) => {
        if (player.value) {
          isMin.value = isMinTag;
          isMinTag
            ? player.value.getMiniplayer()
            : player.value.exitMiniplayer();
        }
      });

      nextTick(() => {
        if (videoList.value.length > 0) {
          currentVideoUrl.value = videoList.value[0].url;
        } else {
          currentVideoUrl.value = base64decode(
            props.matchDetail.media_content
              ? props.matchDetail.media_content
              : "test"
          );
        }
        if (
          currentVideoUrl.value &&
          currentVideoUrl.value.indexOf("twitch") !== -1
        ) {
          const startInx = currentVideoUrl.value.indexOf("https");
          const endInx = currentVideoUrl.value.indexOf("&parent");
          const host = currentVideoUrl.value.substring(startInx, endInx);
          const parent = window.location.host;
          let referrer = "";
          if (window.document.referrer) {
            const startInxR = window.document.referrer.indexOf("//");
            const len = window.document.referrer.length;
            referrer = window.document.referrer.substring(
              startInxR + 2,
              len - 1
            );
            currentVideoUrl.value = `<iframe src=\"${host}&parent=${parent}&parent=${referrer}\" allowfullscreen ></iframe>`;
          } else {
            currentVideoUrl.value = `<iframe src=\"${host}&parent=${parent}\" allowfullscreen ></iframe>`;
          }
        }
        if (currentVideoUrl.value.indexOf("iframe") !== -1) {
          console.log(currentVideoUrl.value);
          isIframe.value = true;
          return;
        } else {
          isIframe.value = false;
        }
        if (player.value) {
          player.value.pause();
          player.value.destroy();
          player.value = null;
          initPlayer(currentVideoUrl.value);
        } else {
          initPlayer(currentVideoUrl.value);
        }
      });
    });

    onUnmounted(() => {
      isInit.value = false;
      proxy.mittBus.off("newVideoPush");
      proxy.mittBus.off("setMiniplayerBus");
      if (player.value) {
        player.value.pause();
        player.value.destroy();
        player.value = null;
      }
    });

    return {
      closeImage,
      closeVideo,
      player,
      currentVideoUrl,
      isIframe,
      iframeStyle,
      isMin,
    };
  },
});
</script>

<style lang="scss" scoped>
.is-min {
  margin: 0 auto 0 !important;
  min-height: 0 !important;
}
.live-box {
  width: calc(100% - 5%);
  margin: 24px auto 0;
  min-height: 330px;
  flex-shrink: 0;
  transition: all 0.5s ease-in-out;
  .iframe-box {
    height: calc(var(--height) * 1px);
  }
  overflow: hidden;
  .live-video {
    position: relative;
    width: 100%;
    height: 100%;
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
  .iframe-box iframe {
    width: 100% !important;
    height: 100% !important;
    border: none !important;
  }
}
#dplayer {
  z-index: 1000;
}
</style>
