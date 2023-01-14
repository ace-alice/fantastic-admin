<!--suppress CssInvalidPseudoSelector -->
<template>
  <div class="tools-item">
    <el-switch
      v-model="isOnSound"
      v-tooltip="{ width: 10, message: $t('v_sound_effect_switch') }"
      :inline-prompt="true"
      active-color=" #3553AB"
      inactive-color="#2E333C"
      :active-text="$t('Off')"
      :inactive-text="$t('On')"
      @change="changeSwitch"
    />
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-var-requires */
import {
  defineComponent,
  getCurrentInstance,
  nextTick,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  toRefs,
} from "vue";
import { ElMessageBox } from "element-plus";
import { useI18n } from "vue-i18n";
type AudioSourceType =
  | "transitionsAudio"
  | "competitionAudio"
  | "startGameAudio"
  | "pentakillAudio"
  | "winOrLose"
  | "winMoney"
  | "betAudio"
  | "toBetAudio";
interface AudioType {
  name: AudioSourceType;
  time?: number;
  volume?: number;
}

export default defineComponent({
  name: "audioBox",
  setup() {
    const { proxy } = getCurrentInstance() as any;
    const i18n = useI18n();

    const isOnSound = ref(false);

    const audioSource = reactive({
      /**
       * 过场音效
       */
      transitionsAudio: new Audio(
        new URL("@/assets/virtual/audio/1.mp3", import.meta.url).href
      ),
      /**
       * 比赛音频
       */
      competitionAudio: new Audio(
        new URL("@/assets/virtual/audio/3.mp3", import.meta.url).href
      ),
      /**
       * 开始比赛音效
       */
      startGameAudio: new Audio(
        new URL("@/assets/virtual/audio/4.wav", import.meta.url).href
      ),
      /**
       * 五杀音效
       */
      pentakillAudio: new Audio(
        new URL("@/assets/virtual/audio/5.mp3", import.meta.url).href
      ),
      /**
       * 出胜负音效
       */
      winOrLose: new Audio(
        new URL("@/assets/virtual/audio/6.mp3", import.meta.url).href
      ),
      /**
       * 赢钱音效
       */
      winMoney: new Audio(
        new URL("@/assets/virtual/audio/7.wav", import.meta.url).href
      ),
      /**
       * 下注成功音效
       */
      betAudio: new Audio(
        new URL("@/assets/virtual/audio/2.wav", import.meta.url).href
      ),
      toBetAudio: new Audio(
        new URL("@/assets/virtual/audio/2.wav", import.meta.url).href
      ),
    });

    function changeSwitch(val: any): any {
      proxy.mittBus.emit("initAudio", val);
    }

    onMounted(() => {
      nextTick(() => {
        ElMessageBox.confirm(i18n.t("isAudio"), i18n.t("notice"), {
          confirmButtonText: i18n.t("turnOn"),
          cancelButtonText: i18n.t("close"),
          // type: 'warning',
          customClass: "audio-message-box",
        })
          .then(() => {
            isOnSound.value = true;
            proxy.mittBus.emit("initAudio", true);
          })
          .catch(() => {
            isOnSound.value = false;
          });
      });
      proxy.mittBus.on("playAudio", (value: AudioType) => {
        if (value.name == "toBetAudio" && isOnSound.value == true) {
          const toBetAudio = new Audio(
            new URL("@/assets/virtual/audio/2.wav", import.meta.url).href
          );
          if (isOnSound.value == true) {
            toBetAudio.play();
          }
          return;
        }
        if (value.time == -1) {
          (audioSource[value.name] as any).pause();
          return;
        }
        //  (audioSource[value.name] as any).paused == true &&
        if (isOnSound.value == true) {
          (audioSource[value.name] as any).load();
          (audioSource[value.name] as any).play();
          if (value.time) {
            setTimeout(() => {
              audioSource[value.name].pause();
            }, value.time * 1000);
          }
        }
      });
    });

    onUnmounted(() => {
      proxy.mittBus.off("playAudio");
    });

    return { ...toRefs(audioSource), isOnSound, changeSwitch };
  },
});
</script>

<style lang="scss" scoped>
@media screen and (max-width: 1199px) {
  .tools-item {
    --px_100: 1200px/19;
  }
}
@media only screen and (min-width: 1200px) and (max-width: 1600px) {
  .tools-item {
    --px_100: 100vw/19;
  }
}

@media screen and (min-width: 1601px) {
  .tools-item {
    --px_100: 1600px/19;
  }
}
.tools-item {
  flex-shrink: 0;
  height: calc(0.6 * var(--px_100));
  width: calc(0.8 * var(--px_100));
  font-size: calc(0.2 * var(--px_100));
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  &:deep(.el-switch) {
    height: calc(0.32 * var(--px_100));
    line-height: calc(0.32 * var(--px_100));
    .el-switch__core {
      height: calc(0.32 * var(--px_100));
      width: calc(0.64 * var(--px_100)) !important;
      border-radius: calc(0.16 * var(--px_100));
      .el-switch__inner {
        height: 100%;
        top: 0;
      }
      .el-switch__action {
        height: calc(0.28 * var(--px_100));
        width: calc(0.28 * var(--px_100));
        background-color: #a8b9d5;
        left: 2%;
        z-index: 10;
        &::before {
          content: "";
          position: absolute;
          height: 100%;
          width: 100%;
          background-image: url("../../../../../assets/virtual/icon/audio_off.png");
          background-repeat: no-repeat;
          background-size: 55%;
          background-position: 50% 50%;
        }
      }
    }
    .el-switch__label {
      color: #a8b9d5;
      height: calc(0.28 * var(--px_100));
      width: calc(0.28 * var(--px_100));
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: visible !important;
      z-index: 5;
      span {
        font-size: calc(0.19 * var(--px_100));
        zoom: 0.7;
      }
    }
    .el-switch__label--left {
      position: absolute;
      margin: 0;
      left: calc(0.02 * var(--px_100));
    }
    .el-switch__label--right {
      position: absolute;
      margin: 0;
      right: calc(0.03 * var(--px_100));
    }
  }
  &:deep(.is-checked) {
    .el-switch__label {
      color: #ffffff;
    }
    .el-switch__core {
      height: calc(0.32 * var(--px_100));
      width: calc(0.64 * var(--px_100)) !important;
      .el-switch__action {
        margin: 0;
        background-color: #ffffff;
        left: calc(0.32 * var(--px_100));
        &::before {
          content: "";
          position: absolute;
          height: 100%;
          width: 100%;
          background-image: url("../../../../../assets/virtual/icon/audio_on.png");
          background-repeat: no-repeat;
          background-size: 55%;
          background-position: 50% 50%;
        }
      }
    }
  }
}
</style>
