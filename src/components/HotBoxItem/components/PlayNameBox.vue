<script lang="ts">
import { computed, defineAsyncComponent, defineComponent } from 'vue'
import { countdownHook } from '@/hooks/countdownHook'
import { parseTime, setItemName } from '@/utils'
const ThirdTeamBox = defineAsyncComponent(() => import('./ThirdTeamBox.vue'))

export default defineComponent({
  name: 'PlayNameBox',
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

    const { countdown } = countdownHook(props.itemInfo.game_start_time, 3)

    return { hasPlayInfo, hasTeam3, countdown, parseTime, setItemName }
  },
})
</script>

<template>
  <div class="PlayNameBox">
    <ThirdTeamBox v-if="hasTeam3" :index="2" :item-info="itemInfo" />
    <template v-else>
      <div v-if="!hasTeam3 && hasPlayInfo" class="play-name">
        <span v-tooltip="{ width: 53, message: itemInfo.recommend_play.name }">
          {{
            +itemInfo.recommend_play.match === 0
              ? ""
              : setItemName(+itemInfo.recommend_play.match, itemInfo.game_lang)
          }}
          {{ itemInfo.recommend_play.name }}
        </span>
      </div>
      <div v-if="!hasTeam3 && +itemInfo.category_id === 3" class="score">
        {{ itemInfo.score_1 }}-{{ itemInfo.score_2 }}
      </div>
      <div v-if="!hasTeam3 && +itemInfo.category_id !== 3" class="start-date">
        <template v-if="!countdown[0]">
          {{
            parseTime(
              Number(String(itemInfo.game_start_time).padEnd(13, "0")),
              "{h}:{i}",
            )
          }}
        </template>
        <template v-else>
          {{ countdown[1] }}
        </template>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.PlayNameBox {
  width: 31%;
  height: 56px;
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 8px;
  z-index: 1;
  .score {
    font-family: Gotham-Medium, PingFangSC-Medium, monospace;
    font-size: 16px;
    color: #ffffff;
    letter-spacing: 2px;
    font-weight: 500;
  }
  .play-name {
    width: 100%;
    text-align: center;
    white-space: pre-wrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 14px;
    color: #ffffff;
    font-weight: 500;
    margin-top: 6px;
    & + .start-date {
      margin-top: 6px;
    }
  }
  .start-date {
    font-family: Gotham-Medium, PingFangSC-Medium, monospace;
    font-size: 18px;
    color: #4e8deb;
    font-weight: 500;
  }
}
</style>
