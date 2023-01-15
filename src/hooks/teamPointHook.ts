import { storeToRefs } from 'pinia'
import type { Ref } from 'vue'
import { computed, ref, watch } from 'vue'
import type { MatchType } from '@/interface/matchList'
import { socketCacheStore } from '@/store/socketCache'
import { globalApiConfigStore } from '@/store/globalApiConfig'
import addShopCartHook from '@/hooks/addShopCartHook'
import type { BetType } from '@/interface/shopCart'
import { shopCartStore } from '@/store/shopCart'

export default function teamPointHook(
  matchInfo: MatchType,
  betType: BetType,
  index: number,
) {
  const currentPlayInfo = computed(() => {
    if (
      matchInfo.recommend_play
      && !(Array.isArray(matchInfo.recommend_play))
      && matchInfo.recommend_play.id
    ) {
      return Object.assign(matchInfo.recommend_play, {
        game_logo: matchInfo.game_logo,
        team_name_1: matchInfo.team_name_1,
        team_name_2: matchInfo.team_name_2,
        category_id: matchInfo.category_id,
        event_name: matchInfo.event_name,
        is_parlay: matchInfo.is_parlay,
      })
    }
    else {
      return undefined
    }
  })

  const { oddInfoCache } = storeToRefs(socketCacheStore())
  const { currentTime } = storeToRefs(globalApiConfigStore())

  /**
   * @description 展示的TeamPoint数据
   * */
  const currentTeamPointInfo = computed(() => {
    if (
      currentPlayInfo.value
      && currentPlayInfo.value.team_points
      && Array.isArray(currentPlayInfo.value.team_points)
      && currentPlayInfo.value.team_points.length >= index
    ) {
      const tempTeamPoint = oddInfoCache.value.find((team) => {
        return (
          +team.point_id
          === +(currentPlayInfo.value as any).team_points[index].id
        )
      })
      if (tempTeamPoint) {
        return Object.assign(
          (currentPlayInfo.value as any).team_points[index],
          tempTeamPoint,
        )
      }
      else {
        return (currentPlayInfo.value as any).team_points[index]
      }
    }
    else {
      return undefined
    }
  })

  const { parlayIds, singleIds } = storeToRefs(shopCartStore())

  const hasAdd = computed(() => {
    return betType === 'single'
      ? singleIds.value.includes(String(currentTeamPointInfo.value?.id || ''))
      : parlayIds.value.includes(String(currentTeamPointInfo.value?.id || ''))
  })

  /**
   * @description 变赔类型 none无变化 bigger赔率变大 smaller赔率变小
   * */
  const animateType: Ref<'none' | 'bigger' | 'smaller'> = ref('none')

  let animateTimer: any = null

  /**
   * @description 监听currentTeamPointInfo的值，根据赔率变化设置动画
   * */
  watch(
    () => currentTeamPointInfo.value?.point,
    (newVal, oldVal) => {
      if (!newVal || !oldVal) {
        return
      }
      if (+newVal === +oldVal) {
        return
      }
      if (+newVal > +oldVal) {
        animateType.value = 'bigger'
      }
      if (+newVal < +oldVal) {
        animateType.value = 'smaller'
      }
      clearTimeout(animateTimer)
      animateTimer = null
      animateTimer = setTimeout(() => {
        animateType.value = 'none'
      }, 5000)
    },
    { deep: true },
  )

  /**
   * @description 比赛状态（返回具体的比赛状态）
   * @return gaming游戏中 | cancel已取消 end已结束 | cleared已结算 | guessing竞猜中
   * */
  const pointStatus = computed(() => {
    let status = 'gaming'
    if (!currentPlayInfo.value) {
      return ''
    }
    if (+(currentPlayInfo.value as any).is_del === 1) {
      // 已取消
      status = 'cancel'
    }
    else if (+(currentPlayInfo.value as any)?.is_end === 1) {
      // 已结束
      status = 'end'
    }
    else if (+(currentPlayInfo.value as any)?.is_finish === 1) {
      // 已结算
      status = 'cleared'
    }
    else if (
      +(currentPlayInfo.value as any).sale_end_time * 1000
      > currentTime.value
    ) {
      // 竞猜中
      status = 'guessing'
    }
    return status
  })

  /**
   * @description 比赛状态的icon展示图标
   * @return lock锁盘 | gaming游戏中 | win胜利 | fail失败
   * */
  const statusIcon = computed(() => {
    if (!currentPlayInfo.value) {
      return ''
    }
    let result = 'lock'
    if (pointStatus.value === 'gaming') {
      result = 'gaming'
    }
    else if (pointStatus.value === 'cleared') {
      if (
        currentPlayInfo.value.winner
        && Number(currentPlayInfo.value.winner) === index + 1
      ) {
        result = 'win'
      }
      else {
        result = 'fail'
      }
    }
    return result
  })

  /**
   * @description 战队名称
   * */
  const teamName = computed(() => {
    if (currentTeamPointInfo.value) {
      return currentTeamPointInfo.value.desc
    }
    else {
      return matchInfo[`team_name_${index + 1}`] || 'IA ESPORT'
    }
  })

  /**
   * @description 战队logo
   * */
  const teamLogo = computed(() => {
    return matchInfo[`team_logo_${index + 1}`] || ''
  })

  const { addShopCart } = addShopCartHook()

  const isNotAllowAdd = computed(() => {
    return (
      !currentPlayInfo.value
      || currentPlayInfo.value?.is_del
      || currentPlayInfo.value?.is_end
      || currentPlayInfo.value?.is_hide
      || currentPlayInfo.value?.is_finish
      || (betType === 'parlay' && !currentPlayInfo.value?.is_parlay)
      || +currentTeamPointInfo.value?.status === 2
    )
  })

  /**
   * @description 添加购物车
   * */
  function toAddShopCart() {
    if (!currentPlayInfo.value || !currentTeamPointInfo.value) {
      return
    }
    addShopCart(
      currentPlayInfo.value as any,
      currentTeamPointInfo.value,
      betType,
    )
  }

  return {
    currentTeamPointInfo,
    animateType,
    pointStatus,
    statusIcon,
    currentPlayInfo,
    toAddShopCart,
    teamName,
    teamLogo,
    hasAdd,
    isNotAllowAdd,
  }
}
