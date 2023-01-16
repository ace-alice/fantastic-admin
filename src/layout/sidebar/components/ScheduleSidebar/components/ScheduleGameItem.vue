<script lang="ts">
import { defineComponent, inject } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { scheduleInfoStore } from '@/store/scheduleInfo'
import useImageResource from '@/hooks/useImageResource'

export default defineComponent({
  name: 'ScheduleGameItem',
  components: {},
  props: {
    itemInfo: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  setup(props: any) {
    const { currentGameId } = storeToRefs(scheduleInfoStore())

    const isTradition = inject('isTradition', true)

    const { changeCurrentGameId } = scheduleInfoStore()

    const hasBanner = ['1', 1, '2', 2, '3', 3, '16', 16, 28, '28', 12, '12']

    const imageResource: any = useImageResource()

    const gameBanner = imageResource[`scheduleGameBg_${
      hasBanner.includes(props.itemInfo.id) ? props.itemInfo.id : '1'
    }`]

    const route = useRoute()

    const router = useRouter()

    function changeCurrentGameIdHandle(id: number | string) {
      if (route.name !== 'ScheduleList') {
        router.push({ name: 'ScheduleList' })
      }
      changeCurrentGameId(id)
    }

    return {
      currentGameId,
      gameBanner,
      isTradition,
      changeCurrentGameIdHandle,
    }
  },
})
</script>

<template>
  <div
    class="ScheduleGameItem" :class="{
      'active': currentGameId === itemInfo.id && isTradition,
      'item-mode2': !isTradition,
      'active-mode2': currentGameId === itemInfo.id && !isTradition,
      'tab-isTradition': isTradition,
    }"
    @click="changeCurrentGameIdHandle(itemInfo.id)"
  >
    <div class="tab-header">
      <LazyImage :img-url="itemInfo.logo" />
      <div class="game-name">
        {{ itemInfo.game_name }}
      </div>
    </div>
    <div
      class="game-banner" :class="{
        'show-banner': currentGameId === itemInfo.id && isTradition,
      }"
    >
      <LazyImage :img-url="gameBanner" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.item-mode2 {
  background-color: var(--color-bg-second);
  .tab-header {
    .lazy-image {
      transform: translateX(-20px);
    }
  }
}
.active-mode2 {
  background-color: var(--color-theme-primary);
}
.tab-isTradition {
  &:hover {
    .tab-header {
      .lazy-image {
        transform: scale(1.2);
      }
    }
  }
}

.ScheduleGameItem {
  border-radius: 0 26px 26px 0;
  overflow: hidden;
  width: 304px;
  flex-shrink: 0;
  cursor: url("@/assets/icons/home_mouse.png"), auto;
  .game-banner {
    height: 0;
    transition: all 0.2s ease-in-out;
    border-radius: 0 26px 26px 0;
    overflow: hidden;
    .lazy-image {
      width: 304px;
    }
  }
  .show-banner {
    height: 207px;
  }
  .tab-header {
    height: 52px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 40px;
    .lazy-image {
      transition: all 0.2s ease-in-out;
      height: 32px;
      width: 32px;
    }
    .game-name {
      flex-grow: 1;
      padding-left: 64px;
      font-family: PingFangSC-Regular, PingFangSC-Medium, monospace;
      font-size: 16px;
      color: #ffffff;
      white-space: pre-wrap;
      word-break: break-all;
    }
  }
}
.active {
  background: #181c22;
  .tab-header .game-name {
    //font-family: PingFangSC-Medium, monospace;
    color: #fe5e00;
    font-weight: 500;
  }
}
</style>
