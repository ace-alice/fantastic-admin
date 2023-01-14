import { storeToRefs } from "pinia";
import { shopCartStore } from "@/store/shopCart";
import { computed, getCurrentInstance, reactive, Ref, ref, watch } from "vue";
import { userInfoStore } from "@/store/userInfo";
import { toFixedNumber } from "@/utils";
import { toBetFun } from "@/api/store-game-info";

export default function singleCartHook() {
  const { singleCartList, singleIds } = storeToRefs(shopCartStore());
  const { doGetUserInfo } = userInfoStore();
  const { changeShopCartElement } = shopCartStore();
  const { proxy }: any = getCurrentInstance();

  /**
   * @description 单注投注的金额
   * */
  const singleBetAmount: Ref<{ [key: string]: number | null }> = ref({});

  watch(
    () => singleIds.value,
    (newVal) => {
      Object.keys(singleBetAmount.value).forEach((keyS) => {
        if (!newVal.includes(keyS.replace(/[^0-9]/gi, ""))) {
          delete singleBetAmount.value[keyS];
        }
      });
    },
    { deep: true }
  );

  let timer: any = null;

  /**
   * @description 输入金额时动态对购物车数据赋值
   * */
  function setShoppingCarCount({
    cartId,
    amount,
  }: {
    cartId: string;
    amount: number;
  }) {
    clearTimeout(timer);
    timer = null;
    const theCart = singleCartList.value.find((cart) => {
      return String(cart.shop_id) === String(cartId);
    });
    if (!theCart) return;
    if (amount > Number(theCart.money_max)) {
      singleBetAmount.value[`single${cartId}`] = Number(theCart.money_max);
      return;
    }
    if (amount && amount < Number(theCart.money_min)) {
      timer = setTimeout(() => {
        if (amount) {
          singleBetAmount.value[`single${cartId}`] = Number(theCart.money_min);
        } else {
          delete singleBetAmount.value[`single${cartId}`];
        }
        clearTimeout(timer);
        timer = null;
      }, 1500);
      return;
    }
    singleBetAmount.value[`single${cartId}`] = Number(amount) || null;
  }

  const { balanceInfo } = storeToRefs(userInfoStore());

  const totalBet = computed(() => {
    let result = 0;
    for (const num of Object.values(singleBetAmount.value)) {
      result += num || 0;
    }
    return toFixedNumber(result);
  });
  const totalPrice = computed(() => {
    let result = 0;
    singleCartList.value.forEach((shop: any) => {
      if (singleBetAmount.value[`single${shop.shop_id}`]) {
        result +=
          Number(shop.odd ? shop.odd : "0") *
          Number(singleBetAmount.value[`single${shop.shop_id}`]);
      }
    });
    return toFixedNumber(result);
  });

  /**
   * @description 是否有可投注项（输入金额）
   * */
  const isAllowToBet = computed(() => {
    return (
      singleCartList.value.some((shop: any) => {
        return (
          singleBetAmount.value[`single${shop.shop_id}`] &&
          Number(singleBetAmount.value[`single${shop.shop_id}`]) > 0
        );
      }) && (balanceInfo.value.amount || 0) >= totalBet.value
    );
  });

  const formData = reactive({});

  const betLoading = ref(false);

  /**
   * @description 单注投注
   * */
  async function toBet() {
    if (betLoading.value || !isAllowToBet.value) return;
    betLoading.value = true;
    setTimeout(() => {
      if (!isAllowToBet.value) {
        betLoading.value = false;
        return;
      }
      const items: any[] = [];
      singleCartList.value.forEach((cart) => {
        if (singleBetAmount.value[`single${cart.shop_id}`]) {
          items.push({
            point_extra_id: cart.shop_id,
            money: singleBetAmount.value[`single${cart.shop_id}`],
            odd: Number(cart.odd),
          });
        }
      });
      if (items.length > 0) {
        toBetFun(Object.assign({}, { items: JSON.stringify(items) }, formData))
          .then((res: any) => {
            if (+res.data.code !== 1) return;
            if (+res.data.data.status === 1) {
              proxy.mittBus.emit("betSuccessBus");
              doGetUserInfo();
              (res.data.data.data?.ids || []).forEach((id: number) => {
                delete singleBetAmount.value[`single${id}`];
                changeShopCartElement(String(id), "single");
              });
            }
          })
          .finally(() => {
            betLoading.value = false;
          });
      }
    }, 500);
  }

  const warnMessage = ref("");

  function acceptChange() {
    warnMessage.value = "";
  }

  return {
    singleCartList,
    singleBetAmount,
    setShoppingCarCount,
    isAllowToBet,
    toBet,
    totalBet,
    totalPrice,
    acceptChange,
    warnMessage,
  };
}
