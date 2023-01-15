<script lang="ts">
import type { PropType } from 'vue'
import { computed, defineComponent, ref } from 'vue'
import { parseTime } from '@/utils'

export default defineComponent({
  name: 'GroupMatches',
  components: {},
  props: {
    info: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
  },
  setup(props: any) {
    const currentIndex = ref(0)

    function changeCurrentIndex(inx: number) {
      currentIndex.value = inx
    }

    const currentGroupInfo = computed(() => {
      return props.info[currentIndex.value] || {}
    })

    return { currentIndex, changeCurrentIndex, currentGroupInfo, parseTime }
  },
})
</script>

<template>
  <div class="GroupMatches">
    <div v-show="info.length > 1" class="group-tabs">
      <div
        v-for="(group, index) in info" :key="group.id"
        class="group-tab"
        :class="{ 'active-tab': currentIndex === index }"
        @click.stop="changeCurrentIndex(index)"
      >
        {{ group.name }}
      </div>
    </div>
    <div class="group-body">
      <div class="scores-box">
        <div>
          <div>{{ $t("teams") }}</div>
          <div>{{ $t("win") }}</div>
          <div>{{ $t("tie") }}</div>
          <div>{{ $t("lose") }}</div>
          <div>{{ $t("points") }}</div>
        </div>
        <div
          v-if="
            currentGroupInfo.scores && currentGroupInfo.scores.length > 0
          "
        >
          <div
            v-for="score in currentGroupInfo.scores"
            :key="score.team_id"
            class="scores-item"
          >
            <div>
              <LazyImage :img-url="score.team_logo" />
              <span>{{ score.team_name }}</span>
            </div>
            <div>{{ score.win }}</div>
            <div>{{ score.draw }}</div>
            <div>{{ score.lose }}</div>
            <div>{{ score.score }}</div>
          </div>
        </div>
      </div>
      <div class="games-box">
        <div>
          <div>{{ $t("teams1") }}</div>
          <div>{{ $t("score") }}</div>
          <div>{{ $t("teams1") }}</div>
          <div>{{ $t("competition_system") }}</div>
          <div>{{ $t("match_time") }}</div>
        </div>
        <div
          v-if="
            currentGroupInfo.games && currentGroupInfo.games.length > 0
          "
        >
          <div
            v-for="(game, index) in currentGroupInfo.games"
            :key="index"
            class="games-item"
          >
            <div>
              <LazyImage :img-url="game.team_logo_1" />
              <div class="game-name">
                {{ game.team_name_1 }}
              </div>
            </div>
            <div>{{ game.score_1 }} - {{ game.score_2 }}</div>
            <div>
              <LazyImage :img-url="game.team_logo_2" />
              <div class="game-name">
                {{ game.team_name_2 }}
              </div>
            </div>
            <div>BO{{ game.bo }}</div>
            <div>{{ parseTime(game.start_time, "{y}-{m}-{d}") }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@mixin scores-item {
  height: 60px;
  color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  & > div {
    width: 15%;
    text-align: center;
    flex-shrink: 0;
    &:nth-child(1) {
      width: 40%;
      text-align: left;
      display: flex;
      align-items: center;
    }
  }
}
@mixin games-item {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  & > div {
    width: 25%;
    &:nth-child(1) {
      display: flex;
      align-items: center;
      .lazy-image {
        flex-shrink: 0;
      }
      .game-name {
        flex-grow: 1;
        white-space: pre-wrap;
        line-height: 1.1em;
      }
    }
    &:nth-child(2) {
      width: 15%;
      color: rgba(255, 255, 255, 0.8) !important;
    }
    &:nth-child(3) {
      display: flex;
      align-items: center;
      .lazy-image {
        flex-shrink: 0;
      }
      .game-name {
        flex-grow: 1;
        white-space: pre-wrap;
        line-height: 1.1em;
      }
    }
    &:nth-child(4) {
      width: 15%;
      line-height: 1em;
    }
    &:nth-child(5) {
      line-height: 1.1em;
    }
  }
}
.GroupMatches {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  background: #1f242c;
  overflow: hidden;
  .group-tabs {
    display: flex;
    flex-shrink: 0;
    .active-tab {
      background: #1f242c;
      color: #ffffff;
    }
    & > div {
      flex-grow: 1;
      height: 54px;
      line-height: 54px;
      text-align: center;
      background: #1a1f26;
      cursor: url("~@/assets/icons/home_mouse.png"), auto;
      color: rgba(255, 255, 255, 0.6);
    }
  }
  .group-body {
    display: flex;
    justify-content: space-between;
    flex-grow: 1;
    overflow: hidden;
    position: relative;
    .lazy-image {
      height: 32px;
      width: 32px;
    }
    &:after {
      position: absolute;
      content: "";
      height: 54px;
      width: 100%;
      background: #1a1f26;
      top: 0;
      left: 0;
      z-index: 1;
    }
    & > div {
      height: 100%;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      & > div {
        width: 100%;
      }
      &:nth-child(1) {
        z-index: 2;
        & > div {
          &:nth-child(1) {
            @include scores-item;
          }
        }
      }
      &:nth-child(2) {
        z-index: 2;
        & > div {
          &:nth-child(1) {
            @include games-item;
          }
        }
      }
    }
    .scores-box {
      width: 35%;
      height: 100% !important;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.8);
      & > div:nth-child(1) {
        flex-shrink: 0;
      }
      & > div:nth-child(2) {
        height: calc(100% - 54px) !important;
        overflow: auto;
      }
      .scores-item {
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        @include scores-item;
        & > div {
          &:nth-child(1) {
            span + span {
              display: inline-block;
              margin-left: 10px;
            }
          }
        }
      }
    }
    .games-box {
      width: 60%;
      height: 100% !important;
      overflow: hidden;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.8);
      & > div:nth-child(1) {
        flex-shrink: 0;
      }
      & > div:nth-child(2) {
        height: calc(100% - 54px) !important;
        overflow: auto;
      }
      .games-item {
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        @include games-item;
        & > div {
          span + span {
            display: inline-block;
            margin-left: 10px;
          }
        }
      }
    }
  }
}
</style>
