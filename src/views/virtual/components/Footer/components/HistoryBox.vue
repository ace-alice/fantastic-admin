<!--suppress JSUnresolvedVariable, JSUnresolvedVariable -->
<template>
  <div
    class="tools-item"
    @click.stop="openDialog"
    v-tooltip="{ width: 10, message: $t('v_bet_records') }"
  >
    {{ $t("v_bet_records") }}
  </div>
  <el-dialog
    v-model="dialogVisible"
    class="virtual-rule"
    :center="true"
    :show-close="!showDetail"
    :before-close="closeDialog"
    width="70%"
  >
    <template #header>
      <div class="bet-title">
        {{ showDetail ? $t("v_game_results") : $t("v_bet_records") }}
      </div>
      <div v-if="showDetail" class="close-icon exit" @click.stop="closeDetail">
        {{ $t("v_exit") }}
      </div>
    </template>
    <div v-show="!showDetail">
      <div class="search-box">
        <!--        <DatePicker :shortcutButton="false" @timeChange="timeChange" />-->
        <div class="search" @click="getHistoryFun(true)">
          {{ $t("search") }}
        </div>
      </div>
      <el-table
        ref="betTable"
        :data="historyList.list"
        row-key="id"
        stripe
        v-loading="loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        height="400"
      >
        <el-table-column
          prop="order_no"
          :label="$t('v_round_ID')"
          align="center"
          width="200"
        >
        </el-table-column>
        <el-table-column
          :label="$t('v_settle_time')"
          align="center"
          width="180"
        >
          <template #default="props">
            <span>{{
              props.row.bonus_time === 0
                ? $t("v_not_yet_settled")
                : props.row.bonus_time
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="currency_name"
          :label="$t('v_currency')"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="total_amount"
          :label="$t('v_bet_amount')"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="total_bonus"
          :label="$t('v_winning_amount')"
          align="center"
        >
        </el-table-column>
        <el-table-column :label="$t('v_game_results')" align="center">
          <template #default="props">
            <el-button
              class="virtual-button"
              @click="checkDetails(props.row.order_no)"
              >{{ $t("v_see_details") }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="footer">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="historyList.total"
          v-model:current-page="page"
          @current-change="getHistoryFun(false)"
        />
        <span class="dialog-footer">
          {{ $t("sum") }}
          <span style="color: #bd373e">{{ historyList.total }}</span>
          {{ $t("sum_records_count") }}
        </span>
      </div>
    </div>
    <div v-show="showDetail" class="detail-box">
      <div class="detail-box-item">
        <div
          class="detail-box-item-flex"
          v-for="(item, index) in historyDetail.type1"
          :key="index"
        >
          <div class="play-name" v-if="+item.team_type === 1">
            {{ item.play_name }}
          </div>
          <div
            class="team-name"
            :class="{
              'left-team': +item.team_type === 1,
              'right-team': +item.team_type === 2,
            }"
          >
            {{ item.team_name }}
          </div>
          <div
            class="prop is-title"
            :class="{
              'left-prop': +item.team_type === 1,
              'right-prop': +item.team_type === 2,
            }"
          >
            <div>{{ $t("v_profit") }}</div>
            <div>{{ $t("v_bet") }}</div>
            <div>{{ $t("v_odds") }}</div>
          </div>
          <div
            class="prop"
            :class="{
              'left-prop': +item.team_type === 1,
              'right-prop': +item.team_type === 2,
              'is-win': item.total_profit > 0 || +item.is_results === 1,
            }"
          >
            <div
              :class="{
                'is-profit': Number(item.total_profit) > 0,
                'is-lose': Number(item.total_profit) < 0,
              }"
            >
              {{ item.total_profit }}
            </div>
            <div>{{ item.total_amount }}</div>
            <div>{{ item.odds }}</div>
          </div>
        </div>
      </div>
      <div class="detail-box-item">
        <div
          class="detail-box-item-flex"
          v-for="(item, index) in historyDetail.type2"
          :key="index"
        >
          <div class="play-name" v-if="+item.team_type === 1">
            {{ item.play_name }}
          </div>
          <div
            class="prop"
            :class="{
              'left-prop': +item.team_type === 1,
              'right-prop': +item.team_type === 2,
              'is-win': item.total_profit > 0 || +item.is_results === 1,
            }"
          >
            <div
              :class="{
                'is-profit': Number(item.total_profit) > 0,
                'is-lose': Number(item.total_profit) < 0,
              }"
            >
              {{ item.total_profit }}
            </div>
            <div>{{ item.total_amount }}</div>
            <div>{{ item.odds }}</div>
          </div>
        </div>
      </div>
      <div class="detail-box-item">
        <div
          class="detail-box-item-flex"
          v-for="(item, index) in historyDetail.type3"
          :key="index"
        >
          <div class="play-name" v-if="+item.team_type === 1">
            {{ item.play_name }}
          </div>
          <div
            class="prop"
            :class="{
              'left-prop': +item.team_type === 1,
              'right-prop': +item.team_type === 2,
              'is-win': item.total_profit > 0 || +item.is_results === 1,
            }"
          >
            <div
              :class="{
                'is-profit': Number(item.total_profit) > 0,
                'is-lose': Number(item.total_profit) < 0,
              }"
            >
              {{ item.total_profit }}
            </div>
            <div>{{ item.total_amount }}</div>
            <div>{{ item.odds }}</div>
          </div>
        </div>
      </div>
      <div class="detail-box-element">
        <div class="play-name">{{ $t("v_first_slain_dragon_element") }}</div>
        <div class="element-item is-title">
          <div>{{ $t("v_first_slain_dragon_element") }}</div>
          <div>{{ $t("v_odds") }}</div>
          <div>{{ $t("v_bet") }}</div>
          <div>{{ $t("v_profit") }}</div>
        </div>
        <div
          class="element-item"
          v-for="(item, index) in historyDetail.type4"
          :class="{ 'is-win': item.total_profit > 0 || +item.is_results === 1 }"
          :key="index"
        >
          <div>{{ item.team_name }}</div>
          <div>{{ item.odds }}</div>
          <div>{{ item.total_amount }}</div>
          <div
            :class="{
              'is-profit': Number(item.total_profit) > 0,
              'is-lose': Number(item.total_profit) < 0,
            }"
          >
            {{ item.total_profit }}
          </div>
        </div>
      </div>
      <div class="detail-box-element pentakill">
        <div class="play-name">{{ $t("v_if_there_will_be_penta_kill") }}</div>
        <div class="element-item is-title">
          <div>{{ $t("v_there_is_penta_kill_or_not") }}</div>
          <div>{{ $t("v_odds") }}</div>
          <div>{{ $t("v_bet") }}</div>
          <div>{{ $t("v_profit") }}</div>
        </div>
        <div
          class="element-item"
          v-for="(item, index) in historyDetail.type5"
          :class="{ 'is-win': item.total_profit > 0 || +item.is_results === 1 }"
          :key="index"
        >
          <div>{{ item.team_name }}</div>
          <div>{{ item.odds }}</div>
          <div>{{ item.total_amount }}</div>
          <div
            :class="{
              'is-profit': Number(item.total_profit) > 0,
              'is-lose': Number(item.total_profit) < 0,
            }"
          >
            {{ item.total_profit }}
          </div>
        </div>
      </div>

      <div class="detail-footer">
        <div class="detail-footer-block"></div>
        <span>{{ $t("v_yellow_winning_info") }}</span>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { getVirGameTotalInfo, getVirtualHistory } from "@/api/virtual";
import { defineComponent, reactive, ref, toRefs } from "vue";
// import DatePicker from "@/components/DatePicker/index.vue";
import { parseTime } from "@/utils";

export default defineComponent({
  components: {
    // DatePicker,
  },
  setup() {
    // const store = useStore();

    // const lang = computed(() => {
    //   store.getters.langConfig.id || 1;
    // });

    const dialogVisible = ref(false);

    async function openDialog() {
      await getHistoryFun(true);
      dialogVisible.value = true;
    }

    //记录列表
    let historyList = reactive({
      list: [],
      total: 0,
    });

    const loading = ref(false);

    let formData = reactive({
      start_time: parseTime(new Date(), "{y}/{m}/{d}"),
      end_time: null,
      page: 1,
      limit: 10,
    });

    //获取游戏规则
    function getHistoryFun(bool = false) {
      return new Promise((resolve) => {
        if (bool) {
          formData.page = 1;
        }
        loading.value = true;
        getVirtualHistory(formData)
          .then((res: any) => {
            if (+res.data.status === 1) {
              historyList.list = res.data.data.list;
              historyList.total = res.data.data.total;
              resolve(true);
            } else {
              resolve(false);
            }
          })
          .catch(() => {
            resolve(false);
          })
          .finally(() => {
            loading.value = false;
          });
      });
    }

    //时间改变时更改时间
    async function timeChange(time: { startTime: any; endTime: any }) {
      Object.assign(formData, {
        start_time: time.startTime,
        end_time: time.endTime,
        page: 1,
      });
      await getHistoryFun();
    }

    function closeDialog() {
      dialogVisible.value = false;
      setTimeout(() => {
        showDetail.value = false;
      }, 500);
    }
    //是否显示游戏详情
    const showDetail = ref(false);

    //单注详情
    const historyDetail = ref<any>({});

    //获取游戏详情
    function checkDetails(orderNo: string) {
      let params = {
        order_no: orderNo,
        game_type_id: 1,
      };
      getVirGameTotalInfo(params)
        .then((res: any) => {
          if (+res.data.status === 1) {
            historyDetail.value = res.data.data;
          }
        })
        .finally(() => {
          showDetail.value = true;
        });
    }

    function closeDetail() {
      showDetail.value = false;
    }

    return {
      dialogVisible,
      openDialog,
      historyList,
      historyDetail,
      showDetail,
      loading,
      checkDetails,
      closeDetail,
      getHistoryFun,
      closeDialog,
      ...toRefs(formData),
      timeChange,
    };
  },
});
</script>

<!--suppress CssInvalidFunction -->
<style lang="scss" scoped>
@media screen and (max-width: 1199px) {
  .tools-item {
    --px_100: 1200px/19;
  }
}
@media only screen and (min-width: 1200px) and (max-width: 1600px) {
  .tools-item {
    --px_100: 100vw/19;
  }
}

@media screen and (min-width: 1601px) {
  .tools-item {
    --px_100: 1600px/19;
  }
}
.tools-item {
  flex-shrink: 0;
  height: calc(0.6 * var(--px_100));
  width: calc(0.8 * var(--px_100));
  font-size: calc(0.2 * var(--px_100));
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  cursor: url("~@/assets/icons/home_mouse.png"), auto;
  .test {
    position: relative;
    left: 0;
    filter: drop-shadow(#f5c24c 80px 0);
  }
  &:hover {
    .test {
      left: -80px;
    }
  }
}
.active {
  .test {
    left: -80px;
  }
}
</style>
