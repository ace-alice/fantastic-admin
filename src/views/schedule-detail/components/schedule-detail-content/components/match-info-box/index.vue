<!-- eslint-disable @typescript-eslint/no-use-before-define -->
<script lang="ts">
import type { Ref } from 'vue'
import { computed, defineComponent, inject, onMounted, ref } from 'vue'
import ScheduleDetail from './components/ScheduleDetail.vue'
import { getEventZonesFun } from '@/api/store-game-schedule'

export default defineComponent({
  name: 'MatchInfoBox',
  components: { ScheduleDetail },
  emits: ['setFlag'],
  setup(props: any, { emit }: any) {
    function shrinkBox() {
      emit('setFlag', 'info')
    }

    const openFlag = inject('openFlag', '')

    const prevImg = new URL('@/assets/icons/turn-on.png', import.meta.url).href

    const initData = ref(false)

    const eventDetail: any = inject('eventDetail', {})

    // 赛事赛制
    const scheduleNameList: Ref<any[]> = ref([])

    // 获取赛事赛制
    function getEventZones() {
      getEventZonesFun({ event_id: eventDetail.value.id }).then((res: any) => {
        if (res.data.code === 1) {
          scheduleNameList.value = res.data.data
          setTimeout(() => {
            if (schedulesList.value[0]?.schedule_id) {
              changeCurrentScheduleChId(schedulesList.value[0]?.schedule_id)
              initData.value = true
            }
          }, 10)
        }
      })
    }

    const currentScheduleIndex = ref(0)

    function changeCurrentScheduleIndex(inx: number) {
      if (currentScheduleIndex.value === inx) {
        return
      }
      currentScheduleIndex.value = inx
      setTimeout(() => {
        if (schedulesList.value[0]?.schedule_id) {
          changeCurrentScheduleChId(schedulesList.value[0]?.schedule_id)
        }
      }, 10)
    }

    const schedulesList = computed(() => {
      return (
        scheduleNameList.value[currentScheduleIndex.value]?.schedules || []
      )
    })

    const currentScheduleChId = ref(0)

    function changeCurrentScheduleChId(id: number) {
      if (currentScheduleChId.value === id) {
        return
      }
      currentScheduleChId.value = id
    }

    onMounted(() => {
      getEventZones()
    })

    return {
      shrinkBox,
      openFlag,
      initData,
      scheduleNameList,
      currentScheduleIndex,
      changeCurrentScheduleIndex,
      schedulesList,
      currentScheduleChId,
      changeCurrentScheduleChId,
      prevImg,
    }
  },
})
</script>

<template>
  <div
    class="match-info-box" :class="{ 'close-info-box': openFlag !== 'info' }"
  >
    <div class="box-switch" @click.stop="shrinkBox">
      <div>{{ $t("game_schedule") }}</div>
      <div
        class="switch-btn" :class="{
          'switch-close': openFlag !== 'info',
        }"
      >
        <LazyImage :img-url="prevImg" />
      </div>
    </div>
    <div class="info-box">
      <div class="schedule-tabs">
        <div
          v-for="(schedule, index) in scheduleNameList" :key="index"
          class="schedule-tab"
          :class="{
            'active-tab': index === currentScheduleIndex,
          }"
          @click.stop="changeCurrentScheduleIndex(index)"
        >
          {{ schedule.zone_name }}
        </div>
      </div>
      <div v-show="schedulesList.length > 1" class="schedule-ch-tabs">
        <div
          v-for="schedule in schedulesList" :key="schedule.schedule_id"
          class="schedule-ch-tab"
          :class="{
            'active-ch-tab': schedule.schedule_id === currentScheduleChId,
          }"
          @click.stop="
            changeCurrentScheduleChId(Number(schedule.schedule_id))
          "
        >
          {{ schedule.schedule_name }}
        </div>
      </div>
      <keep-alive>
        <component
          is="ScheduleDetail"
          v-if="initData"
          :key="`schedule${currentScheduleChId}`"
          :detail="{ schedule_id: currentScheduleChId }"
        />
      </keep-alive>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.close-info-box {
  height: 62px !important;
}
.match-info-box {
  //border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  height: calc(100% - 62px);
  overflow: hidden;
  transition: all 0.3s ease-in-out;
  .info-box {
    height: calc(100% - 62px);
    display: flex;
    flex-direction: column;
    .schedule-ch-tabs {
      flex-shrink: 0;
      height: 54px;
      background: rgba(254, 94, 0, 0.2);
      display: flex;
      justify-content: space-between;
      padding: 0 40px;
      align-items: center;
      font-family: PingFangSC-Regular, PingFangSC-Medium, monospace;
      font-size: 16px;
      color: rgba(255, 255, 255, 0.6);
      .schedule-ch-tab {
        padding: 10px;
        cursor: url("~@/assets/icons/home_mouse.png"), auto;
      }
      .active-ch-tab {
        color: #ffffff;
        font-weight: 500;
      }
    }
    .schedule-tabs {
      display: flex;
      flex-shrink: 0;
      .active-tab {
        background: #1f242c;
        color: #ffffff;
      }
      & > div {
        flex-grow: 1;
        height: 54px;
        line-height: 54px;
        text-align: center;
        background: #1a1f26;
        cursor: url("~@/assets/icons/home_mouse.png"), auto;
        color: rgba(255, 255, 255, 0.6);
      }
    }
  }
  .box-switch {
    height: 62px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: PingFangSC-Regular, PingFangSC-Medium, monospace;
    font-size: 16px;
    color: #ffffff;
    cursor: url("~@/assets/icons/home_mouse.png"), auto;
    .switch-close {
      transform: rotate(90deg) !important;
    }
    .switch-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      overflow: hidden;
      height: 32px;
      width: 32px;
      background: rgba(255, 255, 255, 0.05);
      transform: rotate(-90deg);
      transition: all 0.3s ease-in-out;
      .lazy-image {
        height: 24px;
        width: 24px;
      }
    }
  }
}
</style>
