<!--suppress JSUnresolvedVariable, CssInvalidPropertyValue -->
<template>
  <div class="virtual-body">
    <el-scrollbar>
      <div class="body-main">
        <div class="bet-box">
          <div v-for="(info, index) in Object.keys(betOddInfoList)" :key="info">
            <div v-if="[0, 2, 4].includes(index)" class="handicap-name">
              <div class="line"></div>
              <div class="name">
                {{
                  index === 0
                    ? $t("basicMarket")
                    : index === 2
                    ? $t("sideMarket")
                    : $t("highOddsMarket")
                }}
              </div>
              <div class="line"></div>
            </div>
            <div class="bet-box-item">
              <div
                class="bet-item"
                v-for="(betInfo, idx) in betOddInfoList[info]"
                :class="idx % 2 ? 'bet-item-blue' : 'bet-item-red'"
                :key="betInfo.id"
              >
                <div v-if="idx === 0" class="bet-play-name">
                  <div>{{ betInfo.play_name }}</div>
                </div>
                <div class="bet-statistics">
                  <div class="statistics-all">
                    <span>{{ $t("v_total_bet") }}</span
                    ><span>{{ betInfo.total_amount }}</span>
                  </div>
                  <div class="statistics-self">
                    <span>{{ $t("v_my_bet") }}</span
                    ><span
                      :style="{
                        color: betInfo.total_amount_user > 0 ? '#DFB34F' : '',
                        'font-weight':
                          betInfo.total_amount_user > 0 ? 600 : 400,
                      }"
                    >
                      <!-- {{ betInfo.total_amount_user }} -->
                      <countTo
                        :startVal="
                          Number(betInfo.total_amount_user) - currentChip > 0
                            ? Number(betInfo.total_amount_user) - currentChip
                            : 0
                        "
                        :endVal="Number(betInfo.total_amount_user)"
                        :duration="1000"
                      />
                    </span>
                  </div>
                </div>
                <div
                  class="bet-btn normal-bet"
                  :class="setBetStatus(betInfo)"
                  :style="{
                    '--translate': idx % 2 ? '180deg' : '0deg',
                    '--right': idx % 2 ? 0 : '',
                    '--left': idx % 2 ? '' : 0,
                  }"
                  @click="toBet(betInfo)"
                >
                  <span>{{ betInfo.team_name }}</span
                  ><span style="color: #f5faff">{{ betInfo.point }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import countTo from "@/components/VueCountTo/index.vue";
export default defineComponent({
  name: "virtual-body",
  props: {
    playResult: {
      type: Array,
      default: () => {
        return [];
      },
    },
    countdown: {
      type: Number,
      default: 0,
    },
    betOddInfo: {
      type: Array,
      default: () => {
        return [];
      },
    },
    currentChip: {
      type: Number,
      default: 10,
    },
  },
  components: { countTo },
  emits: ["toBet"],
  setup(props, { emit }) {
    const betOddInfoList = computed(() => {
      let temp: any = {};
      for (const info of props.betOddInfo) {
        const keys = Object.keys(temp);
        if (keys.includes(String((info as any).playtype_id))) {
          temp[String((info as any).playtype_id)].push(info);
        } else {
          temp[String((info as any).playtype_id)] = [];
          temp[String((info as any).playtype_id)].push(info);
        }
      }
      return temp;
    });

    //是否可以投注
    const isBetAllow = computed(() => {
      return props.countdown > 27 && props.countdown < 57;
    });

    // 动态设置投注框的样式
    function setBetStatus(betInfo: any) {
      if (isBetAllow.value) {
        return "normal-bet normal-bet__can";
      } else {
        let tag = false;
        props.playResult.forEach((info: any) => {
          if (
            betInfo.playtype_id == info.playtype_id &&
            betInfo.team_type == info.team_type &&
            18 - props.countdown > info.show_time
          ) {
            tag = true;
          }
        });
        return tag ? "bet-active" : "normal-bet normal-bet__disabled";
      }
    }
    //投注
    function toBet(betInfo: any) {
      if (!isBetAllow.value) {
        return;
      }

      emit("toBet", betInfo);
    }

    return { betOddInfoList, setBetStatus, toBet };
  },
});
</script>

<style lang="scss" scoped>
@media screen and (max-width: 1199px) {
  .virtual-body {
    --px_100: 1200px/19;
  }
}
@media only screen and (min-width: 1200px) and (max-width: 1600px) {
  .virtual-body {
    --px_100: 100vw/19;
  }
}

@media screen and (min-width: 1601px) {
  .virtual-body {
    --px_100: 1600px/19;
  }
}
.virtual-body {
  flex-grow: 1;
  overflow: hidden;
  background-image: url("../../../../assets/virtual/bg/bet-box-bg.png");
  background-repeat: no-repeat;
  background-size: cover;
  .body-main {
    width: 100%;
    display: flex;
    justify-content: center;
    padding: calc(0.2 * var(--px_100)) 0;

    .bet-box {
      width: calc(15 * var(--px_100));
      background-color: #0d151d90;
      backdrop-filter: blur(40px);
      border-radius: calc(0.1 * var(--px_100));
      padding: calc(0.2 * var(--px_100)) 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      .handicap-name {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: calc(0.1 * var(--px_100)) 0;
        .line {
          height: calc(0.02 * var(--px_100));
          // width: calc(5 * var(--px_100));
          flex-grow: 1;
          background: #2d3f5090;
        }
        .name {
          // width: calc(1.5 * var(--px_100));
          text-align: center;
          color: #7b8595;
          font-size: calc(0.2 * var(--px_100));
          font-weight: 400;
          padding: 0 calc(0.2 * var(--px_100));
        }
      }
      .bet-box-item {
        width: calc(14.5 * var(--px_100));
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        position: relative;
        .bet-item {
          height: calc(0.8 * var(--px_100));
          width: calc(6.2 * var(--px_100));
          margin: calc(0.07 * var(--px_100)) 0;
          border-radius: calc(0.05 * var(--px_100));
          padding: 0 calc(0.2 * var(--px_100));
          display: flex;
          justify-content: space-between;
          align-items: center;
          .bet-play-name {
            position: absolute;
            width: calc(1.9 * var(--px_100));
            left: calc(6.3 * var(--px_100));
            display: flex;
            justify-content: center;
            align-items: center;
            color: #a8b9d5;
            font-size: calc(0.19 * var(--px_100));
            & > div {
              height: 100%;
              text-align: center;
              white-space: pre-wrap !important;
            }
          }
          .bet-statistics {
            height: calc(0.5 * var(--px_100));
            width: calc(2.4 * var(--px_100));
            font-size: calc(0.18 * var(--px_100));
            z-index: 5;
            & > div {
              display: flex;
              justify-content: space-between;
            }
            .statistics-all {
              color: #7b8595;
            }
            .statistics-self {
              margin-top: calc(0.04 * var(--px_100));
              color: #728ca4;
            }
          }
          .bet-btn {
            height: calc(0.48 * var(--px_100));
            width: calc(3.2 * var(--px_100));
            border-radius: calc(0.05 * var(--px_100));
            font-size: calc(0.2 * var(--px_100));
            font-weight: 500;
            padding: 0 calc(0.2 * var(--px_100));
            display: flex;
            align-items: center;
            position: relative;
            justify-content: space-between;
            z-index: 5;
          }
          .normal-bet {
            border: calc(0.01 * var(--px_100)) #728ca4 solid;
            background-color: #233749;
            color: #a8b9d5;
            position: relative;
            &::before {
              position: absolute;
              content: "";
              height: calc(0.48 * var(--px_100));
              width: calc(1.4 * var(--px_100));
              background-image: url("../../../../assets/virtual/bg/normal-small.png");
              background-size: 100% 100%;
              transform: rotateY(var(--translate));
              -webkit-transform: rotateY(var(--translate));
              left: var(--left);
              right: var(--right);
            }
            &::after {
              position: absolute;
              content: "";
              height: calc(0.48 * var(--px_100));
              width: calc(1.8 * var(--px_100));
              background-image: url("../../../../assets/virtual/bg/normal-big.png");
              background-size: 100% 100%;
              transform: rotateY(var(--translate));
              -webkit-transform: rotateY(var(--translate));
              left: var(--left);
              right: var(--right);
            }

            &__can {
              cursor: url("~@/assets/icons/home_mouse.png"), auto;
              &:hover {
                border: calc(0.01 * var(--px_100)) #f5faff solid;
                color: #f5faff;
                background-color: #426688;
              }
              &:active {
                color: #f5faff;
                background: linear-gradient(
                  180deg,
                  #f5c24c -11.11%,
                  #da9804 115.74%
                );
                &::before {
                  position: absolute;
                  content: "";
                  height: calc(0.48 * var(--px_100));
                  width: calc(1.4 * var(--px_100));
                  background-image: url("../../../../assets/virtual/bg/active-small.png");
                  background-size: 100% 100%;
                  transform: rotateY(var(--translate));
                  -webkit-transform: rotateY(var(--translate));
                  left: var(--left);
                  right: var(--right);
                }
                &::after {
                  position: absolute;
                  content: "";
                  height: calc(0.48 * var(--px_100));
                  width: calc(1.8 * var(--px_100));
                  background-image: url("../../../../assets/virtual/bg/active-big.png");
                  background-size: 100% 100%;
                  transform: rotateY(var(--translate));
                  -webkit-transform: rotateY(var(--translate));
                  left: var(--left);
                  right: var(--right);
                }
              }
            }
            &__disabled {
              cursor: not-allowed;
            }
          }
          .bet-active {
            cursor: not-allowed;
            border: calc(0.01 * var(--px_100)) #f5faff solid;
            color: #f5faff;
            background: linear-gradient(
              180deg,
              #f5c24c -11.11%,
              #da9804 115.74%
            );
            &::before {
              position: absolute;
              content: "";
              height: calc(0.48 * var(--px_100));
              width: calc(1.4 * var(--px_100));
              background-image: url("../../../../assets/virtual/bg/active-small.png");
              background-size: 100% 100%;
              transform: rotateY(var(--translate));
              -webkit-transform: rotateY(var(--translate));
              left: var(--left);
              right: var(--right);
            }
            &::after {
              position: absolute;
              content: "";
              height: calc(0.48 * var(--px_100));
              width: calc(1.8 * var(--px_100));
              background-image: url("../../../../assets/virtual/bg/active-big.png");
              background-size: 100% 100%;
              transform: rotateY(var(--translate));
              -webkit-transform: rotateY(var(--translate));
              left: var(--left);
              right: var(--right);
            }
          }
        }
        .bet-item-red {
          background-color: linear-gradient(
            270deg,
            rgba(140, 73, 73, 0.21) 0%,
            rgba(255, 255, 255, 0.05) 100%
          );
          background-image: url("../../../../assets/virtual/bg/red-bet-bg.png");
          background-size: 100% 100%;
          position: relative;
          &::before {
            position: absolute;
            content: "";
            height: calc(0.8 * var(--px_100));
            width: calc(3 * var(--px_100));
            background-image: url("../../../../assets/virtual/bg/red-bet-bg-hero.png");
            background-size: 100% 100%;
            left: 3%;
            opacity: 0.1;
          }
        }
        .bet-item-blue {
          flex-direction: row-reverse;
          background-color: linear-gradient(
            270deg,
            rgba(255, 255, 255, 0.05) 0%,
            rgba(93, 108, 236, 0.21) 100%
          );
          background-image: url("../../../../assets/virtual/bg/blue-bet-bg.png");
          background-size: 100% 100%;
          position: relative;
          &::before {
            position: absolute;
            content: "";
            height: calc(0.8 * var(--px_100));
            width: calc(3 * var(--px_100));
            background-image: url("../../../../assets/virtual/bg/blue-bet-bg-hero.png");
            background-size: 100% 100%;
            right: 3%;
            opacity: 0.1;
          }
        }
      }
    }
  }
}
</style>
