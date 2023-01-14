<template>
  <div class="detail-item">
    <div class="play-name">{{ playInfo.play_name }}</div>
    <div class="bottom">
      <template v-for="(team, index) in playInfo.team_points" :key="team.id">
        <TeamBox :play-info="playInfo" :index="index" />
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import TeamBox from "./TeamBox.vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "ia-detail-item",
  components: { TeamBox },
  props: {
    playInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  setup() {
    return {};
  },
});
</script>

<style scoped lang="scss">
.detail-item {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  .play-name {
    height: 52px;
    line-height: 52px;
    font-family: PingFangSC-Regular, PingFangSC-Medium, monospace;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.6);
    font-weight: 400;
  }
  .bottom {
    display: flex;
    align-content: center;
    justify-content: space-between;
    width: 100%;
    flex-wrap: wrap;
  }
}
</style>
