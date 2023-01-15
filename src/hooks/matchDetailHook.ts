/* eslint-disable @typescript-eslint/no-use-before-define */
import { useRoute } from 'vue-router'
import type { Ref } from 'vue'
import {
  computed,
  getCurrentInstance,
  onMounted,
  onUnmounted,
  provide,
  ref,
} from 'vue'
import type { MatchDetailType } from '@/interface/matchList'
import { toMatchDetailFun } from '@/api/store-game-info'

/**
 * @description 获取比赛详情的接口参数
 * */
interface GetDetailFormType {
  game_id: number | string
  category_id: 1 | 2 | 3
}

export default function matchDetailHook() {
  const route = useRoute()

  const matchDetail: Ref<MatchDetailType> | Ref<any> = ref({})

  /**
   * @description 获取赛事详情
   * @param form GetDetailFormType 获取比赛详情的接口参数
   * */
  function getMatchDetail(form: GetDetailFormType) {
    toMatchDetailFun(form).then((res: any) => {
      if (+res.data.code === 1) {
        matchDetail.value = res.data.data
        setTimeout(() => {
          init.value = true
        }, 100)
      }
    })
  }

  const roundList = computed(() => {
    return matchDetail.value.plays
      .filter((play: any) => play.child_plays.length > 0)
      .map((play: any) => {
        return +play.bo
      })
  })

  const tabIndex = ref(0)

  const showChart = ref(false)

  const showVideo = ref(false)

  function showVideoHandle() {
    showVideo.value = !showVideo.value
    if (showVideo.value) {
      showAnimate.value = false
      showChart.value = false
    }
  }

  const showAnimate = ref(false)

  function showAnimateHandle(tag = true) {
    if (tag) {
      showAnimate.value = !showAnimate.value
    }
    else {
      showAnimate.value = false
    }
    if (showAnimate.value) {
      showVideo.value = false
      showChart.value = false
    }
  }

  provide(
    'showChart',
    computed(() => showChart.value),
  )

  provide(
    'showVideo',
    computed(() => showVideo.value),
  )

  provide(
    'showAnimate',
    computed(() => showAnimate.value),
  )

  function changeChartStatus(tag: boolean) {
    showChart.value = tag
  }

  function setTabIndex(index: number) {
    tabIndex.value = index
  }

  const init = ref(false)

  const { proxy }: any = getCurrentInstance()

  onMounted(() => {
    getMatchDetail({
      game_id: route.query.game_id,
    } as any)

    proxy.mittBus.on('getMatchDetailBus', () => {
      getMatchDetail({
        game_id: route.query.game_id,
      } as any)
    })
  })

  onUnmounted(() => {
    proxy.mittBus.off('getMatchDetailBus')
  })
  return {
    matchDetail,
    roundList,
    tabIndex,
    setTabIndex,
    showChart,
    changeChartStatus,
    init,
    showVideo,
    showVideoHandle,
    showAnimate,
    showAnimateHandle,
  }
}
