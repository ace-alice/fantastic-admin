<script lang="ts">
import { defineComponent } from 'vue'
import championTeamPointHook from '@/hooks/championTeamPointHook'

export default defineComponent({
  name: 'TeamBox',
  components: {},
  props: {
    index: {
      type: Number,
      default: 0,
    },
    itemInfo: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  setup(props: any) {
    const { currentTeamPoint, hasAdd, isAllowAddCart, toAddCart, animateType }
      = championTeamPointHook(props.itemInfo)
    return { currentTeamPoint, hasAdd, isAllowAddCart, toAddCart, animateType }
  },
})
</script>

<template>
  <div
    class="TeamBox" :class="{
      'to-center': index % 3 === 1,
      'to-right': index % 3 === 2,
    }"
  >
    <div
      class="team-box-content" :class="{
        [animateType]: true,
        [`${animateType}-border`]: !hasAdd,
        'cart-active': hasAdd,
      }"
      @click.stop="toAddCart"
    >
      <LazyImage :img-url="itemInfo.team_logo || ''" />
      <div class="team-name">
        {{ itemInfo.desc }}
      </div>
      <div class="point">
        {{ currentTeamPoint ? currentTeamPoint.point : "" }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.to-center {
  justify-content: center;
}
.to-right {
  justify-content: flex-end;
}
.TeamBox {
  width: 33.3%;
  height: 60px;
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  .cart-active {
    background-image: linear-gradient(
      90deg,
      #f16720 0%,
      #fd8908 94%
    ) !important;
  }
  .team-box-content {
    height: 60px;
    width: 94%;
    flex-shrink: 0;
    padding: 0 16px;
    cursor: url("@/assets/icons/home_mouse.png"), auto;
    background-image: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0) 50%,
      rgba(146, 149, 147, 0.31) 99%
    );
    border: 1px solid rgba(104, 104, 104, 1);
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 16px;
    font-weight: 500;
    .lazy-image {
      height: 32px;
      width: 32px;
      flex-shrink: 0;
    }
    .team-name {
      flex-grow: 1;
      padding: 0 14px;
      word-break: break-all;
      font-family: PingFangSC-Medium, monospace;
      color: rgba(255, 255, 255, 0.8);
    }
    .point {
      font-family: Gotham-Medium, PingFangSC-Medium, monospace;
      color: #f2f2f6;
      &:before {
        left: -20px;
      }
    }
  }
}
</style>
