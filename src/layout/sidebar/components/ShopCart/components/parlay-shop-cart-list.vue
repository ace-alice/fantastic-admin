<script lang="ts">
import { defineComponent } from 'vue'
import ShopItemParlay from './shop-item-parlay.vue'
import ParlayBetBox from './parlay-bet-box.vue'
import parlayCartHook from '@/hooks/parlayCartHook'
import Empty from '@/components/Empty/index.vue'
import { toFixedNumber } from '@/utils'

export default defineComponent({
  name: 'ParlayShopCartList',
  components: { ShopItemParlay, Empty, ParlayBetBox },
  setup() {
    const openImage = new URL('@/assets/icons/spread-01.png', import.meta.url)
      .href

    const closeImage = new URL('@/assets/icons/spread-02.png', import.meta.url)
      .href

    const closeImg = new URL('@/assets/icons/closed.png', import.meta.url).href

    const {
      parlayCartList,
      totalPrice,
      totalBet,
      toBet,
      acceptChange,
      betOptions,
      showFastNumberFun,
      isAllowToBet,
      showMore,
      showMoreHandle,
    } = parlayCartHook()
    return {
      parlayCartList,
      totalPrice,
      totalBet,
      toBet,
      acceptChange,
      betOptions,
      openImage,
      closeImage,
      showFastNumberFun,
      isAllowToBet,
      toFixedNumber,
      closeImg,
      showMore,
      showMoreHandle,
    }
  },
})
</script>

<template>
  <div class="parlay-shop-cart-list">
    <div class="list-box">
      <el-scrollbar>
        <div
          v-if="parlayCartList.length > 0"
          class="parlay-shop-cart-list"
          :style="{ '--width-li': 200 }"
        >
          <transition-group name="list" appear>
            <ShopItemParlay
              v-for="cart in parlayCartList"
              :key="cart.shop_id"
              :item-info="cart"
            />
          </transition-group>
          <transition name="list" appear>
            <div v-if="betOptions.length > 0" class="bet-options">
              <div class="option-header">
                <LazyImage class="option-icon" img-url="kkk" />
                <div>{{ $t("parlay_game") }}</div>
                <LazyImage
                  class="control-icon"
                  :img-url="showMore ? closeImage : openImage"
                  @click="showMoreHandle"
                />
              </div>
              <div class="option-list">
                <template
                  v-for="(option, index) in betOptions"
                  :key="option.name"
                >
                  <div v-show="showMore || index === 0" class="option-item">
                    <div>
                      <span>{{ option.name }}</span>
                      <span v-show="+option.point > 0">
                        x{{ toFixedNumber(option.point) }}
                      </span>
                    </div>
                    <div>
                      <span>{{ $t("bonus") }}:</span>
                      <span>{{ option.price() }}</span>
                    </div>
                    <div>
                      <el-input
                        v-model="option.amount"
                        :placeholder="
                          option.money_min() > option.money_max()
                            || option.money_max() === 0
                            ? '投注额已满'
                            : `${option.money_min()}-${option.money_max()}`
                        "
                        :disabled="
                          option.money_min() > option.money_max()
                            || option.money_max() === 0
                        "
                        @blur="showFastNumberFun(option, false)"
                        @focus="showFastNumberFun(option, true)"
                      >
                        <template #prepend>
                          {{ option.num }}x
                        </template>
                        <template #suffix>
                          <img
                            class="close-img"
                            :src="closeImg"
                            alt=""
                            @click.stop="option.amount = null"
                          >
                        </template>
                      </el-input>
                      <div
                        :style="{
                          'height': option.showFastNumber ? '32px' : 0,
                          'margin-top': option.showFastNumber ? '12px' : 0,
                        }"
                        class="fast-number"
                      >
                        <div
                          v-for="item in [
                            option.money_min(),
                            Math.floor(
                              (option.money_max() - option.money_min()) / 4
                                + option.money_min(),
                            ),
                            Math.floor(
                              (option.money_max() - option.money_min()) / 2
                                + option.money_min(),
                            ),
                            option.money_max(),
                          ]"
                          :key="item"
                          :class="{ 'fast-active': +item === +option.amount }"
                          @click.stop="option.amount = item"
                        >
                          <span v-if="index < 3">+{{ item }}</span>
                          <span v-else>{{ $t("max") }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </transition>
        </div>
        <div v-else class="no-data">
          <Empty>
            <template #top>
              <div class="top-slot">
                点击相关赛事赔率立即下单
              </div>
            </template>
          </Empty>
        </div>
      </el-scrollbar>
    </div>
    <ParlayBetBox
      :total-bet="totalBet"
      :total-bonus="totalPrice"
      :disabled="!isAllowToBet"
      @toBet="toBet"
      @acceptChange="acceptChange"
    />
  </div>
</template>

<!-- suppress CssInvalidPseudoSelector -->
<style lang="scss" scoped>
.parlay-shop-cart-list {
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  .top-slot {
    font-size: 12px;
    margin-top: 8px;
    color: rgba(255, 255, 255, 0.3);
  }
  .list-box {
    flex-grow: 1;
    overflow: hidden;
  }
  .close-img {
    height: 16px;
    width: 16px;
    cursor: url("@/assets/icons/home_mouse.png"), auto;
  }
}
.no-data {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.bet-options {
  width: 296px;
  margin: 0 auto 10px;
  padding: 8px;
  background: #181c22;
  border-radius: 16px;
  .option-list {
    padding: 0 8px;
    :deep(.el-input) {
      height: 32px;
      --el-input-placeholder-color: rgba(255, 255, 255, 0.1);
      --el-input-text-color: #ffffff;
      background-color: rgba(255, 255, 255, 0.05) !important;
      border-radius: 8px;
      .el-input-group__prepend {
        background-color: #00000000 !important;
        box-shadow: none !important;
        position: relative;
        color: #ffffff;
        &:after {
          content: "";
          position: absolute;
          right: 0;
          top: calc(50% - 10px);
          height: 20px;
          width: 2px;
          background-color: rgba(255, 255, 255, 0.2);
        }
      }
    }
    :deep(.el-input__wrapper) {
      background: #00000000;
      box-shadow: none;
    }
    .option-item {
      font-family: PingFangSC-Regular, PingFangSC-Medium, monospace;
      font-size: 16px;
      color: #ffffff;
      font-weight: 500;
      padding: 11.5px 0 12px;
      .fast-number {
        width: 100%;
        display: flex;
        justify-content: space-between;
        transition: all 0.2s ease-in-out;
        overflow: hidden;
        .fast-active {
          background: rgba(255, 255, 255, 0.2);
        }
        & > div {
          width: 23%;
          flex-shrink: 0;
          height: 32px;
          line-height: 32px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 6px;
          font-family: PingFangSC-Medium, monospace;
          font-size: 14px;
          color: #ffffff;
          font-weight: 500;
          text-align: center;
          cursor: url("@/assets/icons/home_mouse.png"), auto;
        }
      }
      & + div {
        border-top: 0.5px solid rgba(255, 255, 255, 0.1);
      }
      & > div {
        & + div {
          margin-top: 8px;
        }
        &:nth-child(1) {
          display: flex;
          justify-content: space-between;
          span:nth-child(2) {
            font-family: Gotham-Medium, PingFangSC-Medium, monospace;
            color: #fe5e00;
          }
        }
        &:nth-child(2) {
          span:nth-child(2) {
            color: rgba(255, 255, 255, 0.6);
            font-weight: 400;
          }
          span:nth-child(2) {
            font-family: Gotham-Medium, PingFangSC-Medium, monospace;
            color: #fecb00;
            margin-left: 8px;
          }
        }
      }
    }
  }
  .option-header {
    width: 100%;
    height: 44px;
    background: #262d34;
    border-radius: 8px 8px 0 0;
    padding: 0 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    div:nth-child(2) {
      flex-grow: 1;
      padding: 0 14px;
      font-family: PingFangSC-Regular, PingFangSC-Medium, monospace;
      font-size: 16px;
      color: #ffffff;
      font-weight: 400;
    }
    .option-icon {
      width: 32px;
      height: 32px;
      flex-shrink: 0;
    }
    .control-icon {
      cursor: url("@/assets/icons/home_mouse.png"), auto;
      width: 24px;
      height: 24px;
      flex-shrink: 0;
    }
  }
}
</style>
