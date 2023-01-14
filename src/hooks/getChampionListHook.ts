import { storeToRefs } from "pinia";
import { gameInfoStore } from "@/store/gameInfo";
import {
  computed,
  ComputedRef,
  getCurrentInstance,
  onActivated,
  onMounted,
  reactive,
  ref,
  Ref,
  watch,
} from "vue";
import { getMatchList } from "@/api/store-game-info";
import { HandicapType } from "@/interface/gameInfo";

export default function getChampionListHook(
  handicap: HandicapType = "champion"
) {
  const { currentGameId, checkedEvenList } = storeToRefs(gameInfoStore());

  const { setInitHandicap } = gameInfoStore();

  const { proxy }: any = getCurrentInstance();

  /**
   * @description 盘口比赛列表
   * */
  const matchList: Ref<any[]> = ref([]);

  /**
   * @description 目前展示的盘口比赛列表
   * */
  const currentMatchList: ComputedRef<any[]> = computed(() => {
    return matchList.value.filter((match: any) => {
      return (
        (+currentGameId.value === 0 ||
          +currentGameId.value === +match.game_type_id) &&
        (checkedEvenList.value.length === 0 ||
          checkedEvenList.value.includes(String(match.event_id))) &&
        match.recommend_play &&
        Object.keys(match.recommend_play).length > 0
      );
    });
  });

  /**
   * @description 根据获取的数据更新比赛列表
   * @param newList MatchListType 获取的列表数据
   * */
  function toUpdateList(newList: any[]) {
    if (newList.length > 0) {
      matchList.value = [...matchList.value, ...newList].sort(
        (a: any, b: any) => {
          return a.game_fix_start_time - b.game_fix_start_time;
        }
      );
    }
  }

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
      if (!isInit) return;
      refreshList();
    }
  );

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
      updateIds.push(gameId);
      if (!updateTimer) {
        updateTimer = setTimeout(() => {
          updateList(updateIds);
          updateIds = [];
        }, 6000);
      }
    });
    getList();
  });

  return { currentMatchList, loadList };
}
