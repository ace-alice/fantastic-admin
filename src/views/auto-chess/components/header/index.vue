<template>
  <div class="auto-chess-header">
    <div
      class="exit-btn"
      @click.stop="toPath"
      @mouseenter="isHover = true"
      @mouseleave="isHover = false"
    >
      <el-image
        v-show="!isHover"
        :style="{ 'z-index': 0 }"
        :src="exitNormal"
        fit="contain"
      >
        <template #error>
          <img :src="exitNormal" alt="" />
        </template>
        <template #placeholder>
          <img :src="exitNormal" alt="" />
        </template>
      </el-image>
      <el-image v-show="isHover" :src="exitHover" fit="contain">
        <template #error>
          <img :src="exitHover" alt="" />
        </template>
        <template #placeholder>
          <img :src="exitHover" alt="" />
        </template>
      </el-image>
    </div>
    <div class="auto-balance">
      <div class="balance-icon"></div>
      <countTo
        :startVal="Number(startVal)"
        :endVal="Number(balanceInfo.amount)"
        :duration="1000"
      />
    </div>
    <el-image class="top_title" :src="getImage('top_title')" fit="contain">
      <template #error>
        <div class="image-slot">
          <div></div>
        </div>
      </template>
      <template #placeholder>
        <div></div>
      </template>
    </el-image>
    <BetHistory :symbol="symbol" />
    <AutoRules
      :symbol="symbol"
      :refreshPrices="refreshPrices"
      :cardPrices="cardPrices"
      :free_limited_deadline="free_limited_deadline"
    />
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-var-requires */
import { computed, defineComponent, reactive, ref, toRefs, watch } from "vue";
import { useRouter } from "vue-router";
import countTo from "@/components/VueCountTo/index.vue";
import BetHistory from "./components/BetHistory.vue";
import AutoRules from "./components/AutoRules.vue";
import { storeToRefs } from "pinia";
import { userInfoStore } from "@/store/userInfo";

export default defineComponent({
  name: "autoChessHeader",
  components: { countTo, BetHistory, AutoRules },
  props: {
    symbol: {
      type: String,
      default: "¥",
    },
    cardPrices: {
      type: Array,
      default: () => {
        return [];
      },
    },
    refreshPrices: {
      type: Object,
      default: () => {
        return {};
      },
    },
    free_limited_deadline: {
      type: Number,
      default: 0,
    },
  },
  setup() {
    const router = useRouter();

    const { langConfig, balanceInfo } = storeToRefs(userInfoStore());
    //当前语言
    const lang = computed(() => {
      if (langConfig.value.id == 1) {
        return "";
      } else {
        return "en/";
      }
    });

    //获取图片的方法
    function getImage(name: string, selected = "") {
      return new URL(`@/assets/autoChess/${lang.value}${name}${selected}.png` ,import.meta.url).href;
    }

    const exitBtn = reactive({
      exitNormal: new URL(`@/assets/autoChess/${lang.value}login_out_btn_normal.png` ,import.meta.url).href,
      exitHover: new URL(`@/assets/autoChess/${lang.value}login_out_btn_hover.png` ,import.meta.url).href,
    });

    // 退出按钮是否hover
    const isHover = ref(false);

    const startVal = ref(0);
    watch(
      () => balanceInfo.value.amount,
      (newVal, oldVal) => {
        startVal.value = oldVal as any;
      }
    );

    function toPath() {
      router.push({ name: "MatchList" });
    }
    return {
      toPath,
      getImage,
      startVal,
      balanceInfo,
      isHover,
      ...toRefs(exitBtn),
    };
  },
});
</script>

<style lang="scss" scoped>
@media screen and (max-width: 1200px) {
  .auto-chess-header {
    --px_100: 1200px/19;
  }
}
@media screen and (min-width: 1201px) {
  .auto-chess-header {
    --px_100: 100vw/19;
  }
}
@media screen and (max-width: 1600px) {
  .auto-chess-header {
    --px_100: 1600px/19;
  }
}
.auto-chess-header {
  height: 70px;
  width: 100%;
  flex-shrink: 0;
  background-image: url("../../../../assets/autoChess/top-bg.png");
  background-size: 100% 100%;
  margin-bottom: 30px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  .exit-btn {
    position: absolute;
    top: 0;
    left: 0;
    height: 74px;
    width: 266px;
    // z-index: 3000;
    &::before {
      content: "";
      height: 74px;
      width: 266px;
      background-color: #00000000;
      position: absolute;
      z-index: 3000;
    }
  }
  .auto-balance {
    position: absolute;
    top: 20px;
    left: 300px;
    height: 30px;
    width: 180px;
    background-image: url("../../../../assets/autoChess/user_money_bg.png");
    background-size: 100% 100%;
    color: #ff5837;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-right: 15px;
    padding-top: 2px;
    font-size: 20px;
    .balance-icon {
      position: absolute;
      top: -5px;
      left: 0;
      height: 40px;
      width: 40px;
      background-image: url("../../../../assets/autoChess/icon-money.png");
      background-size: 100% 100%;
    }
  }
  .top_title {
    height: 30px;
  }
}
</style>
