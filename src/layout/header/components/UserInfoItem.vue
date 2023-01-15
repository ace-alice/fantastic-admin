<script lang="ts">
import {
  computed,
  defineAsyncComponent,
  defineComponent,
  ref,
  watch,
} from 'vue'
import { storeToRefs } from 'pinia'
import { userInfoStore } from '@/store/userInfo'
import useRouteHook from '@/hooks/useRouteHook'
import CenterCartBox from '@/layout/header/components/CenterCartBox.vue'
const CountTo = defineAsyncComponent(
  () => import('@/components/VueCountTo/index.vue'),
)

export default defineComponent({
  name: 'UserInfoItem',
  components: { CountTo, CenterCartBox },
  setup() {
    const { balanceInfo, avatarId, currentCurrencyInfo, isLogin } = storeToRefs(
      userInfoStore(),
    )

    const { routerJump } = useRouteHook()

    const { doGetUserInfo } = userInfoStore()

    const startVal = ref(0)

    watch(
      () => balanceInfo.value.amount,
      (newVal, oldVal) => {
        startVal.value = (oldVal as any) || 0
      },
    )

    const isSearch = ref(false)

    function getBalanceInfo() {
      if (!isLogin.value) {
        return
      }
      isSearch.value = true
      doGetUserInfo().finally(() => {
        setTimeout(() => {
          isSearch.value = false
        }, 1000)
      })
    }

    const avatarImage = computed(() => {
      return new URL(`@/assets/avatar/image-${
        +avatarId.value > 0 && +avatarId.value < 16 ? avatarId.value : 1
      }.png`, import.meta.url).href
    })

    const refreshImg = new URL('@/assets/images/refresh.png', import.meta.url).href

    const scheduleImg = new URL('@/assets/icons/competition-01.png', import.meta.url).href

    const showCenterCart = ref(false)

    function showCenterCartHandle(status: boolean) {
      if (!isLogin.value) {
        return
      }
      showCenterCart.value = status
    }

    return {
      startVal,
      avatarImage,
      balanceInfo,
      refreshImg,
      getBalanceInfo,
      isSearch,
      scheduleImg,
      routerJump,
      showCenterCart,
      currentCurrencyInfo,
      showCenterCartHandle,
      isLogin,
    }
  },
})
</script>

<template>
  <div class="UserInfoItem">
    <div
      v-tooltip="{ width: 10, message: $t('schedule') }"
      class="schedule"
      @click.stop="routerJump('Schedule')"
    >
      <LazyImage :img-url="scheduleImg" />
    </div>
    <div
      class="center-cart"
      :class="{ 'not-login': !isLogin }"
      @mouseenter="showCenterCartHandle(true)"
      @mouseleave="showCenterCartHandle(false)"
    >
      <LazyImage :img-url="avatarImage" />
      <CenterCartBox :show="showCenterCart" />
    </div>
    <div class="balance-info">
      <div>
        {{
          balanceInfo.nickname ? balanceInfo.nickname : $t("you_not_login_now")
        }}
      </div>
      <div v-if="balanceInfo.amount">
        <span>
          {{ currentCurrencyInfo?.symbol || "" }}
        </span>
        <CountTo
          :start-val="Number(startVal)"
          :end-val="Number(balanceInfo.amount)"
          :duration="1000"
        />
      </div>
    </div>
    <div
      v-if="balanceInfo.nickname"
      class="refresh"
      :class="{ 'not-login': !isLogin }"
      @click.stop="getBalanceInfo"
    >
      <LazyImage
        :img-url="refreshImg"
        :class="{ 'get-balance': isSearch }"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.UserInfoItem {
  display: flex;
  .lazy-image {
    height: 40px;
    width: 40px;
    border-radius: 50%;
    overflow: hidden;
  }
  .center-cart {
    cursor: url("~@/assets/icons/home_mouse.png"), auto;
  }
  .schedule {
    display: flex;
    align-items: center;
    margin-right: 24px;
    margin-left: 24px;
    font-family: PingFangSC-Regular, PingFangSC-Medium, monospace;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.6);
    cursor: url("~@/assets/icons/home_mouse.png"), auto;
    .lazy-image {
      height: 24px;
      width: 24px;
      border-radius: 0;
    }
  }
  .balance-info {
    width: 100px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
    margin-left: 24px;
    margin-right: 12px;
    & > div {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 14px;
      &:nth-child(1) {
        font-family: PingFangSC-Regular, PingFangSC-Medium, monospace;
        color: rgba(255, 255, 255, 0.6);
      }
      &:nth-child(2) {
        font-family: Gotham-Medium, PingFangSC-Medium, monospace;
        color: #fe5e00;
        margin-top: 6px;
      }
    }
  }
  .refresh {
    height: 38px;
    width: 38px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: url("~@/assets/icons/home_mouse.png"), auto;
    .lazy-image {
      height: 24px;
      width: 24px;
      border-radius: 50%;
    }
  }
  .not-login {
    cursor: not-allowed;
  }

  .get-balance {
    animation: turn 1s linear infinite;
  }

  @keyframes turn {
    0% {
      -webkit-transform: rotate(0deg);
    }
    50% {
      -webkit-transform: rotate(180deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
    }
  }
}
</style>
