<script lang="ts">
import type { Ref } from 'vue'
import { getCurrentInstance, onMounted, onUnmounted, ref } from 'vue'
import ShopCartHeader from './components/shop-cart-header.vue'
import SingleShopCartList from './components/single-shop-cart-list.vue'
import ParlayShopCartList from './components/parlay-shop-cart-list.vue'
export default {
  name: 'ShopCart',
  components: {
    ShopCartHeader,
    SingleShopCartList,
    ParlayShopCartList,
  },
  setup() {
    const carouselRef: Ref<any> = ref(null)

    const betSuccessImage = new URL('@/assets/icons/bet-success.png', import.meta.url).href

    const showSuccess = ref(false)

    const { proxy }: any = getCurrentInstance()

    let successTimer: any = null

    onMounted(() => {
      proxy.mittBus.on('betSuccessBus', () => {
        clearTimeout(successTimer)
        successTimer = null
        showSuccess.value = true
        successTimer = setTimeout(() => {
          showSuccess.value = false
        }, 3000)
      })
    })
    onUnmounted(() => {
      proxy.mittBus.off('betSuccessBus')
    })

    function changeBetType(type: string) {
      if (carouselRef.value) {
        carouselRef.value.setActiveItem(type)
      }
    }
    return {
      carouselRef,
      changeBetType,
      betSuccessImage,
      showSuccess,
    }
  },
}
</script>

<template>
  <div class="shopping-wrapper">
    <ShopCartHeader @changeBetType="changeBetType" />
    <el-carousel
      ref="carouselRef"
      indicator-position="none"
      arrow="never"
      :loop="false"
      :autoplay="false"
      height="500"
    >
      <el-carousel-item name="single">
        <SingleShopCartList />
      </el-carousel-item>
      <el-carousel-item name="parlay">
        <ParlayShopCartList />
      </el-carousel-item>
    </el-carousel>
    <div class="bet-success" :class="{ 'show-success': showSuccess }">
      <LazyImage :img-url="betSuccessImage" />
      <div class="success-text">
        {{ $t("bet_success") }}
      </div>
    </div>
  </div>
</template>

<!-- suppress CssInvalidPseudoSelector -->
<style scoped lang="scss">
.shopping-wrapper {
  display: flex;
  width: 100%;
  flex-direction: column;
  height: 100%;
  position: relative;
  .show-success {
    height: 118px !important;
    width: 200px !important;
    opacity: 1 !important;
  }
  .bet-success {
    position: absolute;
    display: flex;
    overflow: hidden;
    height: 0;
    width: 0;
    opacity: 0;
    transition: opacity 0.6s ease-in-out;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #3b4045;
    border-radius: 8px;
    z-index: 3000;
    top: 210px;
    left: calc(50% - 100px);
    .lazy-image {
      height: 48px;
      width: 48px;
    }
    .success-text {
      font-family: PingFangSC-Medium, monospace;
      font-size: 14px;
      color: #ffffff;
      font-weight: 600;
      margin-top: 6px;
    }
  }
  &:deep(.el-carousel) {
    height: calc(100% - 102px);
    .el-carousel__container {
      position: unset !important;
      height: 100% !important;
    }
    .el-carousel__item {
      padding-top: 10px;
      height: calc(100% - 20px) !important;
      overflow: hidden;
      background-color: var(--color-bg-primary);
    }
    .is-active {
      z-index: 500;
    }
  }

  .shop-list {
    flex: 1;
    overflow-y: auto;
  }
  .footer {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    height: 158px;
    span {
      font-size: 14px;
      color: var(--color-white);
      font-weight: 400;
    }
    .bet {
      font-weight: 500;
    }
    .amount {
      color: var(--color-theme-second);
      font-weight: 500;
    }
    .total-bet,
    .total-amount {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 296px;
    }
    .total-bet {
      margin-top: 18px;
    }
    .total-amount {
      margin-top: 4px;
      margin-bottom: 12px;
    }
    .submit {
      width: 296px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      background-image: linear-gradient(90deg, #f16720 0%, #fd8908 94%);
      border-radius: 8px;
      font-size: 16px;
      color: var(--color-white);
      font-weight: 500;
      margin-bottom: 44px;
      cursor: url("@/assets/icons/home_mouse.png"), auto;
    }
  }
}
</style>
