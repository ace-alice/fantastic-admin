// 虚拟盘
<template>
  <div class="virtual-container">
    <Popups :userWinInfo="UserWinInfo" />
    <!--    <GlobalLoading ref="globalLoading" />-->
    <div class="virtual-order">
      <span>{{ $t("v_round_ID") }}:</span>
      <span v-if="currentOrder">{{ currentOrder["order_no"] }}</span>
    </div>
    <TitleBox
      :countdown="countdown"
      :teamHero="teamHero"
      :scoreInfo="score"
      :playResult="playResult"
    />
    <BodyBox
      :playResult="playResult"
      :betOddInfo="betOddInfo"
      :countdown="countdown"
      :currentChip="currentChip"
      @toBet="toBet"
    />
    <FooterBox
      :userLimit="userLimit"
      @setChipSize="setChipSize"
      :currentChip="currentChip"
      :userWinInfo="UserWinInfo"
    />
  </div>
</template>
<script lang="ts">
import {
  computed,
  defineComponent,
  getCurrentInstance,
  nextTick,
  onMounted,
  onUnmounted,
  reactive,
  Ref,
  ref,
  watch,
} from "vue";
// import GlobalLoading from "@/components/GlobalLoading/index.vue";
import TitleBox from "./components/Title/index.vue";
import BodyBox from "./components/Body/index.vue";
import FooterBox from "./components/Footer/index.vue";
import Popups from "./components/Popups/index.vue";
import {
  getResults,
  getUserMoneyLimit,
  getUserWin,
  getVirtualInfo,
  toBetPlayMore,
} from "@/api/virtual";
import { userInfoStore } from "@/store/userInfo";
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "VirtualIndex",
  components: { TitleBox, BodyBox, FooterBox, Popups },
  setup() {
    const { proxy } = getCurrentInstance() as any;
    const { doGetUserInfo } = userInfoStore();
    const i18n = useI18n();

    /**
     * 时间节点
     * 57 准备下注动画
     * 27 投注阶段计时
     * 26 投注结束停顿
     * 24 开始比赛动画
     * 16 英雄选择动画
     * 6 比赛阶段计时
     * 5 比赛结束停顿
     * 2 结算弹窗
     * 0 结算加钱
     */

    function initCountdown() {
      clearInterval(timer);
      timer = null;
      Object.assign(reqStatus, {
        isInfo: false,
        isResult: false,
        isUserWin: false,
      });
    }

    const countdown = ref(0);

    watch(
      () => countdown.value,
      async (newVal) => {
        const requestTime = [55, 50, 45, 40, 35, 30, 26];
        if (requestTime.includes(newVal)) {
          const resData: any = await getVirtualInfoFun();
          if (resData) {
            Object.assign(currentOrder.value, resData);
          }
        }
        switch (newVal) {
          case 58:
            proxy.mittBus.emit("openAlert", { name: "startBet" });
            proxy.mittBus.emit("playAudio", { name: "transitionsAudio" });
            break;
          case 27:
            proxy.mittBus.emit("openAlert", { name: "gameStart" });
            proxy.mittBus.emit("playAudio", { name: "startGameAudio" });
            break;
          case 16:
            getUserWinFun().then(() => null);
            break;
          case 5:
            proxy.mittBus.emit("openAlert", {
              name: UserWinInfo.status == 1 ? "gameWin" : "gameFail",
              time: 3,
            });
            proxy.mittBus.emit("playAudio", { name: "winOrLose" });
            break;
          case 3:
            if (UserWinInfo.status == 1) {
              proxy.mittBus.emit("addMoney");
              proxy.mittBus.emit("playAudio", { name: "winMoney" });
              doGetUserInfo();
            }
            break;
          case 2:
            doGetUserInfo();
            break;
        }
      }
    );

    let timer: any = null;

    function startCountdown(value: number) {
      initCountdown();
      countdown.value = value;
      timer = setInterval(async () => {
        countdown.value--;
        if (countdown.value < 1) {
          const resData: any = await getVirtualInfoFun();
          currentOrder.value = resData;
          if (resData) {
            startCountdown(resData.countdown_time);
          }
        }
        if (countdown.value < 26 && !reqStatus.isResult) {
          const result = await getResultsFun();
          if (result) {
            Object.assign(currentOrder.value, result);
          }
        }
      }, 1000);
    }

    //是否已经获取VirtualInfo，Results，UserWin
    let reqStatus = reactive({
      isInfo: false,
      isResult: false,
      isUserWin: false,
    });

    //当前局信息
    let currentOrder: Ref = ref(null);

    // 投注信息
    const betOddInfo = computed(() => {
      if (currentOrder.value && currentOrder.value.points_extra) {
        return currentOrder.value.points_extra;
      } else {
        return [];
      }
    });

    //比分与比赛时间
    const score = computed(() => {
      if (
        currentOrder.value &&
        currentOrder.value.info &&
        currentOrder.value.info.score_1 &&
        currentOrder.value.info.score_2 &&
        currentOrder.value.info.game_time
      ) {
        return {
          score1: currentOrder.value.info.score_1,
          score2: currentOrder.value.info.score_2,
          gameTime: currentOrder.value.info.game_time,
        };
      } else {
        return { score1: 0, score2: 0, gameTime: 0 };
      }
    });

    //赛果
    const playResult = computed(() => {
      if (
        currentOrder.value &&
        currentOrder.value.list &&
        currentOrder.value.list.length > 0
      ) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        return currentOrder.value.list.sort((a: any, b: any) => {
          return a.show_time - b.show_time;
        });
      } else {
        return [];
      }
    });

    // 投注信息
    const teamHero = computed(() => {
      if (
        currentOrder.value &&
        currentOrder.value.team_hero_1 &&
        currentOrder.value.team_hero_2
      ) {
        return {
          redTeam: currentOrder.value.team_hero_1,
          blueTeam: currentOrder.value.team_hero_2,
        };
      } else {
        return { redTeam: [], blueTeam: [] };
      }
    });

    //初始化比赛数据（倒计时）
    function getVirtualInfoFun() {
      return new Promise((resolve) => {
        getVirtualInfo()
          .then((res: any) => {
            reqStatus.isInfo = true;
            if (+res.data.status === 1) {
              resolve(res.data.data);
            } else {
              resolve(false);
            }
          })
          .catch(() => {
            resolve(false);
          });
      });
    }

    //获取比赛的开奖信息
    function getResultsFun() {
      return new Promise((resolve) => {
        getResults({ game_id: currentOrder.value?.id })
          .then((res: any) => {
            reqStatus.isResult = true;
            if (+res.data.status === 1) {
              resolve(res.data.data);
            } else {
              resolve(false);
            }
          })
          .catch(() => {
            resolve(false);
          });
      });
    }

    let UserWinInfo = reactive({
      status: 0,
      send_money: "00.00",
    });
    //获取比赛的中奖信息
    function getUserWinFun() {
      return new Promise((resolve) => {
        getUserWin({ game_id: currentOrder.value?.id })
          .then((res: any) => {
            reqStatus.isUserWin = true;
            if (+res.data.status === 1) {
              UserWinInfo = Object.assign(UserWinInfo, res.data.data);
              resolve(res.data.data);
            } else {
              resolve(false);
            }
          })
          .catch(() => {
            resolve(false);
          });
      });
    }

    const userLimit = reactive({
      amount_1: "10",
      amount_2: "20",
      amount_3: "50",
      amount_4: "100",
      amount_5: "200",
      amount_6: "500",
      max_amount: "0",
      min_amount: "0",
    });
    //获取用户限红
    function getUserMoneyLimitFun() {
      return new Promise((resolve) => {
        getUserMoneyLimit()
          .then((res: any) => {
            if (+res.data.status === 1) {
              Object.assign(userLimit, res.data.data);
              setChipSize(Number(userLimit.amount_1));
              resolve(res.data.data);
            } else {
              resolve(false);
            }
          })
          .catch(() => {
            resolve(false);
          });
      });
    }

    //投注
    function toBet(betInfo: any) {
      if (
        Number(betInfo.total_amount_user) + currentChip.value >
        Number(userLimit.max_amount)
      ) {
        ElMessage({
          type: "error",
          message: i18n.t("v_bet_limit"),
          customClass: "virtual-fail-bet",
        });
        return;
      }
      let params = {
        game_id: currentOrder.value.id,
        point_id: betInfo.id,
        amount: currentChip.value,
        money_type: 1,
      };

      toBetPlayMore(params)
        .then(async (res: any) => {
          if (+res.data.status === 1) {
            doGetUserInfo();
            const resData: any = await getVirtualInfoFun();
            if (resData) {
              proxy.mittBus.emit("playAudio", { name: "toBetAudio" });
              ElMessage({
                type: "success",
                message: i18n.t("bet_success"),
                customClass: "virtual-success-bet",
              });
              Object.assign(currentOrder.value, resData);
            }
          } else {
            ElMessage({
              type: "error",
              message: i18n.t("bet_failed"),
              customClass: "virtual-fail-bet",
            });
          }
        })
        .catch((err: any) => {
          ElMessage({
            type: "error",
            message: err,
            customClass: "virtual-fail-bet",
          });
        });
    }

    onMounted(async () => {
      doGetUserInfo();
      getUserMoneyLimitFun().then(() => null);
      proxy.mittBus.on("initAudio", (value: boolean) => {
        if (countdown.value > 6 && countdown.value < 16) {
          if (value) {
            proxy.mittBus.emit("playAudio", {
              name: "competitionAudio",
              time: countdown.value - 6,
            });
          } else {
            proxy.mittBus.emit("playAudio", {
              name: "competitionAudio",
              time: -1,
            });
          }
        }
      });
      nextTick(() => {
        // proxy.$refs["globalLoading"].loading();
      });
      const resData: any = await getVirtualInfoFun();
      if (resData) {
        currentOrder.value = resData;
        if (currentOrder.value.countdown_time < 26) {
          const result = await getResultsFun();
          if (result) {
            Object.assign(currentOrder.value, result);
          }
        }
        if (currentOrder.value.countdown_time < 16) {
          getUserWinFun().then(() => null);
        }

        startCountdown(resData.countdown_time);
        // proxy.$refs["globalLoading"].done();
      }
    });

    //当前筹码
    const currentChip = ref(10);

    //设置当前凑码
    function setChipSize(value: number) {
      currentChip.value = value;
    }

    onUnmounted(() => {
      initCountdown();
      proxy.mittBus.off("initAudio");
    });

    return {
      countdown,
      currentOrder,
      betOddInfo,
      teamHero,
      score,
      playResult,
      userLimit,
      currentChip,
      setChipSize,
      toBet,
      UserWinInfo,
    };
  },
});
</script>

<style lang="scss" scoped>
@media screen and (max-width: 1199px) {
  .virtual-container {
    --px_100: 1200px/19;
  }
}
@media screen and (min-width: 1201px) {
  .virtual-container {
    --px_100: 100vw/19;
  }
}
@media screen and (max-width: 1600px) {
  .virtual-container {
    --px_100: 1600px/19;
  }
}
.virtual-container {
  // max-width: 1920px;
  min-width: 1200px;
  height: 100vh;
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-items: center;
  justify-content: center;
  position: relative;

  .virtual-order {
    flex-shrink: 0;
    height: calc(0.3 * var(--px_100));
    display: flex;
    align-items: center;
    color: #a8b9d5;
    font-size: calc(0.13 * var(--px_100));
    background-color: #151f28;
    position: relative;
    &::after {
      content: "";
      position: absolute;
      height: 100%;
      width: 100%;
      background-color: #151f2800;
      z-index: 1;
      top: 0;
    }
    span {
      &:nth-child(1) {
        margin: 0 calc(0.2 * var(--px_100));
      }
    }
  }
}
</style>
<style lang="scss">
.virtual-success-bet {
  border-radius: 4px;
  background: rgba(67, 85, 103, 0.8);
  border: 2px solid #2eb14d;
  box-sizing: border-box;
  backdrop-filter: blur(20px);
  padding: 20px 200px;
  color: #f5faff !important;
  .el-message__content {
    color: #f5faff !important;
  }
}

.virtual-fail-bet {
  border-radius: 4px;
  background: rgba(67, 85, 103, 0.8);
  border: 2px solid #f31f1f;
  box-sizing: border-box;
  backdrop-filter: blur(20px);
  padding: 20px 200px;
  color: #f5faff !important;
  .el-message__content {
    color: #f5faff !important;
  }
}
</style>
