<template>
  <div
    class="not-login-box"
    :class="{ close: !show, 'not-show': !isTradition }"
  >
    <LazyImage class="close-icon" :img-url="closeIcon" @click="show = false" />
    <div class="box-header">
      <span>登陆小艾竞技，体验更多精彩！</span>
    </div>
    <div class="box-message">
      <LazyImage :img-url="bing" />
      <div class="text">热门赛事直播/滚球</div>
    </div>
    <div class="box-message">
      <LazyImage :img-url="bing" />
      <div class="text">多样玩法/投注</div>
    </div>
    <div class="box-login-btn">立即登陆</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, ref } from "vue";

export default defineComponent({
  name: "not-login-box",
  components: {},
  setup() {
    const isTradition = inject("isTradition", true);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const closeIcon = new URL("@/assets/icons/closed.png" ,import.meta.url).href;

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const bing = new URL("@/assets/icons/bling.png" ,import.meta.url).href;

    const show = ref(true);

    return { closeIcon, bing, show, isTradition };
  },
});
</script>

<style lang="scss" scoped>
.close {
  height: 0 !important;
}
.not-login-box {
  height: 180px;
  width: calc(100% - 46px);
  margin: 10px auto 20px;
  flex-shrink: 0;
  background: #3b4045;
  border-radius: 8px;
  overflow: hidden;
  backdrop-filter: blur(5px);
  position: relative;
  transition: height 0.2s ease-in-out;
  .box-message {
    font-size: 14px;
    color: #ffffff;
    font-weight: 500;
    height: 32px;
    display: flex;
    align-items: center;
    margin-left: 18px;
    .lazy-image {
      height: 24px;
      width: 24px;
      margin: 0 12px 0 6px;
    }
    .text {
      width: 160px;
      white-space: pre-wrap;
      line-height: 20px;
    }
  }
  .box-login-btn {
    height: 40px;
    width: 232px;
    margin: 12px auto;
    font-size: 14px;
    color: #ffffff;
    font-weight: 500;
    background-image: linear-gradient(90deg, #f16720 0%, #fd8908 94%);
    border-radius: 8px;
    text-align: center;
    white-space: pre-wrap;
    padding: 0 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: url("~@/assets/icons/home_mouse.png"), auto;
  }
  .close-icon {
    position: absolute;
    height: 24px;
    width: 24px;
    top: 14px;
    right: 20px;
    cursor: url("~@/assets/icons/home_mouse.png"), auto;
  }
  .box-header {
    height: 46px;
    display: flex;
    align-items: center;
    width: 200px;
    margin-left: 18px;
    margin-top: 3px;
    span {
      line-height: 20px;
      font-size: 14px;
      color: #fe5e00;
    }
  }
}
.not-show {
  width: 0;
  height: 0;
  overflow: hidden;
}
</style>
