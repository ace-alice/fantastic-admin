<script lang="ts">
import { defineComponent } from 'vue'
import { storeToRefs } from 'pinia'
import useImageResource from '@/hooks/useImageResource'
import useRouteHook from '@/hooks/useRouteHook'
import { scheduleInfoStore } from '@/store/scheduleInfo'

export default defineComponent({
  name: 'ScheduleHeader',
  components: {},
  setup() {
    const { prevImg } = useImageResource()
    const { routerJump } = useRouteHook()

    const { currentZoneList, currentZoneId } = storeToRefs(scheduleInfoStore())
    const { changeCurrentZoneId } = scheduleInfoStore()

    const goBack = () => {
      routerJump('MatchList')
    }

    return {
      prevImg,
      goBack,
      currentZoneList,
      currentZoneId,
      changeCurrentZoneId,
    }
  },
})
</script>

<template>
  <div class="schedule-header">
    <LazyImage :img-url="prevImg" class="back-btn" @click.stop="goBack" />
    <div class="schedule-title-1">
      {{ $t("schedule") }}
    </div>
    <div class="zone-tabs">
      <div
        v-for="event in currentZoneList" :key="event.zone_id"
        class="zone-tab"
        :class="{
          'active-tab': currentZoneId === event.zone_id,
        }"
        @click.stop="changeCurrentZoneId(event.zone_id)"
      >
        <div class="zone-tag">
          {{ event.zone_name }}
        </div>
        <!--        <div>{{ event["zone_name"] }}</div> -->
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.schedule-header {
  height: 98px;
  background-image: url("../../../../assets/images/schedule-header-bg.png");
  background-size: 1088px 220px;
  flex-shrink: 0;
  margin: 16px 0;
  overflow: hidden;
  position: relative;
  z-index: 2;
  display: flex;
  align-items: flex-end;
  padding: 16px 72px;
  .zone-tabs {
    width: 100%;
    display: flex;
    align-items: center;
    .active-tab {
      .zone-tag {
        background: #fe5e00 !important;
      }
    }
    .zone-tab {
      cursor: url("~@/assets/icons/home_mouse.png"), auto;
      .zone-tag {
        height: 24px;
        padding: 0 24px;
        line-height: 24px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 17px;
        font-size: 16px;
        color: #ffffff;
        font-weight: 500;
      }
    }
    & + .zone-tab {
      margin-left: 40px;
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
