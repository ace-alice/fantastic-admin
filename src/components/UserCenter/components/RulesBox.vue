<script lang="ts">
import type { Ref } from 'vue'
import { defineComponent, onMounted, reactive, ref } from 'vue'
import type { ElScrollbar } from 'element-plus'
import { getGameRuleApi } from '@/api/tools-api'

export default defineComponent({
  name: 'RulesBox',
  components: {},
  setup() {
    let gameRule = reactive<any>({
      category: [],
      rules: {},
    })

    const scrollbarRef: Ref<InstanceType<typeof ElScrollbar> | null>
      = ref(null)

    const currentTabId: Ref<number | string> = ref(0)

    // 获取玩法规则
    function getGameRules(category_id?: number | string) {
      getGameRuleApi(category_id ? { category_id } : {}).then((res: any) => {
        if (+res.data.code === 1) {
          gameRule = Object.assign(gameRule, res.data.data)
          currentTabId.value = (gameRule.rules as any)?.id
          if (scrollbarRef.value) {
            scrollbarRef.value.setScrollTop(0)
          }
        }
      })
    }

    function changeCurrentTabId(value: number | string) {
      currentTabId.value = value
      getGameRules(currentTabId.value)
    }

    onMounted(async () => {
      await getGameRules()
    })

    return { gameRule, currentTabId, changeCurrentTabId, scrollbarRef }
  },
})
</script>

<template>
  <div class="RulesBox tab-box">
    <div class="box-header">
      <div class="rule-box-tabs">
        <div
          v-for="tab in gameRule.category"
          :key="tab.id"
          class="rule-box-tab"
          :class="{ active: String(tab.id) === String(currentTabId) }"
          @click.stop="changeCurrentTabId(tab.id)"
        >
          {{ tab.cname }}
        </div>
      </div>
    </div>
    <div class="box-body">
      <el-scrollbar ref="scrollbarRef">
        <div class="rule-content" v-html="gameRule.rules.content" />
      </el-scrollbar>
    </div>
    <div class="box-footer">
      <div />
      <div>参与小艾电竞竞猜赛事即为阅读并同意以上规则</div>
    </div>
  </div>
</template>

<!-- suppress CssInvalidPseudoSelector -->
<style lang="scss" scoped>
.RulesBox {
  .box-body {
    padding: 12px;
    overflow: hidden;
    &:deep(.el-scrollbar) {
      background-color: #262d34;
    }
    .rule-content {
      padding: 24px;
      color: rgba(255, 255, 255, 0.6);
    }
  }
  .box-header {
    .rule-box-tabs {
      display: flex;
      .active {
        color: #fe5e00 !important;
      }
      .rule-box-tab {
        cursor: url("@/assets/icons/home_mouse.png"), auto;
        font-family: PingFangSC-Regular, PingFangSC-Medium, monospace;
        font-size: 16px;
        font-weight: 500;
        color: rgba(255, 255, 255, 0.5);
        transition: all 0.2s ease-in-out;
        &:hover {
          transform: scale(1.06);
          color: #ffffff;
        }
        & + .rule-box-tab {
          margin-left: 48px;
        }
      }
    }
  }
  .box-footer {
    font-family: PingFangSC-Regular, PingFangSC-Medium, monospace;
    font-size: 12px;
    color: #ffffff;
    div:nth-child(1) {
      height: 24px;
      width: 24px;
      border: 1px solid #ffffff20;
      border-radius: 6px;
      margin-right: 8px;
      position: relative;
      &:after {
        position: absolute;
        content: "";
        font-size: 24px;
        height: 22px;
        width: 22px;
        background-image: url("../../../src/assets/icons/choose.png");
        background-size: 100% 100%;
      }
    }
  }
}
</style>
