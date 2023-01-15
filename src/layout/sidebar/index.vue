<!-- eslint-disable @typescript-eslint/no-use-before-define -->
<script lang="ts">
import {
  computed,
  defineAsyncComponent,
  getCurrentInstance,
  nextTick,
  onMounted,
  provide,
  ref,
  watch,
} from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { userInfoStore } from '@/store/userInfo'
const SideBarHeader = defineAsyncComponent(
  () => import('./components/SideBarHeader/index.vue'),
)
const GameList = defineAsyncComponent(
  () => import('./components/gameList/index.vue'),
)
const ShopCart = defineAsyncComponent(
  () => import('./components/ShopCart/index.vue'),
)

const BetList = defineAsyncComponent(
  () => import('./components/betList/index.vue'),
)
const PosterItem = defineAsyncComponent(
  () => import('./components/PosterItem/index.vue'),
)
const LogoItem = defineAsyncComponent(
  () => import('./components/LogoItem/index.vue'),
)
const ScheduleSidebar = defineAsyncComponent(
  () => import('./components/ScheduleSidebar/index.vue'),
)
const NotLoginBox = defineAsyncComponent(
  () => import('./components/NotLoginBox/index.vue'),
)

export default {

  name: 'Sidebar',
  components: {
    SideBarHeader,
    GameList,
    BetList,
    ShopCart,
    PosterItem,
    LogoItem,
    ScheduleSidebar,
    NotLoginBox,
  },
  setup() {
    const isTradition = ref(document.body.clientWidth > 1199)

    const leftIcon = new URL('@/assets/icons/prev.png', import.meta.url).href

    const { isLogin } = storeToRefs(userInfoStore())

    provide(
      'isTradition',
      computed(() => isTradition.value),
    )

    const oldSideBar = ref('GameList')

    const currentSideBar = ref('GameList')

    const changeCurrentSideBar = (sideBar: string) => {
      oldSideBar.value = sideBar
      if (!isTradition.value || isSchedule.value) {
        return
      }
      currentSideBar.value = sideBar
    }

    function traditionStatus() {
      if (isTradition.value && !isSchedule.value) {
        oldSideBar.value = currentSideBar.value
      }
      if (!isSchedule.value) {
        currentSideBar.value = 'GameList'
      }
      isTradition.value = !isTradition.value
      if (isTradition.value && !isSchedule.value) {
        setTimeout(() => {
          currentSideBar.value = oldSideBar.value
        }, 300)
      }
    }

    const route = useRoute()

    const isSchedule = ref(false)

    const { proxy }: any = getCurrentInstance()

    function routerName(newVal: string) {
      if (['ScheduleList', 'ScheduleDetail'].includes(newVal)) {
        currentSideBar.value = 'ScheduleSidebar'
        isSchedule.value = true
        return
      }
      if (['MatchList'].includes(newVal)) {
        nextTick(() => {
          proxy.mittBus.emit('changeCurrentSideBarBus', 'GameList')
        })
      }
      isSchedule.value = false
    }

    watch(
      () => route.name,
      (newVal) => {
        routerName(newVal as string)
      },
    )

    onMounted(() => {
      routerName(route.name as any)
    })

    return {
      isTradition,
      currentSideBar,
      changeCurrentSideBar,
      traditionStatus,
      leftIcon,
      oldSideBar,
      isLogin,
    }
  },
}
</script>

<template>
  <div
    class="sidebar" :class="{
      'not-sidebar-tradition': !isTradition,
    }"
  >
    <LogoItem />
    <SideBarHeader
      v-show="currentSideBar !== 'ScheduleSidebar'"
      @change="changeCurrentSideBar"
    />
    <div class="side-bar-box">
      <div class="main-box">
        <keep-alive>
          <component :is="currentSideBar" />
        </keep-alive>
      </div>
      <PosterItem
        v-show="
          currentSideBar === 'GameList' && oldSideBar === 'GameList' && isLogin
        "
      />
      <NotLoginBox
        v-show="
          currentSideBar === 'GameList' && oldSideBar === 'GameList' && !isLogin
        "
      />
    </div>
    <div
      class="toggle-icon"
      :style="{
        '--deg-value': isTradition ? '0' : '180deg',
        '--right': isTradition ? '-32px' : '-16px',
      }"
      @click.stop="traditionStatus"
    >
      <LazyImage :img-url="leftIcon" />
    </div>
  </div>
</template>

<!-- suppress CssInvalidPseudoSelector -->
<style lang="scss" scoped>
.not-sidebar-tradition {
  width: 88px !important;
  .main-box {
    width: calc(100% - 16px) !important;
  }
}
.sidebar {
  flex-shrink: 0;
  height: 100%;
  width: 320px;
  display: flex;
  //overflow: hidden;
  flex-direction: column;
  transition: all 0.4s ease-in-out;
  position: relative;
  .side-bar-box {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    .main-box {
      flex-grow: 1;
      overflow: hidden;
      :deep(.el-scrollbar) {
        .el-scrollbar__thumb {
          display: none;
        }
      }
    }
  }
  .toggle-icon {
    height: 68px;
    width: 32px;
    position: absolute;
    bottom: 44px;
    transition: all 0.3s linear;
    right: var(--right);
    cursor: url("~@/assets/icons/home_mouse.png"), auto;
    border-radius: 0 4px 4px 0;
    background-color: rgba(255, 255, 255, 0.1);
    z-index: 20;
    display: flex;
    justify-content: center;
    align-items: center;
    .lazy-image {
      height: 24px;
      width: 24px;
      transition: all 0.3s linear;
      transform: rotateZ(var(--deg-value));
    }
  }
}
</style>
