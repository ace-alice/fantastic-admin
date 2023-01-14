<template>
  <div class="universal-bet-item" @click.stop="toMatchDetail">
    <LogoDateBox
      :dataInfo="{
        logo: matchInfo.game_logo,
        startTime: matchInfo.game_start_time,
        isLive: +matchInfo.category_id === 3,
      }"
    />
    <BaseInfoBox
      :baseInfo="{
        bo: matchInfo.bo,
        eventName: matchInfo.event_name,
        hasVideo: videoHas,
        hasAnimate: animationHas,
      }"
    />
    <TeamBox
      :itemInfo="matchInfo"
      :key="hasPlayInfo ? `${matchInfo.recommend_play.id}0` : 0"
      :index="0"
    />
    <PlayNameBox :itemInfo="matchInfo" />
    <TeamBox
      :itemInfo="matchInfo"
      :index="1"
      :key="hasPlayInfo ? `${matchInfo.recommend_play.id}1` : 1"
    />
    <FavoriteAndPointBox
      :info="{
        id: matchInfo.id,
        pointsCount: matchInfo['team_count'],
        isKeep: matchInfo.is_favorite,
      }"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineAsyncComponent, defineComponent, inject } from "vue";
import videoAndAnimationHook from "@/hooks/videoAndAnimationHook";
import { useRouter } from "vue-router";
const TeamBox = defineAsyncComponent(() => import("./components/TeamBox.vue"));
const BaseInfoBox = defineAsyncComponent(
  () => import("./components/BaseInfoBox.vue")
);
const FavoriteAndPointBox = defineAsyncComponent(
  () => import("./components/FavoriteAndPointBox.vue")
);
const LogoDateBox = defineAsyncComponent(
  () => import("./components/LogoDateBox.vue")
);
const PlayNameBox = defineAsyncComponent(
  () => import("./components/PlayNameBox.vue")
);

export default defineComponent({
  name: "UniversalBetItem",
  components: {
    TeamBox,
    BaseInfoBox,
    FavoriteAndPointBox,
    LogoDateBox,
    PlayNameBox,
  },
  props: {
    matchInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  setup(props) {
    const router = useRouter();

    const hasPlayInfo = computed(() => {
      return (
        !(props.matchInfo.recommend_play instanceof Array) &&
        props.matchInfo.recommend_play.id
      );
    });

    const { videoHas, animationHas } = videoAndAnimationHook(props.matchInfo);

    const betType = inject("betType", "single");

    function toMatchDetail() {
      let query: any = {
        game_id: props.matchInfo.id,
        betType,
      };
      if (hasPlayInfo.value) {
        query.match = props.matchInfo.recommend_play.match;
      }
      router.push({
        name: "MatchDetail",
        query,
      });
    }

    return { hasPlayInfo, videoHas, animationHas, toMatchDetail };
  },
});
</script>

<style lang="scss" scoped>
.universal-bet-item {
  width: 100%;
  height: 88px;
  background: var(--color-bg-primary);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  cursor: url("../../assets/icons/home_mouse.png"), auto;
  transition: all 0.15s ease-in-out;
  & + .universal-bet-item {
    margin-top: 4px;
  }
  &:hover {
    background: #333b42;
  }
}
</style>
