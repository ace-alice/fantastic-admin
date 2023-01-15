<script lang="ts">
import type { Ref } from 'vue'
import { onActivated, reactive, ref } from 'vue'
import type { ElScrollbar } from 'element-plus'
import SingleBetItem from './components/single-bet-Item.vue'
import ParlayBetItem from './components/parlay-bet-item.vue'
import Empty from '@/components/Empty/index.vue'
import { getBetList } from '@/api/store-user-info'
export default {
  name: 'IaBetList',
  components: { Empty, SingleBetItem, ParlayBetItem },
  setup() {
    const betList: Ref<any[]> = ref([])

    const loading = ref(false)

    const count = ref(0)

    const formData = reactive({
      page: 0,
    })

    function toGetBetList() {
      loading.value = true
      formData.page++
      getBetList(formData)
        .then((res: any) => {
          if (+res.data.code === 1) {
            count.value = Number(res.data.data.total || 0)
            if (formData.page === 1) {
              betList.value = res.data.data.data
            }
            else {
              betList.value = [...betList.value, ...res.data.data.data]
            }
          }
          else {
            formData.page--
          }
        })
        .catch(() => formData.page--)
        .finally(() => {
          loading.value = false
        })
    }

    const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>()

    const betListRef = ref<HTMLDivElement>()

    function scrollHandle({ scrollTop }: { scrollTop: number }) {
      if (
        betListRef.value
        && scrollbarRef.value
        && betListRef.value?.clientHeight
          - scrollbarRef.value?.$el.clientHeight
          - scrollTop
          < 80
        && !loading.value
      ) {
        toGetBetList()
      }
    }

    function refreshList() {
      formData.page = 0
      toGetBetList()
    }

    onActivated(() => {
      refreshList()
    })

    return { betList, loading, scrollHandle, scrollbarRef, betListRef }
  },
}
</script>

<template>
  <div class="bet-list">
    <el-scrollbar ref="scrollbarRef" @scroll="scrollHandle">
      <div ref="betListRef">
        <transition-group name="list" appear>
          <template v-for="betInfo in betList" :key="betInfo.id">
            <SingleBetItem v-if="!betInfo.is_parlay" :bet-info="betInfo" />
            <ParlayBetItem v-if="betInfo.is_parlay" :bet-info="betInfo" />
          </template>
        </transition-group>
      </div>
      <Empty v-if="betList.length === 0 && !loading" />
    </el-scrollbar>
  </div>
</template>

<style scoped lang="scss">
.bet-list {
  height: calc(100% - 20px);
  width: 100%;
  .ia-empty {
    margin-top: 240px;
  }
}
</style>
