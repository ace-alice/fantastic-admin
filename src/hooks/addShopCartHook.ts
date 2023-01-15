import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import { getCurrentInstance } from 'vue'
import { shopCartStore } from '@/store/shopCart'
import type { PlayInfoType, TeamPointType } from '@/interface/matchList'
import type { BetType, ShopCartElementType } from '@/interface/shopCart'
import {
  getParlayOddInfoList,
  getSingleOddInfoList,
} from '@/api/store-game-info'
import { userInfoStore } from '@/store/userInfo'

/**
 * @description 需要处理的teamPoint内的数据
 * */
const teamPointKeys: any = {
  money_max: 'money_max',
  money_min: 'money_min',
  shop_id: 'id',
  desc: 'desc',
  odd: 'point',
  status: 'status',
  parlay_money_min: 'parlay_money_min',
  single_parlay_array: [
    'parlay_limit_3',
    'parlay_limit_4',
    'parlay_limit_5',
    'parlay_limit_6',
    'parlay_limit_7',
    'parlay_limit_8',
    'parlay_limit_9',
    'parlay_limit_10',
    'parlay_limit_other',
  ],
  parlay_user_daily_payout: 'parlay_user_daily_payout',
}

/**
 * @description 需要处理的playInfo内的数据
 * */
const playInfoKeys: any = {
  category_id: 'category_id',
  game_logo: 'game_logo',
  game_id: 'game_id',
  game_lang: 'game_lang',
  play_info_id: 'id',
  is_champion: 'is_champion',
  is_del: 'is_del',
  is_finish: 'is_finish',
  is_parlay: 'is_parlay',
  match: 'match',
  play_name: 'play_name',
  team_name_1: 'team_name_1',
  team_name_2: 'team_name_2',
  event_name: 'event_name',
}

export default function addShopCartHook() {
  const { proxy }: any = getCurrentInstance()
  /**
   * @description 生成购物车的数据
   * @param playInfo PlayInfoType
   * @param teamPoint TeamPointType
   * @param betType
   * @return ShopCartElementType 购物车数据
   * */
  function createShopCartElement(
    playInfo: any,
    teamPoint: any,
    betType: BetType,
  ) {
    const temp: ShopCartElementType | any = {}
    for (const teamTey of Object.keys(teamPointKeys)) {
      if (typeof teamPointKeys[teamTey] === 'string') {
        if (
          ['money_max', 'money_min'].includes(teamPointKeys[teamTey])
          && betType === 'parlay'
        ) {
          continue
        }
        temp[teamTey] = teamPoint[teamPointKeys[teamTey]] || 0
      }
      else {
        // 将teamPoint中的single_parlay_{3-other}组装成一个数组
        // 将teamPoint中的parlay_user_payout组装成一个数组
        if (betType === 'parlay') {
          const childTemp: any[] = []
          for (const itemKey of teamPointKeys[teamTey]) {
            childTemp.push(teamPoint[itemKey] || 0)
          }
          temp[teamTey] = childTemp
        }
      }
    }
    for (const playTey of Object.keys(playInfoKeys)) {
      temp[playTey] = playInfo[playInfoKeys[playTey]] || 0
    }
    return temp
  }

  const { singleIds, parlayIds } = storeToRefs(shopCartStore())
  const { changeShopCartElement } = shopCartStore()
  const { isLogin } = storeToRefs(userInfoStore())

  /**
   * @description 添加购物车
   * @param playInfo PlayInfoType
   * @param teamPoint TeamPointType
   * @param betType BetType 投注类型
   * */
  function addShopCart(
    playInfo: PlayInfoType,
    teamPoint: TeamPointType,
    betType: BetType,
  ) {
    if (!isLogin.value) {
      return
    }

    // 是否已经在购物车内
    const hasAdd
      = betType === 'single'
        ? singleIds.value.includes(String(teamPoint.id))
        : parlayIds.value.includes(String(teamPoint.id))

    if (
      (playInfo.is_del
        || playInfo.is_end
        || playInfo.is_hide
        || playInfo.is_finish
        || +teamPoint.status === 2
        || (betType === 'parlay' && !playInfo.is_parlay))
      && !hasAdd
    ) {
      return
    }
    if (hasAdd) {
      changeShopCartElement(String(teamPoint.id), betType)
    }
    else {
      const getInfoFun
        = betType === 'parlay' ? getParlayOddInfoList : getSingleOddInfoList
      getInfoFun({ point_id: teamPoint.id })
        .then((res: any) => {
          if (+res.data.code === 1) {
            const tempElement = createShopCartElement(
              playInfo,
              Object.assign(teamPoint, res.data.data),
              betType,
            )
            changeShopCartElement(String(teamPoint.id), betType, tempElement)
            proxy.mittBus.emit('changeCurrentSideBarBus', 'ShopCart')
            setTimeout(() => {
              proxy.mittBus.emit('changeBetTypeBus', betType)
            }, 100)
          }
          else {
            ElMessage('添加失败')
          }
        })
        .catch(() => {
          ElMessage('添加失败')
        })
    }
  }

  return { addShopCart }
}
