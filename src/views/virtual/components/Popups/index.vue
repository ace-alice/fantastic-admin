<!--suppress CssInvalidPseudoSelector -->
<template>
  <div class="popups">
    <transition-group
      :duration="{ enter: 1000, leave: 1000 }"
      name="custom-classes-transition"
      enter-active-class="animate__animated animate__fadeInLeftBig"
      leave-active-class="animate__animated animate__fadeOutRightBig"
      mode="out-in"
    >
      <div v-show="startBet" class="game-start" key="startBet">
        <el-image
          :src="getPopupsImg('bg', 'start_bet_', currentLang)"
          fit="contain"
        ></el-image>
      </div>
      <div v-show="gameStart" class="game-start" key="gameStart">
        <el-image
          :src="getPopupsImg('bg', 'competition_', currentLang)"
          fit="contain"
        ></el-image>
      </div>
    </transition-group>
    <transition-group
      :duration="{ enter: 500, leave: 500 }"
      name="custom-classes-transition"
      enter-active-class="animate__animated animate__fadeIn"
      leave-active-class="animate__animated animate__fadeOut"
      mode="out-in"
    >
      <div v-show="gameWin" class="game-win" key="gameWin">
        <div class="notice">{{ $t("v_getting_reward") }}</div>
        <div class="win-notice">{{ userWinInfo.send_money }}</div>
      </div>
      <div v-show="gameFail" class="game-fail" key="gameFail">
        <div class="notice">{{ $t("v_unfortunately") }}</div>
        <div class="fail-notice">{{ $t("v_bureau_win") }}</div>
      </div>
    </transition-group>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  getCurrentInstance,
  onMounted,
  onUnmounted,
  reactive,
  toRefs,
} from "vue";
import { userInfoStore } from "@/store/userInfo";
import { getImgOfLang } from "../../hook";
import { storeToRefs } from "pinia";
interface StatesType {
  startBet: boolean;
  gameStart: boolean;
  gameWin: boolean;
  gameFail: boolean;
}
interface AlertType {
  name: "startBet" | "gameStart";
  info?: any;
  time?: number;
}
export default defineComponent({
  name: "PopupsBox",
  props: {
    userWinInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  setup() {
    const { langConfig } = storeToRefs(userInfoStore());
    const { proxy } = getCurrentInstance() as any;
    // 图片加载失败时显示的默认图片
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const errImg = new URL("@/assets/images/logo-error.png" ,import.meta.url).href;
    const states: StatesType = reactive({
      startBet: false,
      gameStart: false,
      gameWin: false,
      gameFail: false,
    });

    //当前语言
    const currentLang = computed(() => {
      return langConfig.value.id;
    });

    // 输赢的背景图
    // function background(name: number) {
    //   const bg = new URL(`@/assets/virtual/bg/price_active_${index}.png` ,import.meta.url).href;
    //   return {
    //     backgroundImage: `url(${bg})`
    //   };
    // }

    const { getPopupsImg } = getImgOfLang();

    onMounted(() => {
      proxy.mittBus.on("openAlert", (value: AlertType) => {
        states[value.name] = true;
        setTimeout(
          () => {
            states[value.name] = false;
          },
          value.time ? value.time * 1000 : 2000
        );
      });
    });

    onUnmounted(() => {
      proxy.mittBus.off("openAlert");
    });

    return { ...toRefs(states), getPopupsImg, errImg, currentLang };
  },
});
</script>

<style lang="scss" scoped>
@media screen and (max-width: 1199px) {
  .popups {
    --px_100: 1200px/19;
  }
}
@media only screen and (min-width: 1200px) and (max-width: 1600px) {
  .popups {
    --px_100: 100vw/19;
  }
}

@media screen and (min-width: 1601px) {
  .popups {
    --px_100: 1600px/19;
  }
}

.game-start {
  height: calc(2.5 * var(--px_100));
  width: calc(10 * var(--px_100));
  position: absolute;
  background-image: url("../../../../assets/virtual/bg/bet-com-bg.png");
  background-size: 100% 100%;
  top: calc(50% - 1.5 * var(--px_100));
  left: calc(50% - 5 * var(--px_100));
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5000;
  &:deep(.el-avatar) {
    // --el-avatar-large-size: calc(0.55 * var(--px_100)) !important;
    & > img {
      height: calc(0.55 * var(--px_100)) !important;
    }
  }
}
.game-win {
  position: absolute;
  z-index: 5000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  top: calc(50% - 2.2 * var(--px_100));
  left: calc(50% - 2.2 * var(--px_100));
  height: calc(4 * var(--px_100));
  width: calc(4.4 * var(--px_100));
  background-image: url("../../../../assets/virtual/bg/win.png");
  background-size: 100% 100%;
  .win-notice {
    font-size: calc(0.22 * var(--px_100));
    color: #dfb34f;
    margin-top: calc(0.1 * var(--px_100));
    font-weight: 500;
    width: 80%;
    text-align: center;
    white-space: pre-wrap;
  }
}
.game-fail {
  position: absolute;
  z-index: 5000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  top: calc(50% - 2.2 * var(--px_100));
  left: calc(50% - 2.2 * var(--px_100));
  height: calc(4 * var(--px_100));
  width: calc(4.4 * var(--px_100));
  background-image: url("../../../../assets/virtual/bg/lose.png");
  background-size: 100% 100%;
  .fail-notice {
    font-size: calc(0.32 * var(--px_100));
    color: #a8b9d5;
    width: 90%;
    text-align: center;
    white-space: pre-wrap !important;
    margin-top: calc(0.1 * var(--px_100));
    font-weight: 500;
  }
}
.notice {
  font-size: calc(0.22 * var(--px_100));
  color: #a8b9d5;
  margin-top: calc(1.8 * var(--px_100));
}
</style>
