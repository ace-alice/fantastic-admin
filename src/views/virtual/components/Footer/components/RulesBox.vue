<template>
  <div
    class="tools-item"
    @click.stop="openDialog"
    v-tooltip="{ width: 10, message: $t('v_rules') }"
  >
    {{ $t("v_rules") }}
  </div>
  <el-dialog
    v-model="dialogVisible"
    class="virtual-rule"
    :title="$t('v_rules')"
    :center="true"
    width="70%"
  >
    <div v-html="rules"></div>
  </el-dialog>
</template>

<script lang="ts">
import { getVirtualRules } from "@/api/virtual";
import { computed, defineComponent, ref } from "vue";
import { storeToRefs } from "pinia";
import { userInfoStore } from "@/store/userInfo";

export default defineComponent({
  setup() {
    const { langConfig } = storeToRefs(userInfoStore());

    const lang = computed(() => {
      return langConfig.value.id || 1;
    });

    const dialogVisible = ref(false);

    function openDialog() {
      getRule();
    }

    //游戏规则
    const rules = ref("");
    //获取游戏规则
    function getRule() {
      getVirtualRules({ lang: lang.value })
        .then((res: any) => {
          if (+res.data.status === 1) {
            rules.value = res.data.data.rules;
          }
        })
        .finally(() => {
          dialogVisible.value = true;
        });
    }

    return { dialogVisible, openDialog, rules };
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
