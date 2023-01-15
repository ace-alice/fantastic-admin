<script lang="ts">
import {
  defineComponent,
  getCurrentInstance,
  inject,
  onMounted,
  onUnmounted,
  ref,
} from 'vue'
import useImageResource from '@/hooks/useImageResource'
import useRouteHook from '@/hooks/useRouteHook'
import { parseTime } from '@/utils'

export default defineComponent({
  name: 'ScheduleDetailHeader',
  components: {},
  setup() {
    const { prevImg } = useImageResource()
    const { routerJump } = useRouteHook()
    const goBack = () => {
      routerJump('ScheduleList')
    }

    const shortHeader = ref(false)

    const eventDetail: any = inject('eventDetail', {})

    const { proxy }: any = getCurrentInstance()

    onMounted(() => {
      proxy.mittBus.on('shortHeaderBus', (tag: boolean) => {
        shortHeader.value = tag
      })
    })

    onUnmounted(() => {
      proxy.mittBus.off('shortHeaderBus')
    })

    return { prevImg, goBack, eventDetail, parseTime, shortHeader }
  },
})
</script>

<template>
  <div class="schedule-detail-header" :class="{ 'short-header': shortHeader }">
    <LazyImage :img-url="prevImg" class="back-btn" @click.stop="goBack" />
    <div class="schedule-title-1">
      {{ $t("competition") }}
    </div>
    <div class="detail-header-box">
      <div class="detail-info">
        <div class="event-title">
          <LazyImage img-url="''" />
          <div>{{ eventDetail.event_name }}</div>
        </div>
        <template v-if="!shortHeader">
          <div>
            <span v-if="eventDetail.start_time">{{
              parseTime(eventDetail.start_time * 1000, "{y}-{m}-{d}")
            }}</span>
            <span class="to-tg">{{ $t("to") }}</span>
            <span v-if="eventDetail.end_time">{{
              parseTime(eventDetail.end_time * 1000, "{y}-{m}-{d}")
            }}</span>
          </div>
          <div>{{ $t("venue") }}: {{ eventDetail.host_location }}</div>
          <div>{{ $t("organizer") }}: {{ eventDetail.host }}</div>
          <div>
            {{ $t("competition_system") }}:
            {{ eventDetail.institution_name }}
          </div>
        </template>
      </div>
      <div v-show="!shortHeader" class="detail-bonus">
        <div>{{ eventDetail.bonus }}</div>
        <div>{{ $t("tot_bonus") }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.short-header {
  height: 82px !important;
  padding: 0 100px !important;
  align-items: center;
  .detail-header-box {
    .detail-info .event-title {
      justify-content: center;
    }
  }
}
.schedule-detail-header {
  height: 220px;
  background-image: url("../../../../assets/images/schedule-header-bg.png");
  background-size: 1088px 220px;
  flex-shrink: 0;
  margin: 16px 0;
  overflow: hidden;
  position: relative;
  z-index: 2;
  display: flex;
  padding: 57px 100px;
  font-family: PingFangSC-Regular, PingFangSC-Medium, monospace;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  transition: all 0.4s ease-in-out;

  .detail-header-box {
    display: flex;
    justify-content: center;
    flex-grow: 1;
    .detail-info {
      flex-grow: 1;
      .event-title {
        & + div {
          margin-top: 8px;
        }
        display: flex;
        align-items: center;
        font-size: 16px;
        color: #ffffff;
        .lazy-image {
          height: 32px;
          width: 32px;
          margin-right: 16px;
        }
      }
      .to-tg {
        margin: 0 16px;
      }
    }
    .detail-bonus {
      flex-shrink: 0;
      div:nth-child(1) {
        font-family: Gotham-Medium, PingFangSC-Medium, monospace;
        font-size: 24px;
        color: #fecb00;
        font-weight: 500;
      }
      div:nth-child(2) {
        color: #ffffff;
        margin-top: 6px;
        text-align: right;
      }
    }
  }
  .back-btn {
    position: absolute;
    height: 30px;
    width: 30px;
    top: 12px;
    left: 16px;
    transition: all 0.25s ease-in-out;
    cursor: url("~@/assets/icons/home_mouse.png"), auto;
  }
  .schedule-title-1 {
    position: absolute;
    top: 14px;
    left: 72px;
    font-family: PingFangSC-Regular, PingFangSC-Medium, monospace;
    font-size: 16px;
    color: #ffffff;
  }
}
</style>
