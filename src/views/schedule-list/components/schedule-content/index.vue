<template>
  <div class="schedule-content" v-if="currentEventList.length > 0">
    <el-scrollbar ref="scrollbarRef" @scroll="scrollHandle">
      <div class="event-box">
        <ScheduleCard
          v-for="(event, index) in currentEventList"
          :key="event.id"
          :eventInfo="event"
          :index="index"
        />
      </div>
    </el-scrollbar>
  </div>
  <EmptyBox type="event" v-else />
  <ToTopBox @toTop="toTopHandle" v-if="hasToTop" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { storeToRefs } from "pinia";
import { scheduleInfoStore } from "@/store/scheduleInfo";
import ScheduleCard from "@/views/schedule-list/components/schedule-content/components/ScheduleCard.vue";
import EmptyBox from "@/components/Empty/index.vue";
import matchListToTopHook from "@/hooks/matchListToTopHook";
import ToTopBox from "@/components/ToTopBox/index.vue";

export default defineComponent({
  name: "schedule-content",
  components: { ScheduleCard, EmptyBox, ToTopBox },
  setup() {
    const { currentEventList } = storeToRefs(scheduleInfoStore());

    const { toTopHandle, scrollbarRef, scrollHandle, hasToTop } =
      matchListToTopHook("ScheduleList");

    return {
      currentEventList,
      toTopHandle,
      scrollbarRef,
      scrollHandle,
      hasToTop,
    };
  },
});
</script>

<!--suppress CssInvalidPseudoSelector -->
<style lang="scss" scoped>
.schedule-content {
  width: 100%;
  overflow-y: auto;
  &:deep(.el-scrollbar) {
    .el-scrollbar__wrap {
      scroll-behavior: smooth;
    }
    .el-scrollbar__thumb {
      background-color: #fe5e00;
    }
  }
  .event-box {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    padding: 0 6px;
  }
}
.ia-empty {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0;
}
</style>
