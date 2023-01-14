<template>
  <div class="refresh-price-box">
    <div class="refresh-price-selected" @click.stop="listShow = !listShow">
      <el-image :src="getLevelPic(levelNum, true)" fit="contain">
        <template #error>
          <div class="image-slot">
            <div></div>
          </div>
        </template>
        <template #placeholder>
          <div></div>
        </template>
      </el-image>
      <el-image class="icon-down" :src="iconDown" fit="contain">
        <template #error>
          <div class="image-slot">
            <div></div>
          </div>
        </template>
        <template #placeholder>
          <div></div>
        </template>
      </el-image>
    </div>
    <div class="refresh-price-list" v-show="listShow">
      <div
        class="list-item"
        v-for="priceItem in Object.keys(refreshPrices)"
        :key="priceItem"
        :class="{
          'list-item-selected':
            +refreshPrices[priceItem].price === +refreshPrice.price,
        }"
        @click.stop="
          changePrice({
            priceObj: refreshPrices[priceItem],
            room_id: priceItem,
          })
        "
      >
        <el-image
          :src="
            getLevelPic(
              priceItem,
              +refreshPrices[priceItem].price === +refreshPrice.price
            )
          "
          fit="contain"
        >
          <template #error>
            <div class="image-slot">
              <div></div>
            </div>
          </template>
          <template #placeholder>
            <div></div>
          </template>
        </el-image>
        <div class="refresh-btn-text">
          {{ refreshPrices[priceItem].symbol
          }}{{ refreshPrices[priceItem].price }}/{{ $t("autoChessRule.times") }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { userInfoStore } from "@/store/userInfo";

export default defineComponent({
  name: "refreshPrice",
  emits: ["changePrice"],
  props: {
    refreshPrice: {
      type: Object,
      default: () => {
        return { price: 0, symbol: "¥" };
      },
    },
    refreshPrices: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  setup(props, { emit }) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const iconDown = new URL("@/assets/autoChess/icon-down.png" ,import.meta.url).href;

    const { langConfig } = storeToRefs(userInfoStore());

    const lang = computed(() => {
      if (langConfig.value.id == 1) {
        return "";
      } else {
        return "en/";
      }
    });

    const listShow = ref(false);

    const levelNum = computed(() => {
      let temp = "1";
      for (const indexL of Object.keys(props.refreshPrices)) {
        if (props.refreshPrices[indexL].price == props.refreshPrice.price) {
          temp = indexL;
        }
      }
      return temp;
    });
    function getLevelPic(level: string, isSelect: boolean) {
      return new URL(`@/assets/autoChess/${lang.value}lv${level}-${
        isSelect ? "selected" : "normal"
      }.png`,import.meta.url).href;
    }
    function changePrice(value: any) {
      emit("changePrice", value);
      listShow.value = !listShow.value;
    }

    onMounted(() => {
      window.addEventListener("click", () => {
        listShow.value = false;
      });
    });
    onUnmounted(() => {
      window.removeEventListener("click", () => {
        listShow.value = false;
      });
    });
    return { listShow, levelNum, getLevelPic, changePrice, iconDown };
  },
});
</script>

<!--suppress CssInvalidPseudoSelector -->
<style lang="scss" scoped>
@media screen and (max-width: 1200px) {
  .refresh-price-box {
    --px_100: 1200px/19;
  }
}
@media screen and (min-width: 1201px) {
  .refresh-price-box {
    --px_100: 1200px/19;
  }
}
@media screen and (min-width: 1600px) {
  .refresh-price-box {
    --px_100: 1200px/19;
  }
}
:deep(.el-image) {
  height: calc(0.35 * var(--px_100));
}
.refresh-price-box {
  position: absolute;
  top: calc(0.3 * var(--px_100));
  right: calc(1.4 * var(--px_100));
  width: calc(2 * var(--px_100));
  z-index: 25;
  .refresh-price-selected {
    height: calc(0.55 * var(--px_100));
    width: calc(2 * var(--px_100));
    background-image: url("../../../assets/autoChess/level_select_bg.png");
    background-size: 100% 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    // :hover {
    //   background-image: url('../../../assets/autoChess/level_select_hover_bg.png');
    // }
  }
  .icon-down {
    position: absolute;
    height: calc(0.22 * var(--px_100));
    width: calc(0.32 * var(--px_100));
    right: calc(0.1 * var(--px_100));
  }
  .refresh-price-list {
    width: calc(2 * var(--px_100));
    background-image: url("../../../assets/autoChess/level_list_bg.png");
    background-size: 100% 100%;
    .list-item {
      height: calc(0.6 * var(--px_100));
      width: 90%;
      margin: auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: calc(0.24 * var(--px_100));
      &:hover {
        background-image: url("../../../assets/autoChess/level_selected_bg.png");
        background-size: 100% 100%;
        color: #ff5837;
      }
    }
    .list-item-selected {
      background-image: url("../../../assets/autoChess/level_selected_bg.png");
      background-size: 100% 100%;
      color: #ff5837;
    }
  }
}
</style>
