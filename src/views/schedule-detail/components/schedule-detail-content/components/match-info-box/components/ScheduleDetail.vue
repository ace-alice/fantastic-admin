<template>
  <div class="ScheduleDetail">
    <keep-alive v-if="initData">
      <component :is="componentName" :info="scheduleDetail"></component>
    </keep-alive>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, Ref, ref } from "vue";
import { getScheduleDetailFun } from "@/api/store-game-schedule";
import GroupMatches from "./GroupMatches.vue";
import Knockout from "./Knockout.vue";

export default defineComponent({
  name: "ScheduleDetail",
  components: { GroupMatches, Knockout },
  props: {
    detail: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  setup(props: any) {
    const initData = ref(false);

    const scheduleDetail: Ref<any[] | any> = ref([]);

    const componentName = ref("");

    // 获取赛事详情
    function getScheduleDetail() {
      getScheduleDetailFun(props.detail as any).then((res: any) => {
        if (res.data.code === 1) {
          scheduleDetail.value = res.data.data;
          if (scheduleDetail.value instanceof Array) {
            componentName.value = "GroupMatches";
          } else {
            componentName.value = "knockout";
          }
          initData.value = true;
        }
      });
    }

    onMounted(async () => {
      await getScheduleDetail();
    });

    return { initData, scheduleDetail, componentName };
  },
});
</script>

<style lang="scss" scoped>
.ScheduleDetail {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>
