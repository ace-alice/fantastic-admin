import { storeToRefs } from 'pinia'
import type { Ref } from 'vue'
import {
  computed,
  getCurrentInstance,
  onActivated,
  onMounted,
  reactive,
  ref,
  watch,
} from 'vue'
import { shopCartStore } from '@/store/shopCart'
import { i18n } from '@/locale'
import type { ShopCartElementType } from '@/interface/shopCart'
import {
  oddCombination,
  recursionMult,
  toFixedNumber,
  toPrecision,
} from '@/utils'
import { toBetFun } from '@/api/store-game-info'
import { userInfoStore } from '@/store/userInfo'

interface BetItemType {
  amount: number | null
  point: number
  name: string
  num: number
  oddArr: any[][]
  price: () => number
  money_max: () => number
  money_min: () => number
}

export default function parlayCartHook() {
  /**
   * @description 所有串关注单
   * */
  const { parlayCartList } = storeToRefs(shopCartStore())

  const { clearShopCart } = shopCartStore()

  const { balanceInfo } = storeToRefs(userInfoStore())

  const { proxy }: any = getCurrentInstance()

  const { doGetUserInfo } = userInfoStore()

  /**
   * @description 获取parlay_user_payout数组非-1的最小值
   * */
  function getMoneyMin(cart: ShopCartElementType) {
    return cart.parlay_user_daily_payout || 0
  }

  /**
   * @description 当 4窜3 等情况时获取最大投注值
   * @return number
   * */
  function connectMax(oddArr: any[]): number {
    let cMoneyMax = Number.POSITIVE_INFINITY
    for (const shopArr of oddArr) {
      let moneyMax = Number.POSITIVE_INFINITY
      let cPoint = 1
      for (const item of shopArr) {
        cPoint *= Number(item.odd)
      }
      for (const shop of shopArr) {
        moneyMax = Math.min(
          moneyMax,
          shop.single_parlay_array[
            shopArr.length < 11 ? shopArr.length - 3 : 8
          ],
          getMoneyMin(shop),
        )
      }
      cMoneyMax = Math.min(
        cMoneyMax,
        toFixedNumber(moneyMax / (cPoint - 1), 0),
      )
    }
    return cMoneyMax
  }

  /**
   * @description 参与串关计算的有效注单
   * */
  const validCartList = computed(() => {
    return parlayCartList.value.filter((cart: ShopCartElementType) => {
      // return true;
      return (
        cart.is_parlay
        && !(cart.status !== 1)
        && cart.parlay_money_min > 0
        && cart.parlay_money_min <= getMoneyMin(cart)
      )
    })
  })

  const minLimit = computed(() => {
    let min = 0
    validCartList.value.forEach((shop: any) => {
      min = Math.max(min, Number(shop.parlay_money_min))
    })
    return toFixedNumber(min, 0)
  })

  /**
   * @description 串关选项
   * */
  const betOptions: Ref<Array<BetItemType | any>> = ref([])

  /**
   * @description 生成串关投注的选项
   * @return {}
   * */
  function createOptions() {
    betOptions.value = []
    const l = validCartList.value.length
    let point = 1
    if (l < 3) {
      return
    }
    for (const item of validCartList.value) {
      point *= Number(item.odd)
    }
    if (l === 3) {
      betOptions.value.push({
        amount: null,
        point: toFixedNumber(point),
        name: `3${i18n.global.t('connect')}1`,
        num: recursionMult(l, 3),
        oddArr: oddCombination(validCartList.value, 3),
        price() {
          return toFixedNumber(
            (this.amount ? this.amount : 0) * this.point * this.num,
          )
        },
        money_max() {
          let moneyMax = Number.POSITIVE_INFINITY
          for (const shopArr of this.oddArr) {
            for (const shop of shopArr) {
              moneyMax = Math.min(
                moneyMax,
                shop.single_parlay_array[l - 3],
                getMoneyMin(shop),
              )
            }
          }
          return toFixedNumber(moneyMax / (point - 1), 0)
        },
        money_min: () => minLimit.value,
      })
    }
    if ([4, 5].includes(l) || l > 12) {
      for (let i = l; i > l - 2; i--) {
        if (i > 1) {
          betOptions.value.unshift({
            amount: null,
            point: i === l ? toFixedNumber(point) : 0,
            name: `${i}${i18n.global.t('connect')}1`,
            num: recursionMult(l, i),
            oddArr: oddCombination(validCartList.value, i),
            price() {
              let result = 0
              const tempOddArr = []
              for (const item of this.oddArr) {
                let tempOdd = 1
                for (const ele of item) {
                  tempOdd *= ele.odd
                }
                tempOddArr.push(tempOdd)
              }

              for (const i of tempOddArr) {
                result += (this.amount ? this.amount : 0) * i
              }
              return toFixedNumber(result)
            },
            money_max() {
              return connectMax(this.oddArr)
            },
            money_min: () => minLimit.value,
          })
        }
      }
      let tempNum = 0
      let tempArr: any[][] = []
      for (const item of betOptions.value) {
        tempNum += item.num
        tempArr = [...item.oddArr, ...tempArr]
      }

      betOptions.value.push({
        amount: null,
        point: 0,
        name: `${l}${i18n.global.t('connect')}${tempNum}`,
        num: tempNum,
        oddArr: tempArr,
        price() {
          let result = 0
          const tempOddArr = []
          for (const item of this.oddArr) {
            let tempOdd = 1
            for (const ele of item) {
              tempOdd *= ele.odd
            }
            tempOddArr.push(tempOdd)
          }

          for (const i of tempOddArr) {
            result += (this.amount ? this.amount : 0) * i
          }
          return toFixedNumber(result)
        },
        money_max() {
          return connectMax(this.oddArr)
        },
        money_min: () => minLimit.value,
      })
    }

    if ([6, 7, 8, 9, 10, 11, 12].includes(l)) {
      for (let i = l; i > l - 3; i--) {
        if (i > 1) {
          betOptions.value.unshift({
            amount: null,
            point: i === l ? toFixedNumber(point) : 0,
            name: `${i}${i18n.global.t('connect')}1`,
            num: recursionMult(l, i),
            oddArr: oddCombination(validCartList.value, i),
            price() {
              return toFixedNumber(
                (this.amount ? this.amount : 0) * this.point * this.num,
              )
            },
            money_max() {
              return connectMax(this.oddArr)
            },
            money_min: () => minLimit.value,
          })
        }
      }
    }
  }

  /**
   * @description 总奖金
   * */
  const totalPrice = computed(() => {
    let result = 0
    betOptions.value.forEach((shop: any) => {
      result += shop.price()
    })
    return toPrecision(result)
  })

  /**
   * @description 总投注
   * */
  const totalBet = computed(() => {
    let result = 0
    betOptions.value.forEach((shop: any) => {
      result += (shop.amount || 0) * shop.num
    })
    return result
  })

  // 输入框定时器
  let timer: any = null

  /**
   * @description 输入金额时动态对购物车数据赋值
   * */
  function setShoppingCarCount(idx: number) {
    clearTimeout(timer)
    timer = null
    if (
      (betOptions.value[idx].amount || 0) > betOptions.value[idx].money_min()
    ) {
      betOptions.value[idx].amount = betOptions.value[idx].money_max()
    }
    if (
      betOptions.value[idx].amount
      && (betOptions.value[idx].amount || 0) < betOptions.value[idx].money_min()
    ) {
      timer = setTimeout(() => {
        if (betOptions.value[idx].amount) {
          betOptions.value[idx].amount = betOptions.value[idx].money_min()
        }
        else {
          betOptions.value[idx].amount = null
        }
        clearTimeout(timer)
        timer = null
      }, 1500)
    }
  }

  /**
   * @description 是否有可投注项
   * */
  const isAllowToBet = computed(() => {
    return (
      betOptions.value.every((option: any) => {
        return (
          (!Number.isNaN(Number(option.amount))
            && option.money_min() <= Number(option.amount))
          || !Number(option.amount)
        )
      })
      && betOptions.value.some((option) => {
        return (
          !Number.isNaN(Number(option.amount))
          && option.money_min() <= Number(option.amount)
        )
      })
      && (balanceInfo.value.amount || 0) >= totalBet.value
    )
  })

  const formData = reactive({
    fiter_odds: 1,
    is_bowls: 0,
  })

  const betLoading = ref(false)

  /**
   * @description 串关投注
   * */
  async function toBet() {
    if (betLoading.value || !isAllowToBet.value) {
      return
    }
    betLoading.value = true

    setTimeout(() => {
      if (!isAllowToBet.value) {
        betLoading.value = false
        return
      }
      // 筛选出下注的注单
      const betOptionsViable = betOptions.value.filter((option) => {
        return (
          !Number.isNaN(Number(option.amount)) && (option.amount as any) > 0
        )
      })
      const betFormData: any[] = []
      // 处理投注的参数
      for (const item of betOptionsViable) {
        const tempFormDataItem: any = {}
        tempFormDataItem.title = item.name
        tempFormDataItem.number = item.oddArr.length
        tempFormDataItem.order_type = 2
        tempFormDataItem.order = []
        for (const ele of item.oddArr) {
          const tempOrder: any = {}
          tempOrder.title = item.name
          tempOrder.money = item.amount
          tempOrder.money_type = '1'
          let tempOdd = 1
          const tempCombination: any[] = []
          const tempOrderDetail: any[] = []
          for (const e of ele) {
            tempOdd *= e.odd
            tempCombination.push(e.shop_id)
            tempOrderDetail.push(
              Object.assign(
                {},
                {
                  option: e.shop_id,
                  odd: e.odd,
                },
              ),
            )
          }

          tempOrder.odd = toFixedNumber(tempOdd)
          tempOrder.order_detail = tempOrderDetail
          tempOrder.combination = tempCombination.join(',')
          tempFormDataItem.order.push(tempOrder)
        }
        betFormData.push(tempFormDataItem)
      }
      toBetFun(
        Object.assign({}, { items: JSON.stringify(betFormData) }, formData),
      )
        .then((res: any) => {
          if (+res.data.code === 0 && +res.data.error_code === 14) {
            return
          }
          if (+res.data.code === 1) {
            doGetUserInfo()
            clearShopCart('parlay')
            proxy.mittBus.emit('betSuccessBus')
          }
        })
        .finally(() => {
          betLoading.value = false
        })
    }, 500)
  }

  watch(
    () => validCartList.value,
    () => {
      createOptions()
    },
    { deep: true },
  )

  function acceptChange() {
    //
  }

  function showFastNumberFun(option: any, tag: boolean) {
    setTimeout(() => {
      option.showFastNumber = tag
    }, 50)
  }

  const showMore = ref(true)

  function showMoreHandle() {
    if (betOptions.value.length === 1) {
      return
    }
    showMore.value = !showMore.value
  }

  onMounted(() => {
    createOptions()
  })

  onActivated(() => {
    createOptions()
  })

  return {
    parlayCartList,
    totalPrice,
    totalBet,
    betOptions,
    setShoppingCarCount,
    toBet,
    formData,
    acceptChange,
    showFastNumberFun,
    isAllowToBet,
    showMoreHandle,
    showMore,
  }
}
