<script lang="ts">
import { defineComponent, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { gameInfoStore } from '@/store/gameInfo'

export default defineComponent({
  name: 'FilterCriteriaBox',
  components: {},
  emits: ['search'],
  setup(props: any, { emit }: any) {
    const formData: any = reactive({
      is_getprize: null,
      game_id: null,
    })

    const { gameList } = storeToRefs(gameInfoStore())

    const getprizeOptions = [
      {
        label: '未结算',
        value: 0,
      },
      {
        label: '已结算',
        value: 1,
      },
    ]

    const betTypeOptions = [
      {
        label: '单注',
        value: 1,
      },
      {
        label: '串关',
        value: 2,
      },
    ]

    function toSearch() {
      emit('search', formData)
    }

    return { formData, betTypeOptions, gameList, getprizeOptions, toSearch }
  },
})
</script>

<template>
  <div class="FilterCriteriaBox">
    <el-select
      v-model="formData.is_getprize"
      placeholder="全部注单"
      popper-class="filter-select"
      size="small"
      @change="toSearch"
    >
      <!-- suppress JSUnresolvedVariable -->
      <el-option
        v-for="item in getprizeOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-select
      v-model="formData.is_filter"
      placeholder="全部注单类型"
      popper-class="filter-select"
      size="small"
      @change="toSearch"
    >
      <!-- suppress JSUnresolvedVariable -->
      <el-option
        v-for="item in betTypeOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-select
      v-model="formData.game_id"
      placeholder="全部游戏"
      popper-class="filter-select"
      size="small"
      @change="toSearch"
    >
      <!-- suppress JSUnresolvedVariable -->
      <template v-for="item in gameList" :key="item.id">
        <el-option
          v-if="+item.id !== 0"
          :label="item.game_name"
          :value="item.id"
        />
      </template>
    </el-select>
    <div class="search-box">
      <div class="search" @click.stop="toSearch">
        搜索
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.FilterCriteriaBox {
  display: flex;
  align-items: center;
  height: 38px;
  padding: 0 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 25px;
  max-width: 460px;
  min-width: 340px;
  margin-left: 16px;
  //noinspection CssInvalidPseudoSelector
  :deep(.el-select--small) {
    --el-select-border-color-hover: #ffffff00;
    width: 26%;
    flex-shrink: 0;
    padding: 0 4px;
    border-right: 1.5px solid rgba(255, 255, 255, 0.2) !important;
    .el-input {
      --el-input-bg-color: #ffffff00;
      --el-input-text-color: #ffffff;
      font-family: PingFangSC-Regular, PingFangSC-Medium, monospace;
      font-size: 14px;
      border: none !important;
      .el-input__wrapper {
        box-shadow: none !important;
      }
    }
  }
  .search-box {
    flex-grow: 1;
    display: flex;
    justify-content: flex-end;
    .search {
      background-color: #fe5f00;
      border-radius: 25px;
      height: 26px;
      line-height: 26px;
      width: 84%;
      text-align: center;
      margin-right: 4px;
      font-size: 14px;
      color: #ffffff;
      font-weight: 500;
      cursor: url("@/assets/icons/home_mouse.png"), auto;
    }
  }
}
</style>
