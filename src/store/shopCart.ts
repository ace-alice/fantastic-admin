import { defineStore } from 'pinia'
import type { Ref } from 'vue'
import { computed, ref } from 'vue'
import type { BetType, ShopCartElementType } from '@/interface/shopCart'
import type { PullPointsType } from '@/interface/matchList'
import { getLocal, setLocal } from '@/utils/storage'

export const shopCartStore = defineStore('shopCart', () => {
  /**
   *@description 单注id列表
   * **/
  const singleIds: Ref<string[]> = ref(getLocal('singleIds') || [])

  /**
   *@description 串关id列表
   * **/
  const parlayIds: Ref<string[]> = ref(getLocal('parlayIds') || [])

  /**
   *@description 购物车数据
   * **/
  const shopCartList: Ref<ShopCartElementType[]> = ref(
    getLocal('shopCartList') || [],
  )

  /**
   *@description 变更购物车数据
   * **/
  function changeShopCartElement(
    shopId: string,
    betType: BetType,
    shopElement?: ShopCartElementType,
  ) {
    if (shopElement) {
      const inx = shopCartList.value.findIndex((shop) => {
        return String(shop.shop_id) === String(shopElement.shop_id)
      })
      if (inx !== -1) {
        shopCartList.value[inx] = Object.assign(
          shopCartList.value[inx],
          shopElement,
        )
      }
      else {
        shopCartList.value.unshift(shopElement)
      }
      betType === 'single'
        ? singleIds.value.push(shopId)
        : parlayIds.value.push(shopId)
    }
    else {
      const hasAdd
        = betType === 'single'
          ? singleIds.value.includes(shopId)
          : parlayIds.value.includes(shopId)
      if (hasAdd) {
        const inx = shopCartList.value.findIndex((shop) => {
          return String(shop.shop_id) === shopId
        })
        if (
          betType === 'single'
            ? !parlayIds.value.includes(shopId)
            : !singleIds.value.includes(shopId)
        ) {
          shopCartList.value.splice(inx, 1)
        }
        betType === 'single'
          ? singleIds.value.splice(singleIds.value.indexOf(shopId), 1)
          : parlayIds.value.splice(parlayIds.value.indexOf(shopId), 1)
      }
      else {
        betType === 'single'
          ? singleIds.value.push(shopId)
          : parlayIds.value.push(shopId)
      }
    }

    setLocal('shopCartList', shopCartList.value)
    setLocal('singleIds', singleIds.value)
    setLocal('parlayIds', parlayIds.value)
  }

  /**
   * @description 清空购物车
   * */
  function clearShopCart(betType: BetType = 'single') {
    const ids = [...(betType === 'single' ? singleIds.value : parlayIds.value)]
    ids.forEach((id) => {
      changeShopCartElement(id, betType)
    })
  }

  /**
   *@description 单注列表
   * **/
  const singleCartList = computed(() => {
    return shopCartList.value.filter((shop) => {
      return singleIds.value.includes(String(shop.shop_id))
    })
  })

  /**
   *@description 串关列表
   * **/
  const parlayCartList = computed(() => {
    return shopCartList.value.filter((shop) => {
      return parlayIds.value.includes(String(shop.shop_id))
    })
  })

  function pushOddUpdate(oddInfo: PullPointsType) {
    for (let i = 0; i < shopCartList.value.length; i++) {
      if (String(shopCartList.value[i].shop_id) === String(oddInfo.point_id)) {
        Object.assign(shopCartList.value[i], oddInfo)
      }
    }
    setLocal('shopCartList', shopCartList.value)
  }

  let socketChangeId: string[] = []

  let socketChangeTimer: any = null

  /**
   * @description 接受socket的推送
   * */
  function socketPushChange({
    game_id,
    category_id,
  }: {
    game_id: number | string
    category_id: 1 | 2 | 3
  }) {
    let hasGameShop = false
    shopCartList.value.forEach((shop) => {
      if (
        String(shop.game_id) === String(game_id)
        && String(shop.category_id) === String(category_id)
      ) {
        socketChangeId.push(String(shop.play_info_id))
        hasGameShop = true
      }
      socketChangeId = [...new Set(...socketChangeId)]
    })
    if (hasGameShop) {
      if (!socketChangeTimer) {
        socketChangeTimer = setTimeout(() => {
          socketChangeId = []
          clearTimeout(socketChangeTimer)
          socketChangeTimer = null
        }, 3000)
      }
    }
  }

  return {
    singleIds,
    parlayIds,
    shopCartList,
    singleCartList,
    parlayCartList,
    changeShopCartElement,
    pushOddUpdate,
    socketPushChange,
    clearShopCart,
  }
})
