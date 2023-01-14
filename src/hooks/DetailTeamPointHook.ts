import { PlayInfoType } from "@/interface/matchList";
import { socketCacheStore } from "@/store/socketCache";
import { storeToRefs } from "pinia";
import { computed, Ref, ref, watch } from "vue";
import { globalApiConfigStore } from "@/store/globalApiConfig";
import addShopCartHook from "@/hooks/addShopCartHook";
import { BetType } from "@/interface/shopCart";
import { shopCartStore } from "@/store/shopCart";
import { useRoute } from "vue-router";

export default function detailTeamPointHook(
  playInfo: PlayInfoType,
  index: number
) {
  const route = useRoute();
  const betType: BetType | any = route.query?.betType || "single";

  const { oddInfoCache } = storeToRefs(socketCacheStore());
  const { currentTime } = storeToRefs(globalApiConfigStore());

  const theMatchPoint = computed(() => {
    return undefined;
  });

  const currentPlayInfo = computed(() => {
    if (theMatchPoint.value) {
      return Object.assign({}, playInfo, theMatchPoint.value);
    } else {
      return playInfo;
    }
  });

  /**
   * @description 展示的TeamPoint数据
   * */
  const currentTeamPointInfo = computed(() => {
    if (
      currentPlayInfo.value.team_points &&
      currentPlayInfo.value.team_points.length >= index
    ) {
      const tempTeamPoint = oddInfoCache.value.find((team) => {
        return +team.point_id === +currentPlayInfo.value.team_points[index].id;
      });
      const playTeamPoint = playInfo.team_points.find((team) => {
        return +team.id === +currentPlayInfo.value.team_points[index].id;
      });
      if (tempTeamPoint) {
        return Object.assign(
          currentPlayInfo.value.team_points[index],
          tempTeamPoint,
          { desc: playTeamPoint?.desc || "" }
        );
      } else {
        return Object.assign(currentPlayInfo.value.team_points[index], {
          desc: playTeamPoint?.desc || "",
        });
      }
    } else {
      return undefined;
    }
  });

  const { parlayIds, singleIds } = storeToRefs(shopCartStore());

  const hasAdd = computed(() => {
    return betType === "single"
      ? singleIds.value.includes(String(currentTeamPointInfo.value?.id || ""))
      : parlayIds.value.includes(String(currentTeamPointInfo.value?.id || ""));
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
    () => currentTeamPointInfo.value?.point,
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

  const isDisabled = computed(() => {
    return (
      currentPlayInfo.value.is_del ||
      currentPlayInfo.value.is_end ||
      currentPlayInfo.value.is_hide ||
      currentPlayInfo.value.is_finish ||
      currentTeamPointInfo.value?.danger_status ||
      (betType === "parlay" && !currentPlayInfo.value.is_parlay)
    );
  });

  /**
   * @description 比赛状态（返回具体的比赛状态）
   * @return gaming游戏中 | cancel已取消 end已结束 | cleared已结算 | guessing竞猜中
   * */
  const pointStatus = computed(() => {
    let status = "gaming";
    if (!(currentPlayInfo.value as any)) return "";
    if (+(currentPlayInfo.value as any).is_del === 1) {
      // 已取消
      status = "cancel";
    } else if (+(currentPlayInfo.value as any).is_end === 1) {
      // 已结束
      status = "end";
    } else if (+(currentPlayInfo.value as any).is_finish === 1) {
      // 已结算
      status = "cleared";
    } else if (
      +((currentPlayInfo.value as any).sale_end_time || 0) * 1000 >
      currentTime.value
    ) {
      // 竞猜中
      status = "guessing";
    }
    return status;
  });

  /**
   * @description 比赛状态的icon展示图标
   * @return lock锁盘 | gaming游戏中 | win胜利 | fail失败
   * */
  const statusIcon = computed(() => {
    if (!(currentPlayInfo.value as any)) return "";
    let result = "lock";
    if (pointStatus.value === "gaming") {
      result = "gaming";
    } else if (pointStatus.value === "cleared") {
      if (
        (currentPlayInfo.value as any).winner &&
        Number((currentPlayInfo.value as any).winner) === index + 1
      ) {
        result = "win";
      } else {
        result = "fail";
      }
    }
    return result;
  });

  const { addShopCart } = addShopCartHook();

  /**
   * @description 添加购物车
   * */
  function toAddShopCart() {
    if (!(currentPlayInfo.value as any) || !currentTeamPointInfo.value) return;
    addShopCart(
      currentPlayInfo.value as any,
      currentTeamPointInfo.value,
      betType
    );
  }

  return {
    currentTeamPointInfo,
    animateType,
    pointStatus,
    statusIcon,
    toAddShopCart,
    hasAdd,
    isDisabled,
  };
}
