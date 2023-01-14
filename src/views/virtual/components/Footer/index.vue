<template>
  <div class="virtual-footer">
    <div class="footer-balance">
      <div class="footer-balance-amount">
        <span>{{ $t("v_balance") }}</span>
        <span>
          <countTo
            :startVal="Number(startVal)"
            :endVal="Number(balance['amount'])"
            :duration="1000"
          />
          <transition
            :duration="{ enter: 500, leave: 500 }"
            name="custom-classes-transition"
            enter-active-class="animate__animated animate__fadeInUp"
            leave-active-class="animate__animated animate__fadeOutUp"
            mode="out-in"
          >
            <div v-show="addMoney" class="add-money" key="addMoney">
              <div class="notice">+{{ userWinInfo.send_money }}</div>
            </div>
          </transition>
        </span>
      </div>
      <div class="footer-balance-limit">
        <span>{{ $t("v_bet_limit") }}</span
        ><span>{{ userLimit.min_amount }}-{{ userLimit.max_amount }}</span>
      </div>
    </div>
    <div class="footer-chips">
      <div class="chips-item" v-for="(kk, index) in chipsList" :key="kk">
        <div
          class="chips-item-box"
          :class="{ active: kk === currentChip, disable: !ChipStatus }"
          :style="background(index)"
          @click="setChipSize(kk)"
        >
          {{ showChipStyle(kk) }}
        </div>
      </div>
    </div>
    <div class="footer-tools">
      <TrendBox />
      <HistoryBox />
      <RulesBox />
      <div
        class="tools-item"
        @click="toHome"
        v-tooltip="{ width: 10, message: $t('v_exit') }"
      >
        {{ $t("v_exit") }}
      </div>
      <audioBox />
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  getCurrentInstance,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from "vue";
import { useRouter } from "vue-router";
import { userInfoStore } from "@/store/userInfo";
import RulesBox from "./components/RulesBox.vue";
import HistoryBox from "./components/HistoryBox.vue";
import TrendBox from "./components/TrendBox.vue";
import audioBox from "./components/AudioBox.vue";
import countTo from "@/components/VueCountTo/index.vue";
import { storeToRefs } from "pinia";

export default defineComponent({
  name: "virtualFooter",
  props: {
    userLimit: {
      type: Object,
      default: () => {
        return {};
      },
    },
    currentChip: {
      type: Number,
      default: 10,
    },
    userWinInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  components: {
    RulesBox,
    HistoryBox,
    TrendBox,
    audioBox,
    countTo,
  },
  emits: ["setChipSize"],
  setup(props, { emit }) {
    const { balanceInfo } = storeToRefs(userInfoStore());
    const router = useRouter();
    const { proxy } = getCurrentInstance() as any;
    const balance = computed(() => {
      return balanceInfo.value || {};
    });

    const startVal = ref(0);

    watch(
      () => balance.value.amount,
      (newVal, oldVal) => {
        if (oldVal) {
          startVal.value = +oldVal;
        }
      }
    );

    //筹码列表
    const chipsList = computed(() => {
      const temp = Object.keys(props.userLimit).filter((key) => {
        return key.indexOf("amount_") != -1;
      });
      let result = [];
      for (const key of temp) {
        result.push(Number(props.userLimit[key]));
      }
      return result;
    });

    function setChipSize(value: number) {
      if (!ChipStatus.value) return;
      emit("setChipSize", value);
    }

    const chipColors = [
      "#3E76B4",
      "#39C799",
      "#AC8A27",
      "#BA7634",
      "#A8539B",
      "#AC4749",
    ];
    //筹码的背景图
    function background(index: number) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const bg = new URL(`@/assets/virtual/bg/price_active_${index}.png` ,import.meta.url).href;
        return {
          backgroundImage: `url(${bg})`,
          color: chipColors[index],
        };
      } catch {
        return "none";
      }
    }

    //筹码状态
    const ChipStatus = computed(() => {
      return true;
    });

    function showChipStyle(value: number) {
      if (value >= 1000000) {
        return Math.floor(value / 1000000) + "M";
      } else if (value >= 1000) {
        return Math.floor(value / 1000) + "K";
      } else {
        return value;
      }
    }
    // 退出
    function toHome() {
      router.push({ name: "MatchList" });
    }

    //加钱动画
    const addMoney = ref(false);

    onMounted(() => {
      proxy.mittBus.on("addMoney", () => {
        addMoney.value = true;
        setTimeout(() => {
          addMoney.value = false;
        }, 1000);
      });
    });

    onUnmounted(() => {
      proxy.mittBus.off("addMoney");
    });
    return {
      balance,
      chipsList,
      setChipSize,
      background,
      ChipStatus,
      showChipStyle,
      toHome,
      addMoney,
      startVal,
    };
  },
});
</script>

<!--suppress CssInvalidPropertyValue, CssInvalidFunction -->
<style lang="scss" scoped>
@media screen and (max-width: 1199px) {
  .virtual-footer {
    --px_100: 1200px/19;
  }
}
@media only screen and (min-width: 1200px) and (max-width: 1600px) {
  .virtual-footer {
    --px_100: 100vw/19;
  }
}

@media screen and (min-width: 1601px) {
  .virtual-footer {
    --px_100: 1600px/19;
  }
}

.virtual-footer {
  height: calc(1 * var(--px_100));
  background-color: #0d151d;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  .footer-balance {
    width: calc(2.3 * var(--px_100));
    & > div {
      display: flex;
      justify-content: space-between;
    }
    .footer-balance-limit {
      font-size: calc(0.18 * var(--px_100));
      color: #a8b9d5;
    }
    .footer-balance-amount {
      font-size: calc(0.22 * var(--px_100));
      color: #dfb34f;
      position: relative;
      .add-money {
        position: absolute;
        top: calc(-0.22 * var(--px_100));
        right: 0;
        .notice {
          color: #19f84a;
        }
      }
    }
  }
  .footer-chips {
    width: calc(6 * var(--px_100));
    margin: 0 calc(0.6 * var(--px_100));
    display: flex;
    justify-content: space-between;
    align-items: center;
    .chips-item {
      flex-shrink: 0;
      position: relative;
      height: calc(0.75 * var(--px_100));
      width: calc(0.75 * var(--px_100));

      .chips-item-box {
        height: calc(0.55 * var(--px_100));
        width: calc(0.55 * var(--px_100));
        line-height: calc(0.55 * var(--px_100));
        border-radius: 50%;
        background-size: 130% 130%;
        background-position: 50% 50%;
        cursor: url("~@/assets/icons/home_mouse.png"), auto;
        font-weight: 500;
        opacity: 0.8;
        text-align: center;
        position: absolute;
        bottom: calc(0.1 * var(--px_100));
        left: calc(0.05 * var(--px_100));
        margin: auto;
      }
      .active {
        height: calc(0.6 * var(--px_100));
        width: calc(0.6 * var(--px_100));
        bottom: calc(0.2 * var(--px_100));
        box-shadow: 0 0 calc(0.15 * var(--px_100)) 0 #ffffff;
        opacity: 1;
      }
      .disable {
        filter: grayscale(100%);
        -webkit-filter: grayscale(100%);
        -moz-filter: grayscale(100%);
        -ms-filter: grayscale(100%);
        -o-filter: grayscale(100%);
        box-shadow: 0 0 0 0 #ffffff;
        opacity: 1;
        cursor: not-allowed;
      }
    }
  }
  .footer-tools {
    width: calc(4 * var(--px_100));
    display: flex;
    justify-content: space-between;
    align-items: center;

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
      cursor: url("~@/assets/icons/home_mouse.png"), auto;
      .test {
        position: relative;
        left: 0;
        filter: drop-shadow(#f5c24c 80px 0);
      }

      &:hover {
        .test {
          left: -80px;
        }
      }
    }
  }
}
.test {
  position: relative;
  &:hover {
    filter: drop-shadow(#f5c24c 80px 0);
  }
}
</style>
