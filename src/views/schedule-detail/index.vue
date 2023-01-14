<template>
  <div class="schedule-detail">
    <ScheduleDetailHeader />
    <div class="bottom-box">
      <ScheduleDetailContent v-if="initData" />
    </div>
    <div class="footer"></div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, provide, ref } from "vue";
import ScheduleDetailHeader from "./components/schedule-detail-header/index.vue";
import ScheduleDetailContent from "./components/schedule-detail-content/index.vue";
import { useRoute } from "vue-router";
import { getEventDetailFun } from "@/api/store-game-schedule";
export default defineComponent({
  name: "ScheduleDetail",
  components: { ScheduleDetailHeader, ScheduleDetailContent },
  setup() {
    //赛事详情
    let eventDetail = ref({});

    const route = useRoute();

    const initData = ref(false);

    // 获取赛事详情
    function getEventDetail() {
      getEventDetailFun(route.query as any)
        .then((res: any) => {
          if (+res.data.code === 1) {
            eventDetail.value = res.data.data;
          }
        })
        .finally(() => {
          setTimeout(() => {
            initData.value = true;
          }, 10);
        });
    }

    provide(
      "eventDetail",
      computed(() => eventDetail.value)
    );

    onMounted(() => {
      getEventDetail();
    });
    return { initData };
  },
});
</script>

<style lang="scss" scoped>
.schedule-detail {
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
    background: var(--color-bg-primary);
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
