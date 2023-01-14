<template>
  <div class="single-shop-cart-list">
    <div class="list-box">
      <el-scrollbar>
        <div
          class="single-shop-cart-list"
          :style="{ '--width-li': 200 }"
          v-if="singleCartList.length > 0"
        >
          <transition-group name="list" appear>
            <ShopItemSingle
              v-for="cart in singleCartList"
              :key="cart.shop_id"
              :item-info="cart"
              :shopAmount="singleBetAmount[`single${cart.shop_id}`]"
              @changeAmountEmit="setShoppingCarCount"
            />
          </transition-group>
        </div>
        <div class="no-data" v-else>
          <Empty>
            <template #top>
              <div class="top-slot">点击相关赛事赔率立即下单</div>
            </template>
          </Empty>
        </div>
      </el-scrollbar>
    </div>
    <SingleBetBox
      :total-bet="totalBet"
      :total-bonus="totalPrice"
      :disabled="!isAllowToBet"
      :warnMessage="warnMessage"
      @toBet="toBet"
      @acceptChange="acceptChange"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import singleCartHook from "@/hooks/singleCartHook";
import ShopItemSingle from "./shop-item-single.vue";
import Empty from "@/components/Empty/index.vue";
import SingleBetBox from "./single-bet-box.vue";
export default defineComponent({
  name: "single-shop-cart-list",
  components: { ShopItemSingle, Empty, SingleBetBox },
  setup() {
    const {
      singleCartList,
      singleBetAmount,
      setShoppingCarCount,
      totalBet,
      totalPrice,
      isAllowToBet,
      toBet,
      acceptChange,
      warnMessage,
    } = singleCartHook();

    return {
      singleCartList,
      singleBetAmount,
      setShoppingCarCount,
      totalBet,
      totalPrice,
      isAllowToBet,
      toBet,
      acceptChange,
      warnMessage,
    };
  },
});
</script>

<style lang="scss" scoped>
.single-shop-cart-list {
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
}
.no-data {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
