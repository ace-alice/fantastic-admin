<script lang="ts">
import { computed, defineAsyncComponent, defineComponent } from 'vue'
import { setItemName } from '@/utils'
const ThirdTeamBox = defineAsyncComponent(() => import('./ThirdTeamBox.vue'))

export default defineComponent({
  name: 'PlayNameBoxUn',
  components: { ThirdTeamBox },
  props: {
    itemInfo: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  setup(props) {
    const hasPlayInfo = computed(() => {
      return (
        !(Array.isArray(props.itemInfo.recommend_play))
        && props.itemInfo.recommend_play.id
      )
    })

    const hasTeam3 = computed(() => {
      return (
        hasPlayInfo.value
        && props.itemInfo.recommend_play.team_points
        && props.itemInfo.recommend_play.team_points[2]
      )
    })
    return { hasPlayInfo, hasTeam3, setItemName }
  },
})
</script>

<template>
  <div class="PlayNameBoxUn">
    <ThirdTeamBox v-if="hasTeam3" :index="2" :item-info="itemInfo" />
    <template v-else>
      <div class="score">
        {{ itemInfo.score_1 }} - {{ itemInfo.score_2 }}
      </div>
      <div v-if="hasTeam3 && hasPlayInfo" class="play-name">
        {{ itemInfo.recommend_play.name }}
      </div>
      <div v-if="!hasTeam3 && hasPlayInfo" class="play-name">
        <span
          v-tooltip="{
            width: 53,
            message: `${
              +itemInfo.recommend_play.match !== 0
                ? setItemName(
                  +itemInfo.recommend_play.match,
                  itemInfo.game_lang,
                )
                : ''
            } ${itemInfo.recommend_play.name}`,
          }"
        >
          <span v-if="+itemInfo.recommend_play.match !== 0">{{
            setItemName(+itemInfo.recommend_play.match, itemInfo.game_lang)
          }}</span>
          {{ itemInfo.recommend_play.name }}</span>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.PlayNameBoxUn {
  width: 10%;
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 10px;
  .score {
    font-family: Gotham-Medium, PingFangSC-Medium, monospace;
    font-size: 16px;
    color: #ffffff;
    letter-spacing: 0;
    font-weight: 500;
  }
  .play-name {
    width: 100%;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    font-family: PingFangSC-Regular, PingFangSC-Medium, monospace;
    font-size: 14px;
    color: #ffffff;
    font-weight: 400;
  }
}
</style>
