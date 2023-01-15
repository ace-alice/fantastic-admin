<!-- eslint-disable @typescript-eslint/no-use-before-define -->
<script lang="ts">
import {
  computed,
  defineComponent,
  getCurrentInstance,
  nextTick,
  onMounted,
  onUnmounted,
  reactive,
  ref,
} from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import DetailItem from './components/DetailItem.vue'
import NoMore from '@/components/NoMore/index.vue'
import { setItemName } from '@/utils'
import { socketCacheStore } from '@/store/socketCache'
import ToTopBox from '@/components/ToTopBox/index.vue'
export default defineComponent({
  name: 'IaMatchContent',
  components: { DetailItem, NoMore, ToTopBox },
  props: {
    matchInfo: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  emits: ['setTabIndex', 'changeChartStatus'],
  setup(props: any, { emit }: any) {
    const { proxy }: any = getCurrentInstance()

    const openIcon = new URL('@/assets/icons/turn-on.png', import.meta.url).href

    const showNotList = reactive<any>({})

    const route = useRoute()

    const currentTop = ref(0)

    function scrollHandle({ scrollTop }: any) {
      currentTop.value = scrollTop
      if (scrollTop === 0) {
        proxy.mittBus.emit('setMiniplayerBus', false)
        proxy.mittBus.emit('setMiniAnimateBus', false)
      }
      else {
        proxy.mittBus.emit('setMiniplayerBus', true)
        proxy.mittBus.emit('setMiniAnimateBus', true)
      }
      if (scrollTop < 10) {
        if (toShowChart) {
          emit('changeChartStatus', toShowChart)
          toShowChart = false
        }
      }
      if (scrollTop > 40) {
        if (!toShowChart) {
          emit('changeChartStatus', false)
        }
        proxy.mittBus.emit('changeHeightBus', false)
      }
      else {
        proxy.mittBus.emit('changeHeightBus', true)
      }
      if (
        proxy.$refs
        && proxy.$refs.pointsBox
        && proxy.$refs['detail-content']
      ) {
        if (Array.isArray(proxy.$refs.pointsBox)) {
          let clientHeight = 0
          for (let i = 0; i < proxy.$refs.pointsBox.length; i++) {
            clientHeight += proxy.$refs.pointsBox[i].clientHeight || 0
            if (clientHeight >= scrollTop) {
              emit('setTabIndex', i)
              return
            }
          }
        }
        else {
          emit('setTabIndex', 0)
        }
      }
    }

    function scrollToIndex(index: number) {
      if (!proxy.$refs['detail-content']) {
        return
      }
      if (!proxy.$refs.pointsBox) {
        return
      }
      if (!(Array.isArray(proxy.$refs.pointsBox))) {
        return
      }
      let clientHeight = 0
      for (let j = 0; j < index; j++) {
        clientHeight += proxy.$refs.pointsBox[j].clientHeight || 0
      }
      proxy.$refs['detail-content'].setScrollTop(clientHeight + 10)
    }

    let toShowChart = false

    function toInitIndex() {
      const matchVal = route.query?.match
      if (!matchVal) {
        return
      }
      const inx = props.matchInfo.plays.findIndex((play: any) => {
        return +play.bo === Number(matchVal)
      })
      if (inx !== -1) {
        scrollToIndex(inx)
      }
    }

    const { oddInfoCache } = storeToRefs(socketCacheStore())

    function getListForStatus(list: any[], status: 'yes' | 'no' = 'no'): any[] {
      const tempArr: any = []
      if (status === 'yes') {
        if (+props.matchInfo.is_finish) {
          return list
        }
        else {
          for (const play of list) {
            if (!(+play.is_del || +play.is_finish || +play.is_hide)) {
              if (play.team_points && Array.isArray(play.team_points)) {
                const allNot = play.team_points.some((pointD: any) => {
                  const pointCache = oddInfoCache.value.find((cache: any) => {
                    return +cache.point === +pointD.id
                  })

                  return (
                    (pointCache && +(pointCache as any).status === 1)
                    || +pointD.status === 1
                  )
                })

                !allNot || tempArr.push(play)
              }
            }
          }
          return tempArr
        }
      }
      else {
        if (+props.matchInfo.is_finish) {
          return []
        }
        else {
          for (const play of list) {
            if (+play.is_del || +play.is_finish || +play.is_hide) {
              tempArr.push(play)
            }
            else {
              if (play.team_points && Array.isArray(play.team_points)) {
                const allNot = play.team_points.every((pointD: any) => {
                  const pointCache = oddInfoCache.value.find((cache: any) => {
                    return +cache.point === +pointD.id
                  })

                  return (
                    (pointCache && +(pointCache as any).status === 2)
                    || +pointD.status === 2
                  )
                })
                !allNot || tempArr.push(play)
              }
            }
          }
          return tempArr
        }
      }
    }

    function toTopHandle() {
      if (proxy.$refs['detail-content']) {
        proxy.$refs['detail-content'].setScrollTop(0)
      }
    }

    const hasToTop = computed(() => {
      return currentTop.value > 100
    })

    onMounted(() => {
      proxy.mittBus.on('scrollToEmit', (index: any) => {
        if (index === 'showChart') {
          toShowChart = true
          proxy.$refs['detail-content'].setScrollTop(5)
          return
        }
        if (index === 'notShowChart') {
          proxy.$refs['detail-content'].setScrollTop(11)
          emit('changeChartStatus', false)
          return
        }
        scrollToIndex(index)
      })
      nextTick(() => {
        toInitIndex()
      })
    })

    onUnmounted(() => {
      proxy.mittBus.off('scrollToEmit')
    })

    return {
      setItemName,
      scrollHandle,
      openIcon,
      getListForStatus,
      showNotList,
      toTopHandle,
      hasToTop,
    }
  },
})
</script>

<template>
  <div class="detail-content">
    <el-scrollbar ref="detail-content" @scroll="scrollHandle">
      <template v-if="matchInfo">
        <div
          v-for="(detail, index) in matchInfo.plays"
          :key="index"
          ref="pointsBox"
          class="points-box"
        >
          <div
            v-if="detail.child_plays.length > 0"
            class="round"
            :class="{ visible: index === 0 }"
          >
            {{ setItemName(+detail.bo, matchInfo.game_lang) }}
          </div>
          <template
            v-for="item in getListForStatus(detail.child_plays, 'yes')"
            :key="item.id"
          >
            <!-- suppress JSUnresolvedVariable -->
            <DetailItem
              :play-info="
                Object.assign(item, {
                  event_name: matchInfo.event_name,
                  game_logo: matchInfo.game_logo,
                  team_name_1: matchInfo.team_name_1,
                  team_name_2: matchInfo.team_name_2,
                  is_parlay: matchInfo.is_parlay,
                  game_lang: matchInfo.game_lang,
                })
              "
            />
          </template>
          <div
            v-show="getListForStatus(detail.child_plays, 'no').length > 0"
            class="show-not-bet-btn"
            :class="{ 'show-btn': showNotList[`bo${detail.bo}`] }"
            @click="
              showNotList[`bo${detail.bo}`]
                = !showNotList[`bo${detail.bo}`]
            "
          >
            <div>显示全部</div>
            <div class="status">
              已停注
            </div>
            <div>玩法</div>
            <LazyImage :img-url="openIcon" />
          </div>
          <transition name="list">
            <div
              v-show="showNotList[`bo${detail.bo}`]"
              class="no-to-bet-list"
            >
              <template
                v-for="item in getListForStatus(detail.child_plays, 'no')"
                :key="item.id"
              >
                <!-- suppress JSUnresolvedVariable -->
                <DetailItem
                  :play-info="
                    Object.assign(item, {
                      event_name: matchInfo.event_name,
                      game_logo: matchInfo.game_logo,
                      team_name_1: matchInfo.team_name_1,
                      team_name_2: matchInfo.team_name_2,
                      is_parlay: matchInfo.is_parlay,
                      game_lang: matchInfo.game_lang,
                    })
                  "
                />
              </template>
            </div>
          </transition>
        </div>
        <NoMore />
      </template>
    </el-scrollbar>
    <ToTopBox v-if="hasToTop" @to-top="toTopHandle" />
  </div>
</template>

<!-- suppress CssInvalidPseudoSelector -->
<style scoped lang="scss">
.detail-content {
  width: 100%;
  overflow-y: auto;
  .points-box {
    margin: auto;
    text-align: center;
    width: 87%;
    .no-to-bet-list {
      overflow: hidden;
    }
    .show-btn {
      .lazy-image {
        transform: rotateZ(90deg) !important;
      }
    }
    .show-not-bet-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;
      color: rgba(255, 255, 255, 0.6);
      font-weight: 400;
      margin-top: 16px;
      cursor: url("~@/assets/icons/home_mouse.png"), auto;
      border-radius: 6px;
      &:hover {
        background-color: rgba(255, 255, 255, 0.02);
      }
      div + div {
        margin-left: 8px;
      }
      .lazy-image {
        height: 24px;
        width: 24px;
        transition: all 0.2s ease-in-out;
        transform: rotateZ(-90deg);
      }
    }
    .round {
      width: 100%;
      height: 53px;
      line-height: 53px;
      font-size: 16px;
      color: #fe5e00;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
    .visible {
      height: 0;
      overflow: hidden;
      margin: 0;
      padding: 0;
      border: none;
    }
  }
  &:deep(.el-scrollbar) {
    .el-scrollbar__wrap {
      scroll-behavior: smooth;
    }
    .el-scrollbar__thumb {
      background-color: #fe5e00;
    }
  }
  .no-more {
    height: calc(100vh - 720px);
  }
}
</style>
