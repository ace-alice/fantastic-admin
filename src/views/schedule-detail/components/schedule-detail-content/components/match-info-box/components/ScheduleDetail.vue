<script lang="ts">
import type { Ref } from 'vue'
import { defineComponent, onMounted, ref } from 'vue'
import GroupMatches from './GroupMatches.vue'
import Knockout from './Knockout.vue'
import { getScheduleDetailFun } from '@/api/store-game-schedule'

export default defineComponent({
  name: 'ScheduleDetail',
  components: { GroupMatches, Knockout },
  props: {
    detail: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  setup(props: any) {
    const initData = ref(false)

    const scheduleDetail: Ref<any[] | any> = ref([])

    const componentName = ref('')

    // 获取赛事详情
    function getScheduleDetail() {
      getScheduleDetailFun(props.detail as any).then((res: any) => {
        if (res.data.code === 1) {
          scheduleDetail.value = res.data.data
          if (Array.isArray(scheduleDetail.value)) {
            componentName.value = 'GroupMatches'
          }
          else {
            componentName.value = 'knockout'
          }
          initData.value = true
        }
      })
    }

    onMounted(async () => {
      await getScheduleDetail()
    })

    return { initData, scheduleDetail, componentName }
  },
})
</script>

<template>
  <div class="ScheduleDetail">
    <keep-alive v-if="initData">
      <component :is="componentName" :info="scheduleDetail" />
    </keep-alive>
  </div>
</template>

<style lang="scss" scoped>
.ScheduleDetail {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>
