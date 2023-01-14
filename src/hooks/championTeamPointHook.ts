import { computed, ref, Ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { socketCacheStore } from "@/store/socketCache";
import { shopCartStore } from "@/store/shopCart";
import addShopCartHook from "@/hooks/addShopCartHook";

export default function championTeamPointHook(matchInfo: any) {
  const { oddInfoCache } = storeToRefs(socketCacheStore());

  const currentTeamPoint = computed(() => {
    const tempTeamPoint = oddInfoCache.value.find((team) => {
      return +team.point_id === +matchInfo.id;
    });

    if (tempTeamPoint) {
      return Object.assign(matchInfo, tempTeamPoint);
    } else {
      return Object.assign(matchInfo);
    }
  });

  const { singleIds } = storeToRefs(shopCartStore());

  const hasAdd = computed(() => {
    return singleIds.value.includes(String(currentTeamPoint.value?.id || ""));
  });

  /**
   * @description 变赔类型 none无变化 bigger赔率变大 smaller赔率变小
   * */
  const animateType: Ref<"none" | "bigger" | "smaller"> = ref("none");

  let animateTimer: any = null;

  /**
   * @description 监听currentTeamPointInfo的值，根据赔率变化设置动画
   * */
  watch(
    () => currentTeamPoint.value?.point,
    (newVal, oldVal) => {
      if (!newVal || !oldVal) return;
      if (+newVal === +oldVal) return;
      if (+newVal > +oldVal) {
        animateType.value = "bigger";
      }
      if (+newVal < +oldVal) {
        animateType.value = "smaller";
      }
      clearTimeout(animateTimer);
      animateTimer = null;
      animateTimer = setTimeout(() => {
        animateType.value = "none";
      }, 5000);
    },
    { deep: true }
  );

  const isAllowAddCart = computed(() => {
    return (
      !currentTeamPoint.value.is_del &&
      !currentTeamPoint.value.is_finish &&
      !currentTeamPoint.value.is_hide &&
      !(currentTeamPoint.value ? currentTeamPoint.value.danger_status : true)
    );
  });

  const { addShopCart } = addShopCartHook();

  /**
   * @description 添加购物车
   * */
  function toAddCart() {
    if (!isAllowAddCart.value) return;
    addShopCart(currentTeamPoint.value, currentTeamPoint.value, "single");
  }

  return {
    currentTeamPoint,
    hasAdd,
    isAllowAddCart,
    toAddCart,
    animateType,
  };
}
