<template>
  <div class="schedule-detail-content">
    <TeamBox @setFlag="setFlag" />
    <MatchInfoBox @setFlag="setFlag" />
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineAsyncComponent,
  defineComponent,
  getCurrentInstance,
  provide,
  Ref,
  ref,
} from "vue";
import { ElScrollbar } from "element-plus";
const TeamBox = defineAsyncComponent(
  () => import("./components/team-box/index.vue")
);
const MatchInfoBox = defineAsyncComponent(
  () => import("./components/match-info-box/index.vue")
);

export default defineComponent({
  name: "schedule-detail-content",
  components: { TeamBox, MatchInfoBox },
  setup() {
    const detailContentRef: Ref<InstanceType<typeof ElScrollbar> | null> =
      ref(null);
    function scrollHandle({ scrollTop }: any) {
      console.log(scrollTop);
    }

    const openFlag = ref("team");

    provide(
      "openFlag",
      computed(() => openFlag.value)
    );

    const { proxy }: any = getCurrentInstance();

    function setFlag(flag: string) {
      if (openFlag.value === flag) {
        openFlag.value = "";
        return;
      }
      openFlag.value = flag;
      if (openFlag.value === "info") {
        proxy.mittBus.emit("shortHeaderBus", true);
      } else {
        proxy.mittBus.emit("shortHeaderBus", false);
      }
    }

    return { scrollHandle, detailContentRef, setFlag };
  },
});
</script>

<!--suppress CssInvalidPseudoSelector -->
<style lang="scss" scoped>
.schedule-detail-content {
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 14px 28px;
  position: relative;
}
</style>
