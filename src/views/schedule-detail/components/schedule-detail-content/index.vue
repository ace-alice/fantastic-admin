<script lang="ts">
import type { Ref } from 'vue'
import {
  computed,
  defineAsyncComponent,
  defineComponent,
  getCurrentInstance,
  provide,
  ref,
} from 'vue'
import type { ElScrollbar } from 'element-plus'
const ScheduleTeamBox = defineAsyncComponent(
  () => import('./components/team-box/index.vue'),
)
const ScheduleMatchInfoBox = defineAsyncComponent(
  () => import('./components/match-info-box/index.vue'),
)

export default defineComponent({
  name: 'ScheduleDetailContent',
  components: { ScheduleTeamBox, ScheduleMatchInfoBox },
  setup() {
    const detailContentRef: Ref<InstanceType<typeof ElScrollbar> | null>
      = ref(null)
    function scrollHandle({ scrollTop }: any) {
      //
    }

    const openFlag = ref('team')

    provide(
      'openFlag',
      computed(() => openFlag.value),
    )

    const { proxy }: any = getCurrentInstance()

    function setFlag(flag: string) {
      if (openFlag.value === flag) {
        openFlag.value = ''
        return
      }
      openFlag.value = flag
      if (openFlag.value === 'info') {
        proxy.mittBus.emit('shortHeaderBus', true)
      }
      else {
        proxy.mittBus.emit('shortHeaderBus', false)
      }
    }

    return { scrollHandle, detailContentRef, setFlag }
  },
})
</script>

<template>
  <div class="schedule-detail-content">
    <ScheduleTeamBox @setFlag="setFlag" />
    <ScheduleMatchInfoBox @setFlag="setFlag" />
  </div>
</template>

<!-- suppress CssInvalidPseudoSelector -->
<style lang="scss" scoped>
.schedule-detail-content {
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 14px 28px;
  position: relative;
}
</style>
