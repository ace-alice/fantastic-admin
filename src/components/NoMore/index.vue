<template>
  <div class="no-more">
    <span class="text">{{ text }}</span>
  </div>
</template>

<script lang="ts">
export default {
  name: "ia-no-more",
  props: {
    text: {
      type: String,
      default: () => "暂无更多",
    },
  },
  setup() {
    return {};
  },
};
</script>

<style scoped lang="scss">
.no-more {
  margin-top: 32px;
  margin-bottom: 154px;
  text-align: center;
  .text {
    position: relative;
    display: inline-block;
    font-size: 14px;
    color: var(--color-white);
    font-weight: 400;
    opacity: 0.4;
    &:before {
      position: absolute;
      background: var(--color-white);
      opacity: 0.4;
      content: "";
      top: 50%;
      left: 100%;
      width: 33px;
      height: 1px;
      margin-left: 24px;
    }
    &:after {
      position: absolute;
      background: var(--color-white);
      opacity: 0.4;
      content: "";
      top: 50%;
      right: 100%;
      width: 33px;
      height: 1px;
      margin-right: 24px;
    }
  }
}
</style>
