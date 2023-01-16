<script lang="ts">
import { computed, defineAsyncComponent, defineComponent, inject } from 'vue'
import { useRouter } from 'vue-router'
import videoAndAnimationHook from '@/hooks/videoAndAnimationHook'
const UnTeamBox = defineAsyncComponent(() => import('./components/TeamBox.vue'))
const UnBaseInfoBox = defineAsyncComponent(
  () => import('./components/BaseInfoBox.vue'),
)
const UnFavoriteAndPointBox = defineAsyncComponent(
  () => import('./components/FavoriteAndPointBox.vue'),
)
const UnLogoDateBox = defineAsyncComponent(
  () => import('./components/LogoDateBox.vue'),
)
const UnPlayNameBox = defineAsyncComponent(
  () => import('./components/PlayNameBox.vue'),
)

export default defineComponent({
  name: 'UniversalBetItem',
  components: {
    UnTeamBox,
    UnBaseInfoBox,
    UnFavoriteAndPointBox,
    UnLogoDateBox,
    UnPlayNameBox,
  },
  props: {
    matchInfo: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  setup(props) {
    const router = useRouter()

    const hasPlayInfo = computed(() => {
      return (
        !(Array.isArray(props.matchInfo.recommend_play))
        && props.matchInfo.recommend_play.id
      )
    })

    const { videoHas, animationHas } = videoAndAnimationHook(props.matchInfo)

    const betType = inject('betType', 'single')

    function toMatchDetail() {
      const query: any = {
        game_id: props.matchInfo.id,
        betType,
      }
      if (hasPlayInfo.value) {
        query.match = props.matchInfo.recommend_play.match
      }
      router.push({
        name: 'MatchDetail',
        query,
      })
    }

    return { hasPlayInfo, videoHas, animationHas, toMatchDetail }
  },
})
</script>

<template>
  <div class="universal-bet-item" @click.stop="toMatchDetail">
    <UnLogoDateBox
      :data-info="{
        logo: matchInfo.game_type_logo,
        startTime: matchInfo.game_start_time,
        isLive: +matchInfo.category_id === 3,
      }"
    />
    <UnBaseInfoBox
      :base-info="{
        bo: matchInfo.matches,
        eventName: matchInfo.event_name,
        hasVideo: videoHas,
        hasAnimate: animationHas,
      }"
    />
    <UnTeamBox
      :key="hasPlayInfo ? `${matchInfo.recommend_play.id}0` : 0"
      :item-info="matchInfo"
      :index="0"
    />
    <UnPlayNameBox :item-info="matchInfo" />
    <UnTeamBox
      :key="hasPlayInfo ? `${matchInfo.recommend_play.id}1` : 1"
      :item-info="matchInfo"
      :index="1"
    />
    <UnFavoriteAndPointBox
      :info="{
        id: matchInfo.id,
        pointsCount: matchInfo.play_count,
        isKeep: matchInfo.is_favorite,
      }"
    />
  </div>
</template>

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
