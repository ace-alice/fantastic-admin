<template>
  <div class="Knockout-box">
    <el-scrollbar class="scrollbar">
      <div class="bracket-box">
        <Bracket v-for="(round, index) in rounds" :key="index" :rounds="round">
          <!--          #player-extension-top="{ match }"-->
          <template>
            <div class="player-top">
              <!--                <span>{{ match.desc ? match.desc : "" }}</span>-->
              <!-- <span v-if="match.bo">BO{{ match.bo }}</span> -->
            </div>
          </template>
          <template #player="{ player }">
            <LazyImage :img-url="player.team_logo" />
            <span class="player-name">{{
              player.team_name ? player.team_name : "待定"
            }}</span>
            <span class="score">{{ player.score ? player.score : 0 }}</span>
          </template>
          <template #player-extension-bottom="{ match }">
            <div class="player-bottom">
              <span v-if="match.start_time">{{ match.start_time }}</span>
              <span v-else>{{ new Date() }}</span>
            </div>
          </template>
        </Bracket>
      </div>
    </el-scrollbar>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, Ref } from "vue";
import Bracket from "@/components/Bracket/index.vue";

const defaultKnockout = {
  player1: { id: null, score: 0, team_logo: "", team_name: "", winner: false },
  player2: { id: null, score: 0, team_logo: "", team_name: "", winner: false },
};

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Knockout",
  components: {
    Bracket,
  },
  props: {
    info: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  provide: {
    identity: "",
  },
  setup(props: any) {
    // 图片加载失败时显示的默认图片
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const errImg = new URL("@/assets/images/logo-error.png" ,import.meta.url).href;
    const rounds: Ref<any[]> = ref([]);
    const top = ref(0);
    const left = ref(0);

    function setPlayer(detail: any[], pos: number) {
      let KnockoutObj: any = {};
      const filterDetail = detail.filter((item: any) => {
        return item.detail_num == Number(pos);
      });
      if (filterDetail.length > 0) {
        KnockoutObj.player1 = {
          id: filterDetail[0].team_id_1,
          score: filterDetail[0].score_1,
          team_logo: filterDetail[0].team_logo_1,
          team_name: filterDetail[0].team_name_1,
          winner: filterDetail[0].score_1 > filterDetail[0].score_2,
        };
        KnockoutObj.player2 = {
          id: filterDetail[0].team_id_2,
          score: filterDetail[0].score_2,
          team_logo: filterDetail[0].team_logo_2,
          team_name: filterDetail[0].team_name_2,
          winner: filterDetail[0].score_2 > filterDetail[0].score_1,
        };
      } else {
        Object.assign(KnockoutObj, defaultKnockout);
      }
      Object.assign(KnockoutObj, filterDetail[0]);
      return KnockoutObj;
    }

    function setGameItem(detail: any[], pos: number, oldArr: any[], level = 0) {
      if (level == 0) {
        const KnockoutObj = setPlayer(detail, pos);
        oldArr[0] = { games: [KnockoutObj] };
        if (KnockoutObj.detail_num_1 > -1) {
          oldArr = setGameItem(
            detail,
            KnockoutObj.detail_num_1,
            oldArr,
            level + 1
          );
        }
        if (KnockoutObj.detail_num_2 > -1) {
          oldArr = setGameItem(
            detail,
            KnockoutObj.detail_num_2,
            oldArr,
            level + 1
          );
        }
      } else {
        const KnockoutObj = setPlayer(detail, pos);
        if (!oldArr[level]) {
          oldArr[level] = {};
          oldArr[level].games = [];
        }
        oldArr[level].games.push(KnockoutObj);
        if (KnockoutObj.detail_num_1) {
          oldArr = setGameItem(
            detail,
            KnockoutObj.detail_num_1,
            oldArr,
            level + 1
          );
        }
        if (KnockoutObj.detail_num_2) {
          oldArr = setGameItem(
            detail,
            KnockoutObj.detail_num_2,
            oldArr,
            level + 1
          );
        }
      }

      return oldArr;
    }

    //处理赛况数据
    function getRoundsList() {
      if (
        props.info.detail &&
        props.info.detail.length > 0 &&
        props.info.level &&
        props.info.level.length > 0
      ) {
        let pLevel: any[] = [];
        // eslint-disable-next-line vue/no-mutating-props
        const levelReverse = props.info.level.reverse();
        for (let i = 0; i < levelReverse.length; i++) {
          const avid_pos_json = levelReverse[i].pos_json.filter(
            (point: number) => {
              return point > -1;
            }
          );
          let temp: any[] = [];
          for (const pos of avid_pos_json) {
            if (i == 0) {
              temp.push(pos);
            } else {
              let tag = true;
              const avid_pos_json_i = levelReverse[i - 1].pos_json.filter(
                (point: number) => {
                  return point > -1;
                }
              );
              for (const num of avid_pos_json_i) {
                const filterDetail = props.info.detail.filter((item: any) => {
                  return item.detail_num == Number(num);
                });
                if (filterDetail.length > 0) {
                  if (
                    filterDetail[0].detail_num_1 == pos ||
                    filterDetail[0].detail_num_2 == pos
                  ) {
                    tag = false;
                  }
                }
              }
              if (tag) {
                temp.push(pos);
              }
            }
          }
          pLevel = [...pLevel, ...temp];
        }
        for (const pos of pLevel) {
          const gamesArr = setGameItem(props.info.detail, pos, [], 0).reverse();
          rounds.value.push(gamesArr);
        }
      }
    }

    onMounted(() => {
      getRoundsList();
    });
    return {
      top,
      left,
      rounds,
      errImg,
    };
  },
});
</script>

<!--suppress CssInvalidPseudoSelector -->
<style lang="scss" scoped>
.Knockout-box {
  height: 100%;
  width: 100%;
  position: relative;
  background: #1f242c;
  .lazy-image {
    height: 24px;
    width: 24px;
  }
  .size-btn {
    position: absolute;
    bottom: 50px;
    right: 50px;
    z-index: 100;
    .icon {
      cursor: url("~@/assets/icons/home_mouse.png"), auto;
    }
    .disable {
      cursor: not-allowed;
    }
  }
  .scrollbar {
    width: 100%;
    height: 100%;
    padding: 10px 20px;
    .bracket-box {
      display: flex;
      justify-content: center;
      flex-direction: column;
      & > div {
        & + div {
          margin-top: 100px;
        }
      }
      cursor: move;
      .player-name {
        width: 70%;
      }
      .score {
        display: inline-block;
        background: #fe5e00;
        border-radius: 2px;
        height: 24px;
        width: 24px;
        line-height: 24px;
        text-align: center;
      }
      .player-top {
        height: 30px;
        width: 200px;
        line-height: 25px;
        display: flex;
        justify-content: center;
      }
      .player-bottom {
        height: 30px;
        width: 188px;
        line-height: 30px;
        display: flex;
        justify-content: center;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.6);
      }
    }
  }
}
</style>
