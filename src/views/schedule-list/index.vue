<script lang="ts">
import { defineComponent } from 'vue'
import ScheduleHeader from './components/schedule-header/index.vue'
import ScheduleContent from './components/schedule-content/index.vue'
export default defineComponent({
  name: 'ScheduleList',
  components: { ScheduleHeader, ScheduleContent },
  setup() {
    return {}
  },
})
</script>

<template>
  <div class="schedule-list">
    <ScheduleHeader />
    <div class="bottom-box">
      <ScheduleContent />
    </div>
    <div class="footer" />
  </div>
</template>

<style lang="scss" scoped>
.schedule-list {
  display: flex;
  flex-direction: column;
  align-items: center;

  color: #ffffff;
  line-height: 28px;

  & > div {
    width: 97.4%;
  }
  .footer {
    height: 13px;
    flex-shrink: 0;
  }
  .bottom-box {
    flex-grow: 1;
    overflow: hidden;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.15);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
  }
  .footer {
    height: 13px;
    flex-shrink: 0;
  }
}
</style>
