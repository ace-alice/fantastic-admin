<template>
  <div
    class="tools-item"
    @click.stop="openDialog"
    v-tooltip="{ width: 10, message: $t('v_run_chart') }"
  >
    {{ $t("v_run_chart") }}
  </div>
  <el-dialog
    v-model="dialogVisible"
    class="virtual-rule"
    :title="$t('v_run_chart')"
    :center="true"
    width="70%"
  >
    <div>
      <div class="trend-title">{{ $t("v_winner") }}</div>
      <div class="trend-box">
        <div
          v-for="(info, index) in chartWin"
          :key="index"
          class="trend-box-item"
        >
          <svg-icon :name="chartWinIcon('win', info['team_type'])" size="1.5" />
        </div>
      </div>
      <div class="trend-title">{{ $t("v_first_blood") }}</div>
      <div class="trend-box">
        <div
          v-for="(info, index) in chartAblood"
          :key="index"
          class="trend-box-item"
        >
          <!-- <el-image
            :src="chartWinIcon('ablood', info.team_type)"
            fit="contain"
          ></el-image> -->
          <svg-icon
            :name="chartWinIcon('ablood', info['team_type'])"
            size="1.5"
          />
        </div>
      </div>
      <div class="trend-title">{{ $t("v_first_dragon_slay") }}</div>
      <div class="trend-box">
        <div
          v-for="(info, index) in chartFirstKill"
          :key="index"
          class="trend-box-item"
        >
          <!-- <el-image
            :src="chartWinIcon('firstKill', info.team_type)"
            fit="contain"
          ></el-image> -->
          <svg-icon
            :name="chartWinIcon('firstKill', info['team_type'])"
            size="1.5"
          />
        </div>
      </div>
      <div class="trend-title">{{ $t("v_first_slain_dragon_element") }}</div>
      <div class="trend-box">
        <div
          v-for="(info, index) in chartElement"
          :key="index"
          class="trend-box-item"
        >
          <!-- <el-image
            :src="elementDragon(info.team_type)"
            fit="contain"
          ></el-image> -->
          <svg-icon :name="elementDragon(info['team_type'])" size="1.5" />
        </div>
      </div>
      <div class="trend-title">{{ $t("v_if_there_will_be_penta_kill") }}</div>
      <div class="trend-box">
        <div
          v-for="(info, index) in chartPentaKill"
          :key="index"
          class="trend-box-item"
        >
          <svg-icon
            :name="chartWinIcon('pentaKill', info['team_type'])"
            size="1.5"
          />
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { getVirCharts } from "@/api/virtual";
import { defineComponent, reactive, ref, toRefs } from "vue";

export default defineComponent({
  setup() {
    function elementDragon(type: number | string) {
      return `element_${type}`;
    }

    function chartWinIcon(name: string, type: number | string) {
      return `${name}_${type}`;
    }

    const dialogVisible = ref(false);

    function openDialog() {
      getVirChartsFun();
    }

    //游戏规则
    const trendInfo = reactive({
      chartWin: [],
      chartAblood: [],
      chartFirstKill: [],
      chartElement: [],
      chartPentaKill: [],
    });
    //获取游戏规则
    function getVirChartsFun() {
      getVirCharts()
        .then((res: any) => {
          if (+res.data.status === 1) {
            trendInfo.chartWin = res.data.data.type1;
            trendInfo.chartAblood = res.data.data.type2;
            trendInfo.chartFirstKill = res.data.data.type3;
            trendInfo.chartElement = res.data.data.type4;
            trendInfo.chartPentaKill = res.data.data.type5;
          }
        })
        .finally(() => {
          dialogVisible.value = true;
        });
    }

    return {
      dialogVisible,
      openDialog,
      ...toRefs(trendInfo),
      elementDragon,
      chartWinIcon,
    };
  },
});
</script>

<!--suppress CssInvalidFunction -->
<style lang="scss" scoped>
@media screen and (max-width: 1199px) {
  .tools-item {
    --px_100: 1200px/19;
  }
}
@media only screen and (min-width: 1200px) and (max-width: 1600px) {
  .tools-item {
    --px_100: 100vw/19;
  }
}

@media screen and (min-width: 1601px) {
  .tools-item {
    --px_100: 1600px/19;
  }
}
.tools-item {
  flex-shrink: 0;
  height: calc(0.6 * var(--px_100));
  width: calc(0.8 * var(--px_100));
  font-size: calc(0.2 * var(--px_100));
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  cursor: url("~@/assets/icons/home_mouse.png"), auto;
  .test {
    position: relative;
    left: 0;
    filter: drop-shadow(#f5c24c 80px 0);
  }
  &:hover {
    .test {
      left: -80px;
    }
  }
}
.active {
  .test {
    left: -80px;
  }
}
</style>
