<script lang="ts">
import type { Ref } from 'vue'
import { computed, defineComponent, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { countdownHook } from '@/hooks/countdownHook'
import { globalApiConfigStore } from '@/store/globalApiConfig'
import { parseTime } from '@/utils'
import useImageResource from '@/hooks/useImageResource'

export default defineComponent({
  name: 'ScheduleCard',
  components: {},
  props: {
    index: {
      type: Number,
      default: 0,
    },
    eventInfo: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  setup(props: any) {
    const hasBanner = ['1', 1, '2', 2, '3', 3, '16', 16]

    const i18n = useI18n()

    const starImage = new URL('@/assets/icons/lv_start.png', import.meta.url).href

    const imageResource: any = useImageResource()

    const gameBanner = imageResource[`scheduleCardBg_${
      hasBanner.includes(props.eventInfo.game_type_id)
        ? props.eventInfo.game_type_id
        : '1'
    }`]

    // 倒计时
    const { countdown } = countdownHook(props.eventInfo.start_time, 24)

    // 比赛状态改变的状态
    const statusChange: Ref<null | 'start' | 'end'> = ref(null)

    // 比赛开始时显示的信息
    const toStart = i18n.t('match_already_ongoing')

    // 获取比赛状态并返回需要展示的信息
    const eventStatus = computed(() => {
      if (statusChange.value === 'start') {
        return [2, 'rgba(9,255,66,0.40)', toStart]
      }
      if (statusChange.value === 'end') {
        return [3, 'rgba(131,0,0,0.40)', i18n.t('ended')]
      }
      switch (props.eventInfo.status) {
        case 0:
          return [1, 'rgba(0,0,0,0.40)', i18n.t('game_not_start')]
        case 1:
          return [2, 'rgba(9,255,66,0.40)', toStart]
        case 2:
          return [3, 'rgba(131,0,0,0.40)', i18n.t('ended')]
        default:
          return [1, 'rgba(0,0,0,0.40)', i18n.t('game_not_start')]
      }
    })

    // 实时检测比赛是否开始
    watch(
      () => countdown.value,
      (newVal, oldVal) => {
        if (!newVal[0] && oldVal[0]) {
          statusChange.value = 'start'
        }
      },
      { deep: true },
    )

    const { currentTime } = storeToRefs(globalApiConfigStore())

    // 实时检测比赛是否结束
    watch(
      () => currentTime.value,
      (newVal) => {
        if (newVal > props.eventInfo.end_time * 1000) {
          statusChange.value = 'end'
        }
      },
    )

    const router = useRouter()

    function toSeeDetail() {
      router.push({
        name: 'ScheduleDetail',
        query: {
          event_id: props.eventInfo.id,
        },
      })
    }

    return { gameBanner, eventStatus, parseTime, starImage, toSeeDetail }
  },
})
</script>

<template>
  <div
    class="ScheduleCard" :class="{
      'not-margin': index % 3 === 0,
      'end-card': eventStatus[0] === 3,
    }"
    @click.stop="toSeeDetail"
  >
    <LazyImage :img-url="gameBanner" class="banner-bg" fit-type="fill" />
    <div class="event-info" :style="{ '--status-bg': eventStatus[1] }">
      <div class="event-title">
        <LazyImage :img-url="eventInfo.game_type_logo" />
        <div class="event-name">
          {{ eventInfo.event_name }}
        </div>
      </div>
      <span class="event-status">{{ eventStatus[2] }}</span>
    </div>
    <div class="event-assess">
      <div class="start-time">
        {{
          parseTime(
            Number(String(eventInfo.start_time).padEnd(13, "0")),
            "{y}-{m}-{d}",
          )
        }}
      </div>
      <div class="star-box">
        <LazyImage
          v-for="level in Number(eventInfo.level)"
          :key="level"
          :img-url="starImage"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.not-margin {
  margin-left: 0 !important;
}
.end-card {
  &:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: #181c2280;
    z-index: 10;
  }
}
.ScheduleCard {
  &:hover {
    transform: scale(1.02);
  }
  transition: transform 0.2s ease-in-out;
  width: 32%;
  margin-left: 2%;
  margin-bottom: 20px;
  position: relative;
  height: 210px;
  overflow: hidden;
  cursor: url("@/assets/icons/home_mouse.png"), auto;
  .banner-bg {
    height: 210px;
    width: 100%;
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
  }
  .event-assess {
    position: absolute;
    z-index: 2;
    bottom: 24px;
    left: 56px;
    .start-time {
      font-family: Gotham-Medium, PingFangSC-Medium, monospace;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.6);
      font-weight: 500;
    }
    .star-box {
      display: flex;
      .lazy-image {
        height: 24px;
        width: 24px;
      }
    }
  }
  .event-info {
    position: absolute;
    z-index: 2;
    top: 48px;
    left: 18px;
  }
  .event-title {
    width: 180px;
    display: flex;
    align-items: center;
    font-family: PingFangSC-Medium, monospace;
    font-size: 16px;
    color: #ffffff;
    font-weight: 500;
    .lazy-image {
      height: 32px;
      width: 32px;
      margin-right: 8px;
      flex-shrink: 0;
    }
    .event-name {
      flex-grow: 1;
      white-space: pre-wrap;
    }
  }
  .event-status {
    font-family: PingFangSC-Regular, PingFangSC-Medium, monospace;
    font-size: 12px;
    color: #ffffff;
    padding: 8px 16px;
    background-color: var(--status-bg);
    border-radius: 4px;
    margin-left: 42px;
  }
}
</style>
