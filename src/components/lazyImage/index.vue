<template>
  <div class="lazy-image">
    <el-image :src="imgUrl" fit="contain">
      <template #error>
        <img :src="errImg" alt="" />
      </template>
      <template #placeholder>
        <div></div>
      </template>
    </el-image>
  </div>
</template>

<script lang="ts">
import errImg from "@/assets/images/logo-error.png";
export default {
  name: "ia-lazy-img",
  props: {
    imgUrl: {
      type: String,
      default: "",
    },
    errImg: {
      type: String,
      default: () => errImg,
    },
    fitType: { type: String, default: "contain" },
  },

  setup() {
    return {};
  },
};
</script>

<style scoped lang="scss">
::v-deep(.el-image) {
  display: block;
  width: 100%;
  height: 100%;
  background: none;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
