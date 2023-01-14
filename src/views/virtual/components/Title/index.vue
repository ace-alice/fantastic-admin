<!--suppress CssInvalidPseudoSelector -->
<template>
  <div class="virtual-title">
    <div class="title-top">
      <div class="team-pick">
        <div v-for="hero in redHeroPick" :key="hero.type">
          <div class="hero-avatar">
            <el-avatar shape="square" :src="hero.icon">
              <img :src="hero.default" alt="" />
            </el-avatar>
            <div class="hero-label">{{ hero.label }}</div>
          </div>
        </div>
      </div>
      <div class="match-team">
        <el-avatar shape="square" :src="redLogo">
          <img :src="errImg" alt="" />
        </el-avatar>
        <el-avatar shape="square" :src="vsImg" v-if="!showTimer">
          <img :src="errImg" alt="" />
        </el-avatar>
        <div v-else class="match-score">
          <span>{{ score[0] }}</span
          >:<span>{{ score[1] }}</span>
        </div>
        <el-avatar shape="square" :src="blueLogo">
          <img :src="errImg" alt="" />
        </el-avatar>
      </div>
      <div class="team-pick">
        <div v-for="hero in blueHeroPick" :key="hero.type">
          <div class="hero-avatar">
            <el-avatar shape="square" :src="hero.icon">
              <img :src="hero.default" alt="" />
            </el-avatar>
            <div class="hero-label">{{ hero.label }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="title-footer">
      <div class="result">
        <div v-for="result in redResult" :key="result.id">
          <div class="hero-avatar">
            <el-avatar shape="square" :src="result.resultIcon">
              <img :src="result.default" alt="" />
            </el-avatar>
          </div>
        </div>
      </div>
      <div class="time-info">
        <div>{{ matchStatus }}</div>
        <div v-show="showTimer" class="match-time">{{ gameTime }}</div>
        <div v-show="showCountdown" class="countdown-time">
          <div :class="{ 'countdown-time-animation': countdownAnimate }">
            {{ countdown - 27 }}
          </div>
        </div>
      </div>
      <div class="result">
        <div v-for="result in blueResult" :key="result.id">
          <div class="hero-avatar">
            <el-avatar shape="square" :src="result.resultIcon">
              <img :src="result.default" alt="" />
            </el-avatar>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-var-requires */
import {
  computed,
  defineComponent,
  getCurrentInstance,
  onUnmounted,
  Ref,
  ref,
  watch,
} from "vue";
import { useI18n } from "vue-i18n";
import { userInfoStore } from "@/store/userInfo";
import { getImgOfLang } from "../../hook/index";
import { storeToRefs } from "pinia";

export default defineComponent({
  name: "virtualTitle",
  props: {
    countdown: {
      type: Number,
      default: 0,
    },
    timer: {
      type: Number,
      default: 0,
    },
    scoreInfo: {
      type: Object,
      default: () => {
        return { score1: 0, score2: 0, gameTime: 0 };
      },
    },
    playResult: {
      type: Array,
      default: () => {
        return [];
      },
    },
    teamHero: {
      type: Object,
      default: () => {
        return { redTeam: [], blueTeam: [] };
      },
    },
  },
  setup(props) {
    const i18n = useI18n();
    const { langConfig } = storeToRefs(userInfoStore());
    const { proxy } = getCurrentInstance() as any;
    //当前语言
    const currentLang = computed(() => {
      return langConfig.value.id || 1;
    });
    const { getImg } = getImgOfLang();
    // 图片加载失败时显示的默认图片
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const errImg = new URL("@/assets/images/logo-error.png" ,import.meta.url).href;
    //蓝队logo
    const blueLogo = computed(() => {
      return new URL(`@/assets/virtual/bg/blueLogo_${
        currentLang.value ? currentLang.value : 1
      }.png`, import.meta.url).href;
    });
    //红队logo
    const redLogo = computed(() => {
      return new URL(`@/assets/virtual/bg/redLogo_${
        currentLang.value ? currentLang.value : 1
      }.png`, import.meta.url).href;
    });
    //vs logo
    const vsImg = new URL("@/assets/virtual/icon/virtual-vs.png" ,import.meta.url).href;
    //上单
    const topIcon = new URL("@/assets/virtual/icon/icon_sd.png" ,import.meta.url).href;
    //中单
    const midIcon = new URL("@/assets/virtual/icon/icon_zd.png" ,import.meta.url).href;
    //辅助
    const supIcon = new URL("@/assets/virtual/icon/icon_fz.png" ,import.meta.url).href;
    //ADC
    const adcIcon = new URL("@/assets/virtual/icon/icon_ss.png" ,import.meta.url).href;
    //打野
    const jugIcon = new URL("@/assets/virtual/icon/icon_dy.png" ,import.meta.url).href;
    //小龙首杀
    const xlssIcon = new URL("@/assets/virtual/icon/xlss.png" ,import.meta.url).href;
    //小龙元素
    const xlysIcon = new URL("@/assets/virtual/icon/xlys.png" ,import.meta.url).href;
    //单人五杀
    const dr5sIcon = new URL("@/assets/virtual/icon/dr5s.png" ,import.meta.url).href;
    //一血
    const yxIcon = new URL("@/assets/virtual/icon/yx.png" ,import.meta.url).href;
    //胜负
    const sbIcon = new URL("@/assets/virtual/icon/sb.png" ,import.meta.url).href;
    //红队选人
    const redHeroPick: Ref<any[]> = ref([
      {
        label: i18n.t("v_top"),
        icon: null,
        default: topIcon,
        hero_name: "",
        type: 1,
      },
      {
        label: i18n.t("v_jug"),
        icon: null,
        default: jugIcon,
        hero_name: "",
        type: 2,
      },
      {
        label: i18n.t("v_mid"),
        icon: null,
        default: midIcon,
        hero_name: "",
        type: 3,
      },
      {
        label: i18n.t("v_adc"),
        icon: null,
        default: adcIcon,
        hero_name: "",
        type: 4,
      },
      {
        label: i18n.t("v_sup"),
        icon: null,
        default: supIcon,
        hero_name: "",
        type: 5,
      },
    ]);

    //红队选人
    const blueHeroPick: Ref<any[]> = ref([
      {
        label: i18n.t("v_sup"),
        icon: null,
        default: supIcon,
        hero_name: "",
        type: 5,
      },
      {
        label: i18n.t("v_adc"),
        icon: null,
        default: adcIcon,
        hero_name: "",
        type: 4,
      },
      {
        label: i18n.t("v_mid"),
        icon: null,
        default: midIcon,
        hero_name: "",
        type: 3,
      },
      {
        label: i18n.t("v_jug"),
        icon: null,
        default: jugIcon,
        hero_name: "",
        type: 2,
      },
      {
        label: i18n.t("v_top"),
        icon: null,
        default: topIcon,
        hero_name: "",
        type: 1,
      },
    ]);

    //红队赛果
    const redResult: Ref<any[]> = ref([
      {
        resultIcon: null,
        default: sbIcon,
        id: 1,
      },
      {
        resultIcon: null,
        default: dr5sIcon,
        id: 2,
      },
      {
        resultIcon: null,
        default: xlssIcon,
        id: 3,
      },
      {
        resultIcon: null,
        default: yxIcon,
        id: 4,
      },
      {
        resultIcon: null,
        default: xlysIcon,
        id: 5,
      },
    ]);

    //红队选人
    const blueResult: Ref<any[]> = ref([
      {
        resultIcon: null,
        default: xlysIcon,
        id: 5,
      },
      {
        resultIcon: null,
        default: yxIcon,
        id: 4,
      },
      {
        resultIcon: null,
        default: xlssIcon,
        id: 3,
      },
      {
        resultIcon: null,
        default: dr5sIcon,
        id: 2,
      },
      {
        resultIcon: null,
        default: sbIcon,
        id: 1,
      },
    ]);

    //是否显示时间
    const showTimer = computed(() => {
      return props.countdown < 28;
    });

    //是否显示倒计时
    const showCountdown = computed(() => {
      return props.countdown < 58 && props.countdown > 27;
    });
    //倒计时呼吸动画
    const countdownAnimate = computed(() => {
      return props.countdown < 37;
    });

    //比赛状态
    const matchStatus = computed(() => {
      const timeNode = [6, 16, 27, 57];
      const temp = timeNode.filter((num) => {
        return num < props.countdown;
      });
      const tempL = temp.length;
      switch (tempL) {
        case 0:
          return i18n.t("v_match_ends");
        case 1:
          return i18n.t("v_in_the_match");
        case 2:
          return i18n.t("v_match_preparing");
        case 3:
          return i18n.t("v_in_the_bet");
        case 4:
          return i18n.t("v_ready_to_bet");
      }
      return "";
    });

    //是否已经初始化选人
    let initPick = false;
    let initResult = false;

    watch(
      () => props.countdown,
      (newVal) => {
        //初始化红蓝队选人
        if (newVal > 26 && !initPick) {
          redHeroPick.value.forEach((hero) => {
            Object.assign(hero, {
              hero_name: "",
              icon: "",
            });
          });
          blueHeroPick.value.forEach((hero) => {
            Object.assign(hero, {
              hero_name: "",
              icon: "",
            });
          });
          initPick = true;
        }
        //初始化赛果
        if (newVal > 16 && !initResult) {
          redResult.value.forEach((hero) => {
            Object.assign(hero, {
              resultIcon: "",
            });
          });
          blueResult.value.forEach((hero) => {
            Object.assign(hero, {
              resultIcon: "",
            });
          });
          initPick = true;
        }
        if (newVal > 16) {
          gamingTime = 0;
          gameTime.value = "00:00:00";
          score.value = [0, 0];
        }
        if (
          props.teamHero &&
          props.teamHero.redTeam.length > 0 &&
          props.teamHero.blueTeam.length > 0
        ) {
          switch (newVal) {
            case 26:
              setHeroImg(1, 0);
              break;
            case 25:
              setHeroImg(1, 2);
              break;
            case 23:
              setHeroImg(3, 2);
              break;
            case 21:
              setHeroImg(3, 4);
              break;
            case 19:
              setHeroImg(5, 3);
              break;
            case 18:
              setHeroImg(5, 5);
              break;
            case 16:
              setGameTime(newVal - 6);
              proxy.mittBus.emit("playAudio", {
                name: "competitionAudio",
                time: 10,
              });
              break;
          }
        }
        if (newVal < 16) {
          initResult = false;
          setHeroImg(5, 5);
          if (!isGameStart && newVal > 6) {
            proxy.mittBus.emit("playAudio", {
              name: "competitionAudio",
              time: newVal - 6,
            });
            setGameTime(newVal - 6);
          }
        }
        if (newVal < 7) {
          clearInterval(isGameStart);
          isGameStart = null;
          gameTime.value = parseGameTime(props.scoreInfo.gameTime);
          score.value = [props.scoreInfo.score1, props.scoreInfo.score2];
        }

        if (props.playResult.length > 0 && newVal < 16) {
          setResult(17 - newVal);
        }
        if (newVal < 2) {
          initPick = false;
        }
      }
    );

    const playtypeIdOfImgName = ["sb_", "yx_", "xlss_", "xlys_", "dr5s_"];
    const xlType = ["shui_", "huo_", "tu_", "feng_"];

    // 设置赛果展示
    function setResult(timeL: number) {
      props.playResult.forEach((result: any) => {
        if (result.show_time <= timeL) {
          if (result.playtype_id != 4) {
            redResult.value.forEach((res: any) => {
              if (res.id == result.playtype_id && !res.resultIcon) {
                if (result.playtype_id == 5 && result.team_type == 1) {
                  proxy.mittBus.emit("playAudio", { name: "pentakillAudio" });
                }
                if (result.playtype_id != 5 && result.team_type == 1) {
                  proxy.mittBus.emit("playAudio", { name: "startGameAudio" });
                }

                res.resultIcon = getImg(
                  "icon",
                  playtypeIdOfImgName[Number(result.playtype_id) - 1],
                  result.team_type == 1
                );
              }
            });
            blueResult.value.forEach((res: any) => {
              if (res.id == result.playtype_id && !res.resultIcon) {
                if (result.playtype_id == 5 && result.team_type == 2) {
                  proxy.mittBus.emit("playAudio", { name: "pentakillAudio" });
                }
                if (result.playtype_id != 5 && result.team_type == 2) {
                  proxy.mittBus.emit("playAudio", { name: "startGameAudio" });
                }
                res.resultIcon = getImg(
                  "icon",
                  playtypeIdOfImgName[Number(result.playtype_id) - 1],
                  result.team_type == 2
                );
              }
            });
          }
          if (result.playtype_id == 4) {
            redResult.value.forEach((res: any) => {
              if (res.id == result.playtype_id && !res.resultIcon) {
                proxy.mittBus.emit("playAudio", { name: "startGameAudio" });
                res.resultIcon = getImg(
                  "icon",
                  playtypeIdOfImgName[Number(result.playtype_id) - 1] +
                    xlType[Number(result.team_type) - 1],
                  true
                );
              }
            });
            blueResult.value.forEach((res: any) => {
              if (res.id == result.playtype_id && !res.resultIcon) {
                res.resultIcon = getImg(
                  "icon",
                  playtypeIdOfImgName[Number(result.playtype_id) - 1] +
                    xlType[Number(result.team_type) - 1],
                  true
                );
              }
            });
          }
        }
      });
    }

    //设置选英雄的动画
    function setHeroImg(value1: number, value2: number) {
      props.teamHero.redTeam.forEach((hero1: any, index: number) => {
        if (index < value1) {
          redHeroPick.value.forEach((hero) => {
            if (hero1.type == hero.type) {
              Object.assign(hero, hero1);
            }
          });
        }
      });
      props.teamHero.blueTeam.forEach((hero1: any, index: number) => {
        if (index < value2) {
          blueHeroPick.value.forEach((hero) => {
            if (hero1.type == hero.type) {
              Object.assign(hero, hero1);
            }
          });
        }
      });
    }

    //游戏时间倒计时是否开始
    let isGameStart: any = null;
    let gamingTime = 0;
    let gameScore: number[] = [];
    //比分score
    const score = ref([0, 0]);

    //游戏时间
    const gameTime = ref("00:00:00");

    function setGameTime(timerL: number) {
      const score1Speed = props.scoreInfo.score1 / 10;
      const score2Speed = props.scoreInfo.score2 / 10;
      gameScore = [
        Math.floor(score1Speed * (10 - timerL > 0 ? 10 - timerL : 0)),
        Math.floor(score2Speed * (10 - timerL > 0 ? 10 - timerL : 0)),
      ];
      gamingTime =
        (props.scoreInfo.gameTime * (10 - timerL > 0 ? 10 - timerL : 0)) / 10;
      isGameStart = setInterval(() => {
        if (gamingTime < props.scoreInfo.gameTime) {
          gamingTime++;
          gameTime.value = parseGameTime(gamingTime);
        }
        if (gameScore[0] < props.scoreInfo.score1) {
          gameScore[0] += (score1Speed * 10) / props.scoreInfo.gameTime;
        }
        if (gameScore[1] < props.scoreInfo.score2) {
          gameScore[1] += (score2Speed * 10) / props.scoreInfo.gameTime;
        }
        score.value = [Math.floor(gameScore[0]), Math.floor(gameScore[1])];
      }, props.scoreInfo.gameTime / 1200);
    }

    //格式化游戏时间
    function parseGameTime(value: number) {
      const H = String(Math.floor(value / 3600)).padStart(2, "0");
      const I = String(Math.floor((value % 3600) / 60)).padStart(2, "0");
      const S = String(Math.floor(value % 60)).padStart(2, "0");
      return `${H}:${I}:${S}`;
    }

    onUnmounted(() => {
      clearInterval(isGameStart);
      isGameStart = null;
    });

    return {
      errImg,
      blueLogo,
      redLogo,
      vsImg,
      redHeroPick,
      blueHeroPick,
      redResult,
      blueResult,
      showTimer,
      showCountdown,
      countdownAnimate,
      matchStatus,
      score,
      gameTime,
    };
  },
});
</script>

<style lang="scss" scoped>
@media screen and (max-width: 1199px) {
  .virtual-title {
    --px_100: 1200px/19;
  }
}
@media only screen and (min-width: 1200px) and (max-width: 1600px) {
  .virtual-title {
    --px_100: 100vw/19;
  }
}

@media screen and (min-width: 1601px) {
  .virtual-title {
    --px_100: 1600px/19;
  }
}

.virtual-title {
  width: 100%;
  height: calc(1.6 * var(--px_100));
  flex-shrink: 0;
  background-image: url("../../../../assets/virtual/bg/headerBg.jpg");
  background-size: 100% 100%;
  position: relative;
  z-index: 100;
  &::after {
    content: "";
    position: absolute;
    height: 100%;
    width: 100%;
    background-color: #151f2800;
    z-index: 1;
    top: 0;
  }

  .title-top {
    height: calc(1 * var(--px_100));
    max-width: 1600px;
    display: flex;
    justify-content: center;
    margin: auto;
    & > div {
      flex-shrink: 0;
      height: 100%;
      display: flex;
      align-items: center;
    }

    .team-pick {
      & > div {
        height: calc(0.7 * var(--px_100));
        width: calc(1 * var(--px_100));
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        // margin: calc(0.1 * var(--px_100));
        .hero-avatar {
          flex-shrink: 0;
          position: relative;
          height: calc(0.55 * var(--px_100));
          width: calc(0.55 * var(--px_100));
          border-radius: calc(0.1 * var(--px_100));
          &:deep(.el-avatar) {
            height: calc(0.55 * var(--px_100));
            width: calc(0.55 * var(--px_100));
            & > img {
              height: calc(0.55 * var(--px_100));
              width: calc(0.55 * var(--px_100));
            }
          }
          .hero-label {
            position: absolute;
            height: 35%;
            width: 100%;
            background-color: #151f2880;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #d98c4c;
            font-weight: 400;
            font-size: calc(0.12 * var(--px_100));
            bottom: 0;
            border-bottom-left-radius: calc(0.1 * var(--px_100));
            border-bottom-right-radius: calc(0.1 * var(--px_100));
          }
        }
        .hero-name {
          width: 100%;
          text-align: center;
          overflow: hidden;
        }
      }
    }
    .match-team {
      width: 28%;
      justify-content: space-between;
      .match-score {
        font-weight: 500;
        font-size: calc(0.48 * var(--px_100));
        color: #f5faff;
        span {
          margin: 0 calc(0.1 * var(--px_100));
        }
      }
      &:deep(.el-avatar) {
        width: calc(1.2 * var(--px_100)) !important;
        height: calc(1.2 * var(--px_100)) !important;
        display: flex;
        align-items: center;
        justify-content: center;
        & > img {
          width: calc(1.2 * var(--px_100)) !important;
          height: calc(1.2 * var(--px_100)) !important;
        }
      }
    }
  }
  .title-footer {
    height: calc(0.5 * var(--px_100));
    width: 100%;
    display: flex;
    justify-content: center;
    .result {
      display: flex;
      justify-content: space-between;
      width: calc(3 * var(--px_100));
      div {
        width: calc(0.5 * var(--px_100));
        height: calc(0.5 * var(--px_100));
        &:deep(.el-avatar) {
          height: 100%;
          width: 100%;
          & > img {
            height: 100%;
            width: 100%;
          }
        }
      }
    }
    .time-info {
      width: 20%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      color: #a8b9d5;
      font-size: calc(0.16 * var(--px_100));
      font-weight: 800;

      .match-time {
        font-size: calc(0.2 * var(--px_100));
        font-weight: 500;
      }
      .countdown-time {
        height: 50%;
        color: #dfb34f;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: calc(0.3 * var(--px_100));
        .countdown-time-animation {
          animation: scaleDraw 1s ease-in-out infinite;
          -webkit-animation: scaleDraw 1s ease-in-out infinite;
        }
      }
    }
  }

  @keyframes scaleDraw {
    0% {
      transform: scale(1);
    }

    50% {
      transform: scale(1.5);
    }

    100% {
      transform: scale(1);
    }
  }

  @-webkit-keyframes scaleDraw {
    0% {
      transform: scale(1);
    }

    50% {
      transform: scale(1.5);
    }

    100% {
      transform: scale(1);
    }
  }
}
</style>
