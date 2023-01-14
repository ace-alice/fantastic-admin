<template>
  <div class="shop-cart-header">
    <div class="top">
      <div
        :style="{ '--left': currentType === 'single' ? 0 : '50%' }"
        class="betType"
      >
        <span
          v-for="item in betTypeList"
          :key="item.value"
          :class="{ 'active-type': currentType === item.value }"
          @click="changeBetType(item.value)"
          >{{ item.label }}</span
        >
      </div>
      <div class="clear" @click.stop="toClearShopCart">
        <lazy-image :img-url="clearIcon" />
      </div>
    </div>
    <div class="bottom">
      <div class="fast-bet">
        <el-form-item label="快速投注">
          <el-switch v-model="delivery" style="--el-switch-on-color: #fe5e00" />
        </el-form-item>
      </div>

      <div class="odds-box">
        <el-select
          v-model="formData.is_filter"
          placeholder="Select"
          popper-class="filter-select"
          size="small"
        >
          <!--suppress JSUnresolvedVariable -->
          <el-option
            v-for="item in betTypeOptions"
            :key="item['value']"
            :label="item['label']"
            :value="item['value']"
          />
        </el-select>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import lazyImage from "@/components/lazyImage/index.vue";
import {
  defineComponent,
  getCurrentInstance,
  onMounted,
  onUnmounted,
  reactive,
  Ref,
  ref,
} from "vue";
import { useI18n } from "vue-i18n";
import useImageResource from "@/hooks/useImageResource";
import { shopCartStore } from "@/store/shopCart";
import { BetType } from "@/interface/shopCart";
export default defineComponent({
  name: "shop-cart-header",
  components: { lazyImage },
  emits: ["changeBetType"],
  setup(props: any, { emit }) {
    const i18n = useI18n();

    const { proxy }: any = getCurrentInstance();

    const { clearShopCart } = shopCartStore();

    const currentType: Ref<BetType> = ref("single");

    function changeBetType(type: BetType) {
      currentType.value = type;
      emit("changeBetType", type);
    }

    function toClearShopCart() {
      clearShopCart(currentType.value);
    }

    const betTypeList: Ref<any[]> = ref([
      { label: i18n.t("single_bet"), value: "single" },
      { label: i18n.t("parlay_game"), value: "parlay" },
    ]);

    const betTypeOptions = ref([
      {
        label: "自动接受最新赔率",
        value: 1,
      },
      {
        label: "自动接受更好赔率",
        value: 2,
      },
      {
        label: "不接受任何变化",
        value: 3,
      },
    ]);

    const { clearIcon, prevImg } = useImageResource();

    const delivery = ref(false);

    const showSelect = ref(false);

    const formData = reactive({
      is_filter: 1,
    });

    onMounted(() => {
      proxy.mittBus.on("changeBetTypeBus", (betType: BetType) => {
        changeBetType(betType);
      });
    });

    onUnmounted(() => {
      proxy.mittBus.off("changeBetTypeBus");
    });

    return {
      betTypeList,
      betTypeOptions,
      clearIcon,
      prevImg,
      delivery,
      showSelect,
      currentType,
      changeBetType,
      formData,
      toClearShopCart,
    };
  },
});
</script>

<!--suppress CssInvalidPseudoSelector -->
<style lang="scss" scoped>
.shop-cart-header {
  width: 288px;
  margin: 0 auto;
  padding: 12px 16px 6px 16px;
  background: var(--color-bg-second);
  border-radius: 16px;
  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 auto;
    .betType {
      width: 196px;
      height: 36px;
      line-height: 36px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 18px;
      position: relative;
      .active-type {
        color: rgba(255, 255, 255, 1);
      }
      &:after {
        content: "";
        position: absolute;
        height: 100%;
        width: 50%;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 18px;
        top: 0;
        left: var(--left);
        transition: all 0.2s linear;
      }
      > span {
        display: inline-block;
        width: 50%;
        text-align: center;
        font-size: 16px;
        color: rgba(255, 255, 255, 0.6);
        cursor: url("~@/assets/icons/home_mouse.png"), auto;
      }
    }
    .clear {
      width: 34px;
      height: 34px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      cursor: url("~@/assets/icons/home_mouse.png"), auto;
      transition: all 0.3s ease-in-out;
      .lazy-image {
        width: 24px;
        height: 24px;
        opacity: 0.4;
      }
      &:hover {
        .lazy-image {
          opacity: 0.7;
        }
      }
      &:active {
        background-image: linear-gradient(90deg, #f16720 0%, #fd8908 94%);
        .lazy-image {
          opacity: 1;
        }
      }
    }

    .active {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 16px;
      font-size: 16px;
      color: var(--color-white) !important;
    }
  }
  .bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 6px;
    font-size: 14px;
    .fast-bet {
      max-width: 100px;
      margin-right: 20px;
      :deep(.el-form-item .el-form-item__label) {
        font-family: PingFangSC-Regular, PingFangSC-Medium, monospace;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.6) !important;
        font-weight: 400;
      }
      :deep(.el-switch) {
        .el-switch__core {
          background: rgba(255, 255, 255, 0.2);
          width: 36px;
          min-width: unset;
          border: none;
          .el-switch__action {
            height: 14px;
            width: 14px;
            left: 4px;
          }
        }
        .is-checked .el-switch__core {
          background: #fe5e00 !important;
        }
      }
      :deep(.el-switch.is-checked) {
        .el-switch__core {
          background: #fe5e00 !important;
          .el-switch__action {
            left: calc(100% - 18px);
          }
        }
      }
    }
    .odds-box {
      :deep(.el-select--small) {
        --el-select-border-color-hover: #ffffff00;
        border: none !important;
        .el-input {
          --el-input-bg-color: #ffffff00;
          --el-input-text-color: #ffffff;
          font-family: PingFangSC-Regular, PingFangSC-Medium, monospace;
          font-size: 14px;
          border: none !important;
          .el-input__wrapper {
            box-shadow: none !important;
            .el-input__inner {
              text-align: right;
            }
          }
        }
      }
    }
  }
  .el-form-item {
    margin-bottom: 0;
  }
}
</style>
