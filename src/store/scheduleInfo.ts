import { defineStore } from "pinia";
import { computed, onMounted, Ref, ref } from "vue";
import {
  getGameScheduleFun,
  getEventsInfoFun,
} from "@/api/store-game-schedule/index";

export const scheduleInfoStore = defineStore("scheduleInfo", () => {
  const currentGameId: any = ref(0);
  const gameScheduleList: any = ref([]);
  const gameEventList: any = ref([]);
  function getGameScheduleList() {
    getGameScheduleFun().then((res: any) => {
      const result = res.data;
      if (+result.code === 1 && result.data.length > 0) {
        gameScheduleList.value = result.data;
        currentGameId.value = result.data[0].id;
        getEventList(currentGameId.value);
      } else {
        gameScheduleList.value = [];
      }
    });
  }
  function getEventList(zoneId: number | string) {
    getEventsInfoFun({ zone_id: zoneId })
      .then((res: any) => {
        const result = res.data;
        if (result && +result.code === 1) {
          gameEventList.value = result.data || [];
        } else {
          return [];
        }
      })
      .catch((error: any) => {
        console.error(error);
      });
  }

  function changeCurrentGameId(id: string | number) {
    if (id !== currentGameId.value) {
      currentGameId.value = id;
      changeCurrentZoneId(null);
      getEventList(currentGameId.value);
    }
  }

  const currentZoneList = computed(() => {
    const currentGame = gameScheduleList.value.find((game: any) => {
      return game.id === currentGameId.value;
    });
    if (currentGame) {
      return currentGame.zones;
    } else {
      return [];
    }
  });

  const currentZoneId: Ref<number | string | null> = ref(null);

  function changeCurrentZoneId(id: number | string | null) {
    if (id !== currentZoneId.value) {
      currentZoneId.value = id;
    } else {
      currentZoneId.value = null;
    }
  }

  const currentEventList = computed(() => {
    return gameEventList.value.filter((zone: any) => {
      return !currentZoneId.value || zone.zone_id === currentZoneId.value;
    });
  });

  onMounted(() => {
    getGameScheduleList();
  });

  return {
    currentZoneId,
    currentGameId,
    gameScheduleList,
    gameEventList,
    changeCurrentZoneId,
    currentZoneList,
    currentEventList,
    changeCurrentGameId,
  };
});
