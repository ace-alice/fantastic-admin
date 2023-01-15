<script lang="ts">
import type { Ref } from 'vue'
import { defineComponent, onMounted, reactive, ref } from 'vue'
import type { ElScrollbar } from 'element-plus'
import { getBettingRecord } from '@/api/tools-api'
import HistorySingleItem from '@/components/UserCenter/components/HistorySingleItem.vue'
import HistoryParlayItem from '@/components/UserCenter/components/HistoryParlayItem.vue'
import TimePickerBox from '@/components/TimePickerBox/index.vue'
import FilterCriteriaBox from '@/components/FilterCriteriaBox/index.vue'
import useImageResource from '@/hooks/useImageResource'

export default defineComponent({
  name: 'BetHistoryBox',
  components: {
    HistorySingleItem,
    HistoryParlayItem,
    TimePickerBox,
    FilterCriteriaBox,
  },
  setup() {
    const scrollbarRef: Ref<InstanceType<typeof ElScrollbar> | null>
      = ref(null)

    const historyCount = ref(0)

    const { emptyImg } = useImageResource()

    const historyList = ref<any[]>([])

    const loading = ref(false)

    const formData: any = reactive({
      start_time: null,
      end_time: null,
      page: 1,
      limit: 10,
      game_id: null,
      money_type: null,
      category_id: null,
      is_getprize: null,
      is_del: null,
    })

    function filterForm() {
      const temp: any = {}
      for (const fk of Object.keys(formData)) {
        if (formData[fk]) {
          temp[fk] = formData[fk]
        }
      }
      return temp
    }

    function changeTime(newTime: any) {
      Object.assign(formData, newTime)
      formData.page = 1
      getHistoryList()
    }

    function getHistoryList() {
      loading.value = true
      getBettingRecord(filterForm())
        .then(({ data }: any) => {
          if (+data.code === 1) {
            if (scrollbarRef.value) {
              scrollbarRef.value.setScrollTop(0)
            }
            historyCount.value = +data.data.total
            historyList.value = data.data.data
          }
        })
        .finally(() => {
          loading.value = false
        })
    }

    onMounted(() => {
      getHistoryList()
    })

    return {
      scrollbarRef,
      getHistoryList,
      formData,
      historyCount,
      historyList,
      changeTime,
      emptyImg,
      loading,
    }
  },
})
</script>

<template>
  <div class="BetHistoryBox tab-box">
    <div class="box-header">
      <TimePickerBox
        :end-time="formData.end_time"
        :start-time="formData.start_time"
        @change="changeTime"
      />
      <FilterCriteriaBox @search="changeTime" />
    </div>
    <div class="box-body">
      <el-scrollbar v-if="historyList.length > 0 || loading" ref="scrollbarRef">
        <template v-for="history in historyList" :key="history.id">
          <HistorySingleItem
            v-if="+history.is_parlay === 0"
            :info="history"
          />
          <HistoryParlayItem
            v-if="+history.is_parlay === 1"
            :info="history"
          />
        </template>
      </el-scrollbar>
      <div class="no-data">
        <LazyImage :img-url="emptyImg" />
        <div>{{ $t("no_bet_records") }}</div>
      </div>
    </div>
    <div class="box-footer">
      <div class="bet-num">
        注单数: {{ historyCount }}
      </div>
      <el-pagination
        v-model:page-size="formData.limit"
        v-model:current-page="formData.page"
        layout="prev, pager, next"
        :total="historyCount"
        @current-change="getHistoryList"
      />
    </div>
  </div>
</template>

<!-- suppress CssInvalidPseudoSelector -->
<style lang="scss" scoped>
.BetHistoryBox {
  .box-body {
    padding: 12px;
    overflow: hidden;
    .rule-content {
      padding: 24px;
    }
  }
  .box-footer {
    justify-content: space-between !important;
    .bet-num {
      font-family: PingFangSC-Medium, monospace;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.6);
      font-weight: 500;
    }
  }
  .no-data {
    display: flex;
    height: 100%;
    width: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .lazy-image {
      height: 100px;
    }
    font-family: PingFangSC-Regular, monospace;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.6);
    font-weight: 400;
    div:nth-child(2) {
      margin-top: 16px;
    }
  }
}
</style>
