<template>
  <div
    class="auto-chess-rules"
    @click.stop="openDialog"
    @mouseenter="rulesImg.btnIsHover = true"
    @mouseleave="rulesImg.btnIsHover = false"
  >
    <el-image
      v-show="!rulesImg.btnIsHover && !rulesImg.isSelected"
      :src="rulesImg.btnNormalImg"
      fit="contain"
    >
      <template #error>
        <img :src="rulesImg.btnNormalImg" alt="" />
      </template>
      <template #placeholder>
        <div></div>
      </template>
    </el-image>
    <el-image
      v-show="rulesImg.btnIsHover || rulesImg.isSelected"
      :src="rulesImg.btnHoverImg"
      fit="contain"
    >
      <template #error>
        <img :src="rulesImg.btnHoverImg" alt="" />
      </template>
      <template #placeholder>
        <div></div>
      </template>
    </el-image>
  </div>

  <el-dialog
    v-model="rulesImg.isSelected"
    :append-to-body="true"
    class="auto-chess-bet-history-dialog-class"
    :show-close="false"
  >
    <div class="history-dialog-title">
      <!-- <el-image :src="rulesImg.titleImg" fit="contain">
        <template #error>
          <img :src="rulesImg.titleImg" />
        </template>
        <template #placeholder>
          <div></div>
        </template>
      </el-image> -->
      <div class="autochess-rule-title">
        {{ $t("autoChessRule.autochess_rule") }}
      </div>
      <div
        class="close-icon"
        @click.stop="rulesImg.isSelected = false"
        @mouseenter="rulesImg.closeIconIsHover = true"
        @mouseleave="rulesImg.closeIconIsHover = false"
      >
        <el-image
          v-show="rulesImg.closeIconIsHover"
          class="close-icon"
          :src="rulesImg.closeIconHover"
          fit="contain"
        >
          <template #error>
            <img :src="rulesImg.closeIconHover" alt="" />
          </template>
          <template #placeholder>
            <div></div>
          </template>
        </el-image>
        <el-image
          v-show="!rulesImg.closeIconIsHover"
          class="close-icon"
          :src="rulesImg.closeIcon"
          fit="contain"
        >
          <template #error>
            <img :src="rulesImg.closeIcon" alt="" />
          </template>
          <template #placeholder>
            <div></div>
          </template>
        </el-image>
      </div>
    </div>

    <div
      :style="{
        height: '600px',
        overflow: 'auto',
      }"
    >
      <div class="history-box">
        <p>{{ $t("autoChessRule.text_p1") }}</p>
        <p>{{ $t("autoChessRule.text_p2") }}</p>
        <p>
          {{ $t("autoChessRule.text_p3_1") }}
          <span class="num">{{ getPrice("1") }}</span>
          {{ $t("autoChessRule.text_p3_2") }}
          <span class="num">{{ getPrice("2") }}</span>
          {{ $t("autoChessRule.text_p3_3") }}
          <span class="num">{{ getPrice("3") }}</span>
          {{ $t("autoChessRule.text_p3_4") }}
        </p>
        <p>{{ $t("autoChessRule.text_p4") }}</p>
        <p>{{ $t("autoChessRule.text_p5") }}</p>
        <p>{{ $t("autoChessRule.text_p6") }}</p>
        <p>
          {{ $t("autoChessRule.text_p7")
          }}{{
            parseTimeFun(
              Number(String(free_limited_deadline).padEnd(13, "0")),
              "{y}/{m}/{d} {h}:{i}:{s}"
            )
          }}{{ $t("autoChessRule.text_p8") }}
        </p>
        <div class="rules-table">
          <div class="autochess-rule-title">
            {{ $t("autoChessRule.hero_cards_buy_price_title") }}
          </div>
        </div>
      </div>
      <div class="rules-rank-box">
        <div>
          <div>
            <div>
              <span>{{ $t("autoChessRule.rank") }}</span>
            </div>
          </div>
          <div>
            <div>
              <span>{{ $t("autoChessRule.buy1star") }}</span>
              <span class="num">( {{ symbol }} )</span>
            </div>
          </div>
          <div>
            <div>
              <span>{{ $t("autoChessRule.sold1star") }}</span>
              <span class="num">( {{ symbol }} )</span>
            </div>
          </div>
          <div>
            <div>
              <span>{{ $t("autoChessRule.sold2star") }}</span>
              <span class="num">( {{ symbol }} )</span>
            </div>
          </div>
          <div>
            <div>
              <span>{{ $t("autoChessRule.sold3star") }}</span>
              <span class="num">( {{ symbol }} )</span>
            </div>
          </div>
        </div>
        <div v-for="rank in cardPrices" :key="rank.level">
          <div>
            <div>
              <span class="level-name">{{
                $t(`autoChessRule.rank${rank.level}`)
              }}</span>
            </div>
          </div>
          <div>
            <div>
              <span class="num">{{ rank["star_1_buy"] }}</span>
            </div>
          </div>
          <div>
            <div>
              <span class="num">{{ rank["star_1_sell"] }}</span>
            </div>
          </div>
          <div>
            <div>
              <span class="num">{{ rank["star_2_sell"] }}</span>
            </div>
          </div>
          <div>
            <div>
              <span class="num">{{ rank["star_3_sell"] }}</span>
            </div>
          </div>
        </div>
      </div>
      <div style="height: 50px"></div>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { parseTime } from "@/utils";
import { computed, defineComponent, reactive } from "vue";
import { storeToRefs } from "pinia";
import { userInfoStore } from "@/store/userInfo";

export default defineComponent({
  name: "autoChessRules",
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
  setup(props) {
    const parseTimeFun = parseTime;

    const { langConfig } = storeToRefs(userInfoStore());
    //当前语言
    const lang = computed(() => {
      if (langConfig.value.id == 1) {
        return "";
      } else {
        return "en/";
      }
    });

    function getPrice(key: string) {
      if (props.refreshPrices[key]) {
        return `${props.refreshPrices[key].symbol}${props.refreshPrices[key].price}`;
      } else {
        return "--";
      }
    }

    let rulesImg = reactive({
      btnNormalImg: new URL(`@/assets/autoChess/${lang.value}btn-rule-normal.png` ,import.meta.url).href,
      btnHoverImg: new URL(`@/assets/autoChess/${lang.value}btn-rule-hover.png` ,import.meta.url).href,
      // titleImg: new URL(`@/assets/autoChess/${lang.value}game_rule_title.png` ,import.meta.url).href,
      cardPriceInfoImg: new URL(`@/assets/autoChess/hero_price_list_title.png` ,import.meta.url).href,
      closeIcon: new URL(`@/assets/autoChess/btn-x-normal.png` ,import.meta.url).href,
      closeIconHover: new URL(`@/assets/autoChess/btn-x-hover.png` ,import.meta.url).href,
      closeIconIsHover: false,
      btnIsHover: false,
      isSelected: false,
    });

    function openDialog() {
      rulesImg.isSelected = true;
    }
    return { rulesImg, openDialog, getPrice, parseTimeFun };
  },
});
</script>

<style lang="scss" scoped>
.auto-chess-rules {
  position: absolute;
  right: 40px;
}
div::-webkit-scrollbar {
  width: 0 !important;
  height: 0;
}
</style>
