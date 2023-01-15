<script lang="ts">
import { defineComponent } from 'vue'
import { storeToRefs } from 'pinia'
import { scheduleInfoStore } from '@/store/scheduleInfo'
import ScheduleGameItem from '@/layout/sidebar/components/ScheduleSidebar/components/ScheduleGameItem.vue'

export default defineComponent({
  name: 'ScheduleSidebar',
  components: { ScheduleGameItem },
  setup() {
    const { gameScheduleList } = storeToRefs(scheduleInfoStore())

    return { gameScheduleList }
  },
})
</script>

<template>
  <div class="schedule-sidebar">
    <el-scrollbar>
      <ScheduleGameItem
        v-for="(item, index) in gameScheduleList"
        :key="item.id"
        :item-info="item"
        :style="{ '--margin-top': `${48 + index * 5}px` }"
      />
    </el-scrollbar>
  </div>
</template>

<style lang="scss" scoped>
.schedule-sidebar {
  background: #373e46;
  border-radius: 0 26px 26px 0;
  overflow: hidden;
  width: 304px;
}
</style>
