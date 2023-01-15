<script lang="ts">
import { computed, defineAsyncComponent, defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import videoAndAnimationHook from '@/hooks/videoAndAnimationHook'
const HotTeamBox = defineAsyncComponent(() => import('./components/TeamBox.vue'))
const HotBaseInfoBox = defineAsyncComponent(
  () => import('./components/BaseInfoBox.vue'),
)
const HotFavoriteAndPointBox = defineAsyncComponent(
  () => import('./components/FavoriteAndPointBox.vue'),
)

const HotPlayNameBox = defineAsyncComponent(
  () => import('./components/PlayNameBox.vue'),
)
export default defineComponent({
  name: 'HotBoxItem',
  components: { HotTeamBox, HotFavoriteAndPointBox, HotPlayNameBox, HotBaseInfoBox },
  props: {
    matchInfo: {
      type: Object,
      default: () => {
        return {}
      },
    },
    bg: {
      type: String,
      default: new URL('@/assets/banner/wzry_01.png', import.meta.url).href,
    },
  },
  setup(props) {
    const hasPlayInfo = computed(() => {
      return (
        !(Array.isArray(props.matchInfo.recommend_play))
        && props.matchInfo.recommend_play.id
      )
    })

    const { videoHas, animationHas } = videoAndAnimationHook(props.matchInfo)

    const router = useRouter()

    function toMatchDetail() {
      const query: any = {
        game_id: props.matchInfo.id,
        category_id: props.matchInfo.category_id,
        betType: 'single',
      }
      if (hasPlayInfo.value) {
        query.match = props.matchInfo.recommend_play.match
      }
      router.push({
        name: 'MatchDetail',
        query,
      })
    }

    const videoIcon = new URL('@/assets/icons/live.png', import.meta.url).href

    const animateIcon = new URL('@/assets/icons/score.png', import.meta.url)
      .href

    return {
      hasPlayInfo,
      videoHas,
      animationHas,
      toMatchDetail,
      videoIcon,
      animateIcon,
    }
  },
})
</script>

<template>
  <div class="hot-box-item" @click.stop="toMatchDetail">
    <div class="bg-image">
      <LazyImage :img-url="bg" />
    </div>
    <div class="video-animate">
      <LazyImage v-if="videoHas" :img-url="videoIcon" />
      <LazyImage v-if="animationHas" :img-url="animateIcon" />
    </div>
    <div class="top">
      <HotTeamBox
        :key="hasPlayInfo ? `${matchInfo.recommend_play.id}0` : 0"
        :item-info="matchInfo"
        :index="0"
      />
      <HotPlayNameBox :item-info="matchInfo" />
      <HotTeamBox
        :key="hasPlayInfo ? `${matchInfo.recommend_play.id}1` : 1"
        :item-info="matchInfo"
        :index="1"
      />
    </div>
    <div class="bottom">
      <!-- suppress JSUnresolvedVariable -->
      <HotBaseInfoBox
        :base-info="{
          bo: matchInfo.matches,
          eventName: matchInfo.event_name || 'IA ESPORT',
          isLive: +matchInfo.category_id === 3,
          logo: matchInfo.game_logo,
        }"
      />
      <HotFavoriteAndPointBox
        :info="{
          id: matchInfo.id,
          pointsCount: matchInfo.play_count,
          isKeep: matchInfo.is_favorite,
        }"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.hot-box-item {
  height: 190px;
  background-image: url("../../assets/images/img_bg.png");
  background-size: 100% 100%;
  width: calc(33.33% - 10px);
  border-radius: 8px;
  cursor: url("../../assets/icons/home_mouse.png"), auto;
  padding: 8px 16px;
  position: relative;
  & + .hot-box-item {
    margin-left: 16px;
  }
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .video-animate {
    position: absolute;
    top: 16px;
    right: 16px;
    display: flex;
    .lazy-image {
      height: 24px;
      width: 24px;
      & + .lazy-image {
        margin-left: 8px;
      }
    }
  }
  .top {
    flex-grow: 1;
    overflow-x: visible;
    //overflow-y: hidden;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding: 0 0 8px;
  }
  .bottom {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: PingFangSC-Regular, PingFangSC-Medium, monospace;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.6);
    font-weight: 400;
  }
  .bg-image {
    width: 100%;
    position: absolute;
    top: -28px;
    display: flex;
    justify-content: center;
    overflow: hidden;
    margin-left: -16px;
    z-index: 0;
    .lazy-image {
      width: 314px;
    }
  }
}
</style>
