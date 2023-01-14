import {
  computed,
  onMounted,
  reactive,
  ComputedRef,
  getCurrentInstance,
  onUnmounted,
  watch,
  ref,
  Ref,
  provide,
  onActivated,
} from "vue";
import { getMatchList } from "@/api/store-game-info";
import { HandicapType, MatchListType } from "@/interface/matchList";
import { gameInfoStore } from "@/store/gameInfo";
import { storeToRefs } from "pinia";
import { i18n } from "@/locale";
import { useRouter } from "vue-router";
import { parseTime, timeOffset } from "@/utils";

/**
 *@description 盘口列表的获取与处理 hook
 *@param handicap "today:今日" | "fix:早盘" | "live:滚球" | "end:赛果" | "favorite:收藏" | “hot:热门” | "串关:parlay" 盘口名称
 *@return {matchList&currentMatchList}
 **/
export default function getUniversalListHook(handicap: HandicapType) {
  const isEnd = handicap === "end";
  // const betType: BetType = handicap === "parlay" ? "parlay" : "single";

  provide("betType", handicap === "parlay" ? "parlay" : "single");

  provide("handicap", handicap);

  const { currentGameId, checkedEvenList } = storeToRefs(gameInfoStore());

  const { setInitHandicap } = gameInfoStore();

  const currentDate = ref("all");

  const router = useRouter();

  const weekDateOptions: Ref<any[]> = ref([
    {
      label: i18n.global.t("all"),
      data: "All",
      dataValue: "all",
    },
  ]);

  for (let i = 0; i < 7; i++) {
    weekDateOptions.value.push({
      label: i === 0 ? i18n.global.t("today") : parseTime(timeOffset(i), "{a}"),
      data: parseTime(timeOffset(i), "{d}"),
      dataValue: String(timeOffset(i)).slice(0, 10),
    });
  }

  function changeCurrentDate(item: any) {
    currentDate.value = item.dataValue;
  }

  /**
   * @description 盘口比赛列表
   * */
  const matchList: Ref<MatchListType> = ref([]);

  /**
   * @description 目前展示的盘口比赛列表
   * */
  const matchListData: ComputedRef<MatchListType> = computed(() => {
    return matchList.value.filter((match) => {
      const offsetTime =
        currentDate.value === "all"
          ? 0
          : Number(match.game_start_time) - Number(currentDate.value);
      return (
        handicap === "hot" ||
        ((currentDate.value === "all" ||
          (offsetTime < 86400 && offsetTime >= 0)) &&
          (+currentGameId.value === 0 ||
            +currentGameId.value === +match.game_type_id) &&
          (checkedEvenList.value.length === 0 ||
            checkedEvenList.value.includes(String(match.event_id))))
      );
    });
  });

  /**
   * @description 根据获取的数据更新比赛列表
   * @param newList MatchListType 获取的列表数据
   * */
  function toUpdateList(newList: MatchListType) {
    matchList.value = [...newList, ...matchList.value].sort(
      (a: any, b: any) => {
        return isEnd
          ? b.game_fix_start_time - a.game_fix_start_time
          : a.game_fix_start_time - b.game_fix_start_time;
      }
    );
  }

  /**
   * @description 接口是否再请求中
   * */
  const loadList = ref(false);

  /**
   * @description 获取列表的参数
   * */
  const formData = reactive({
    page: 0,
    nav_code: handicap,
  });

  /**
   * @description 数据是否已经全部初始化（是否在游戏类型为全部是加载全部数据）
   * */
  let isInit = false;

  /**
   * @description 获取比赛列表数据
   * */
  function getList() {
    loadList.value = true;
    const form: any = {};
    if (+currentGameId.value && !isInit) {
      form.game_type_id = currentGameId.value;
    } else {
      isInit = true;
    }
    formData.page++;
    getMatchList(Object.assign({}, formData, form))
      .then((res: any) => {
        if (+res.data.code === 1) {
          formData.page === 1
            ? (matchList.value = res.data.data.data)
            : toUpdateList(res.data.data.data);
          // 是否已经加载完该条件下的所有数据
          if (formData.page >= +(res.data.data.last_page || 0)) return;
          if (isEnd) return;
          getList();
        }
      })
      .catch(() => {
        formData.page--;
        getList();
      })
      .finally(() => {
        loadList.value = false;
      });
  }

  /**
   * @description 重新加载数据
   * */
  function refreshList() {
    formData.page = 0;
    getList();
  }

  /**
   * @description 监听游戏类型，当未初始化或赛果盘时每次重新加载数据
   * */
  watch(
    () => currentGameId.value,
    () => {
      if (!isInit && !isEnd) return;
      refreshList();
    }
  );

  const { proxy }: any = getCurrentInstance();

  /**
   * @description socket推送的需要更新的赛事id数组
   * */
  let updateIds: string[] = [];

  /**
   * @description 更新倒计时实例
   * */
  let updateTimer: any = null;

  /**
   * @description socket推送更新时的方法
   * @param updateIds string[] socket推送的需要更新的赛事id数组
   * */
  function updateList(updateIds: string[]) {
    const form = {
      page: 1,
      nav_code: handicap,
      game_id: updateIds.join(","),
    };
    getMatchList(form).then((res: any) => {
      if (+res.data.code === 1) {
        for (const matchId of updateIds) {
          const inx = matchList.value.findIndex((game) => {
            return String(matchId) === String(game.id);
          });
          if (inx !== -1) {
            matchList.value.splice(inx, 1);
          }
        }
        toUpdateList(res.data.data.data);
      }
    });
  }

  /**
   * @description 跳转投注详情页
   * */
  const matchDetail = (game_id: number, category_id: number) => {
    router.push({
      name: "MatchDetail",
      query: {
        game_id,
        category_id,
        betType: handicap === "parlay" ? "parlay" : "single",
      },
    });
  };

  onActivated(() => {
    refreshList();
  });

  onMounted(() => {
    /**
     * @description socket推送时触发的方法
     * @param gameId string socket推送的需要更新的赛事id
     * */
    setInitHandicap(handicap);
    proxy.mittBus.on(`${handicap}UpdateBus`, (gameId: string) => {
      if (!updateIds.includes(String(gameId))) {
        updateIds.push(String(gameId));
      }
      if (!updateTimer) {
        updateTimer = setTimeout(() => {
          updateList(updateIds);
          updateIds = [];
          clearTimeout(updateTimer);
          updateTimer = null;
        }, 6000);
      }
    });
    getList();
  });

  onUnmounted(() => {
    proxy.mittBus.off(`${handicap}UpdateBus`);
  });

  return {
    matchList,
    currentGameId,
    matchListData,
    refreshList,
    getList,
    currentDate,
    weekDateOptions,
    changeCurrentDate,
    matchDetail,
    loadList,
  };
}
