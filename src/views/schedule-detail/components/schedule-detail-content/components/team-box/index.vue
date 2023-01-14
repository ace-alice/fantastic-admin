<template>
  <div class="team-box" :class="{ 'close-team-box': openFlag !== 'team' }">
    <div class="box-switch" @click.stop="shrinkBox">
      <div>{{ $t("game_teams") }}</div>
      <div
        :class="{
          'switch-btn': true,
          'switch-close': openFlag !== 'team',
        }"
      >
        <LazyImage :img-url="prevImg" />
      </div>
    </div>
    <div class="team-list">
      <div ref="teamListRef">
        <div class="list-tab-title">{{ $t("invite_team") }}</div>
        <div class="list-tab-box">
          <div
            :class="{ 'team-info': true, 'has-margin': index % 5 !== 0 }"
            v-for="(team, index) in teamList[0]"
            :key="team.id"
          >
            <div class="team-info-logo-box">
              <LazyImage :img-url="team.logo" />
            </div>
            <div class="team-info-name">{{ team["team_name"] }}</div>
          </div>
        </div>
        <div class="list-tab-title">{{ $t("promotion_team") }}</div>
        <div class="list-tab-box">
          <div
            :class="{ 'team-info': true, 'has-margin': index % 5 !== 0 }"
            v-for="(team, index) in teamList[1]"
            :key="team.id"
          >
            <div class="team-info-logo-box">
              <LazyImage :img-url="team.logo" />
            </div>
            <div class="team-info-name">{{ team["team_name"] }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, onMounted, Ref, ref } from "vue";
import { getTeamListFun } from "@/api/store-game-schedule";

export default defineComponent({
  name: "team-box",
  components: {},
  emits: ["setFlag"],
  setup(props: any, { emit }: any) {
    //队伍信息
    const teamList = ref([]);

    const teamListRef: Ref<HTMLDivElement | null> = ref(null);

    const eventDetail: any = inject("eventDetail");

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const prevImg = new URL("@/assets/icons/turn-on.png" ,import.meta.url).href;

    //获取队伍列表信息
    function getTeamList() {
      getTeamListFun({ event_id: eventDetail.value.id }).then((res: any) => {
        if (+res.data.code === 1) {
          teamList.value = res.data.data;
        }
      });
    }

    function shrinkBox() {
      emit("setFlag", "team");
    }

    const openFlag = inject("openFlag", "");

    onMounted(() => {
      getTeamList();
    });
    return {
      teamList,
      teamListRef,
      shrinkBox,
      openFlag,
      prevImg,
    };
  },
});
</script>

<style lang="scss" scoped>
.close-team-box {
  height: 62px !important;
}
.team-box {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  max-height: calc(100% - 62px);
  overflow: auto;
  transition: all 0.3s ease-in-out;
  padding-top: 62px;
  .team-list {
    font-family: PingFangSC-Regular, PingFangSC-Medium, monospace;
    transition: all 0.3s ease-in-out;
    overflow: auto;
    .list-tab-title {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.6);
    }
    .list-tab-box {
      width: 94%;
      margin: 24px auto 24px;
      display: flex;
      flex-wrap: wrap;
      .has-margin {
        margin-left: 1.2%;
      }
      .team-info {
        width: 19%;
        margin-bottom: 12px;
        .team-info-logo-box {
          height: 60px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 6px;
          margin-bottom: 12px;
          display: flex;
          justify-content: center;
          align-items: center;
          .lazy-image {
            height: 48px;
            width: 48px;
          }
        }
        .team-info-name {
          text-align: center;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.8);
        }
      }
    }
  }
  .box-switch {
    position: absolute;
    width: 100%;
    top: 14px;
    background: var(--color-bg-primary);
    z-index: 100;
    left: 0;
    padding: 0 26px;
    height: 62px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: PingFangSC-Regular, PingFangSC-Medium, monospace;
    font-size: 16px;
    color: #ffffff;
    cursor: url("~@/assets/icons/home_mouse.png"), auto;
    .switch-close {
      transform: rotate(90deg) !important;
    }
    .switch-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      overflow: hidden;
      height: 32px;
      width: 32px;
      background: rgba(255, 255, 255, 0.05);
      transform: rotate(-90deg);
      transition: all 0.3s ease-in-out;
      .lazy-image {
        height: 24px;
        width: 24px;
      }
    }
  }
}
</style>
