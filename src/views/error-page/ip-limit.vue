<template>
  <div class="err_page">
    <LazyImage :img-url="textLogo" />
    <div class="text text1">
      {{ errorText || error403 }}
    </div>
    <div class="text text2">IP: {{ ip }}（{{ cityname }}）</div>
  </div>
</template>
<script lang="ts">
import { useRoute } from "vue-router";
import { defineComponent, onMounted, Ref, ref } from "vue";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "errPage",
  components: {},
  setup() {
    const i18n = useI18n();
    const route = useRoute();
    const error403 = ref(i18n.t("error_info_1"));
    const errorText: Ref<any> = ref("");
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const textLogo = new URL("@/assets/images/que_xianzhi.png" ,import.meta.url).href;
    const ip = localStorage.getItem("Ip");
    const cityname = localStorage.getItem("cityname");
    onMounted(() => {
      errorText.value = route.query.message;
    });
    return {
      error403,
      textLogo,
      cityname,
      ip,
      errorText,
    };
  },
});
</script>

<style lang="scss" scoped>
.err_page {
  width: 100%;
  height: 100%;
  background-color: #161b21;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .lazy-image {
    height: 348px;
    width: 362px;
  }
  .text {
    font-size: 16px;
    line-height: 32px;
  }
  .text1 {
    color: #ffffff;
  }
  .text2 {
    color: #fe5e00;
  }
}
</style>
