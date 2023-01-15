<script lang="ts">
import type { PropType, Ref } from 'vue'
import { computed, ref, watch } from 'vue'
import useImageResource from '@/hooks/useImageResource'
import { CategoryIdName } from '@/enum'
import { setItemName, toFixedNumber } from '@/utils'
import { shopCartStore } from '@/store/shopCart'
export default {
  name: 'IaShopItemOne',
  components: {},
  props: {
    itemInfo: {
      type: Object as PropType<any>,
      default: () => {
        return {}
      },
    },
    shopAmount: {
      type: Object as PropType<any>,
      default: null,
    },
  },
  emits: ['changeAmountEmit'],
  setup(props: any, { emit }: any) {
    const { changeShopCartElement } = shopCartStore()
    const { lockIcon, closeImg, betTitleImg } = useImageResource()
    const betCount: Ref<any> = ref(Number(props.shopAmount) || null)
    const showFastNumber = ref(false)

    function showFastNumberFun(tag: boolean) {
      setTimeout(() => {
        showFastNumber.value = tag
      }, 50)
    }

    const fastNumber = ref([
      props.itemInfo.money_min,
      Math.floor(
        (props.itemInfo.money_max - props.itemInfo.money_min) / 4
          + props.itemInfo.money_min,
      ),
      Math.floor(
        (props.itemInfo.money_max - props.itemInfo.money_min) / 2
          + props.itemInfo.money_min,
      ),
      props.itemInfo.money_max,
    ])

    const expectedBonus = computed(() => {
      return toFixedNumber(
        Number(betCount.value || 0) * Number(props.itemInfo.odd),
      )
    })

    const isLock = computed(() => {
      return (
        +props.itemInfo.is_del === 1
        || +props.itemInfo.is_finish === 1
        || +props.itemInfo.status !== 1
      )
    })

    const isOddChange = ref(false)

    let changeTimer: any = null

    watch(
      () => props.itemInfo.odd,
      () => {
        isOddChange.value = true
        clearTimeout(changeTimer)
        changeTimer = null
        changeTimer = setTimeout(() => {
          isOddChange.value = false
        }, 3000)
      },
    )

    function closeCart() {
      changeShopCartElement(String(props.itemInfo.shop_id), 'single')
    }

    function changeAmount(amount: number) {
      emit('changeAmountEmit', {
        cartId: props.itemInfo.shop_id,
        amount,
      })
    }

    watch(
      () => betCount.value,
      (newVal) => {
        if ((betCount.value || 0) > Number(props.itemInfo.money_max)) {
          betCount.value = Number(props.itemInfo.money_max)
          return
        }
        emit('changeAmountEmit', {
          cartId: props.itemInfo.shop_id,
          amount: toFixedNumber(newVal),
        })
      },
    )

    watch(
      () => props.shopAmount,
      (newVal) => {
        betCount.value = newVal
      },
    )

    return {
      betTitleImg,
      closeImg,
      CategoryIdName,
      setItemName,
      betCount,
      fastNumber,
      showFastNumber,
      expectedBonus,
      lockIcon,
      isLock,
      closeCart,
      isOddChange,
      changeAmount,
      showFastNumberFun,
    }
  },
}
</script>

<template>
  <div
    class="shop-item" :class="{
      'lock-disabled': isLock,
      'full-disabled': +itemInfo.money_min >= +itemInfo.money_max,
    }"
  >
    <div class="header">
      <LazyImage :img-url="itemInfo.game_logo || ''" />
      <span
        v-tooltip="{ width: 150, message: itemInfo.event_name }"
        class="text"
      >
        {{ itemInfo.event_name }}
      </span>
      <LazyImage class="close" :img-url="closeImg" @click.stop="closeCart" />
    </div>
    <div class="content">
      <div class="title">
        <span class="name">{{
          `${
            itemInfo.is_champion
              ? ""
              : setItemName(+itemInfo.match, itemInfo.game_lang)
          }  ${itemInfo.play_name}  ${itemInfo.desc}`
        }}</span>
        <span class="bet">
          <LazyImage v-show="isLock" :img-url="lockIcon" />
          <span v-show="!isLock" :class="{ isOddChange }">x{{ itemInfo.odd }}</span>
        </span>
      </div>
      <div v-if="!itemInfo.is_champion" class="team-show">
        <span>{{ itemInfo.team_name_1 }}</span>
        <span> - VS - </span>
        <span>{{ itemInfo.team_name_2 }}</span>
      </div>
      <div class="bottom">
        <div class="profit">
          <span class="label">预计盈利:</span>
          <span class="amount">{{ expectedBonus }}</span>
        </div>
        <el-input
          v-model.number="betCount"
          type="number"
          :min="Number(itemInfo.money_min)"
          :max="Number(itemInfo.money_max)"
          :placeholder="`${Number(itemInfo.money_min)}-${Number(
            itemInfo.money_max,
          )}`"
          :disabled="isLock"
          @blur="showFastNumberFun(false)"
          @focus="showFastNumberFun(true)"
        >
          <template #suffix>
            <img
              class="close-img" :class="{ 'input-no-data': !betCount }"
              :src="closeImg"
              alt=""
              @click.stop="betCount = 0"
            >
          </template>
        </el-input>
      </div>
      <div
        :style="{
          'height': showFastNumber ? '32px' : 0,
          'margin-top': showFastNumber ? '12px' : 0,
        }"
        class="fast-number"
      >
        <div
          v-for="(item, index) in fastNumber"
          :key="item"
          :class="{ 'fast-active': +item === Number(betCount) }"
          @click.stop="changeAmount(item)"
        >
          <span v-if="index < fastNumber.length - 1">+{{ item }}</span>
          <span v-else>{{ $t("max") }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- suppress CssInvalidPseudoSelector -->
<style scoped lang="scss">
.shop-item {
  width: 296px;
  margin: 0 auto 10px;
  padding: 8px;
  background: var(--color-bg-second);
  border-radius: 16px;
  .close-img {
    height: 16px;
    width: 16px;
    cursor: url("@/assets/icons/home_mouse.png"), auto;
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 44px;
    padding-left: 16px;
    padding-right: 18px;
    background: var(--color-bg-primary);
    border-radius: 8px 8px 0 0;
    .lazy-image {
      width: 32px;
      height: 32px;
    }
    .close {
      width: 24px !important;
      height: 24px !important;
      cursor: url("@/assets/icons/home_mouse.png"), auto;
    }
    .text {
      display: inline-block;
      width: 138px;
      white-space: pre-wrap;
      font-family: PingFangSC-Regular, PingFangSC-Medium, monospace;
      font-size: 14px;
      color: #ffffff;
      font-weight: 400;
    }
  }
  .content {
    padding: 16px 10px 10px;
    & > div + div {
      margin-top: 12px;
    }
    .title {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      .name {
        flex-grow: 1;
        padding-right: 16px;
        font-family: PingFangSC-Regular, PingFangSC-Medium, monospace;
        font-size: 14px;
        color: #ffffff;
        font-weight: 400;
      }
      .bet {
        font-family: Gotham-Medium, PingFangSC-Medium, monospace;
        font-size: 16px;
        height: 24px;
        color: #fe5e00;
        font-weight: 500;
        align-items: center;
        .lazy-image {
          height: 24px;
        }
        .isOddChange {
          color: #18fa9b;
        }
      }
    }
    .team-show {
      font-family: PingFangSC-Regular, PingFangSC-Medium, monospace;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.6);
      font-weight: 400;
    }
  }
  .bottom {
    //display: flex;
    //justify-content: space-between;
    //align-items: center;
    //flex-wrap: wrap;
    .profit {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.6);
      font-weight: 400;
      .amount {
        font-family: Gotham-Medium, monospace;
        color: var(--color-theme-second);
        line-height: 20px;
        font-weight: 500;
        margin-left: 6px;
      }
    }
    :deep(.el-input) {
      min-width: 110px;
      height: 32px;
      margin-top: 8px;
      flex-shrink: 0;
      --el-input-placeholder-color: rgba(255, 255, 255, 0.1);
      --el-input-text-color: #ffffff;
    }
    :deep(.el-input__wrapper) {
      background: rgba(255, 255, 255, 0.05);
      box-shadow: none;
      border-radius: 8px;
    }
  }
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
}
.lock-disabled {
  position: relative;
  * {
    color: rgba(255, 255, 255, 0.2) !important;
  }
  &:after {
    position: absolute;
    content: "";
    height: calc(100% - 56px);
    width: 100%;
    bottom: 0;
    left: 0;
    cursor: not-allowed;
  }
}
.full-disabled {
  position: relative;
  * {
    color: rgba(254, 94, 0, 0.4) !important;
  }
  .header {
    background: rgba(254, 94, 0, 0.2);
    .close {
      opacity: 0.2;
    }
  }
  &:after {
    position: absolute;
    content: "";
    height: calc(100% - 56px);
    width: 100%;
    bottom: 0;
    left: 0;
    cursor: not-allowed;
  }
}
</style>
