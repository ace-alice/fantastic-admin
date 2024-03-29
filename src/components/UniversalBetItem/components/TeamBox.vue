<script lang="ts">
import { inject } from 'vue'
import lazyImage from '@/components/lazyImage/index.vue'
import teamPointHook from '@/hooks/teamPointHook'
import type { BetType } from '@/interface/shopCart'
import useImageResource from '@/hooks/useImageResource'
export default {
  name: 'TeamBoxUn',
  components: { LazyImage: lazyImage },
  props: {
    itemInfo: {
      type: Object,
      default: () => {
        return {}
      },
    },
    index: {
      type: Number,
      default: () => 0,
    },
  },
  setup(props: any) {
    const betType: BetType = inject('betType', 'single')
    const { teamImg, lockIcon } = useImageResource()
    const {
      currentTeamPointInfo,
      teamName,
      teamLogo,
      toAddShopCart,
      hasAdd,
      animateType,
      pointStatus,
      currentPlayInfo,
      isNotAllowAdd,
      statusIcon,
    } = teamPointHook(props.itemInfo as any, betType, props.index)

    const winImage = new URL('@/assets/icons/status-1.png', import.meta.url).href

    const failImage = new URL('@/assets/icons/status-2.png', import.meta.url).href

    return {
      teamImg,
      teamName,
      teamLogo,
      currentTeamPointInfo,
      currentPlayInfo,
      toAddShopCart,
      hasAdd,
      pointStatus,
      animateType,
      lockIcon,
      isNotAllowAdd,
      winImage,
      failImage,
      statusIcon,
    }
  },
}
</script>

<template>
  <div
    class="team-box-un" :class="{
      [animateType]: true,
      [`${animateType}-border`]: !hasAdd,
      'not-allowed': isNotAllowAdd,
      'right-to-left': index % 2,
      'cart-active': hasAdd,
    }"
    @click.stop="toAddShopCart"
  >
    <div class="team-logo">
      <LazyImage :img-url="teamLogo" />
    </div>
    <div class="desc">
      {{ teamName }}
    </div>
    <div
      v-if="currentPlayInfo && currentTeamPointInfo" class="point"
      :class="{ [index % 2 ? 'box-right' : 'box-normal']: true }"
    >
      <span v-if="!isNotAllowAdd">
        {{ currentTeamPointInfo.point }}
      </span>
      <span v-else-if="pointStatus === 'cleared'">
        <LazyImage :img-url="statusIcon === 'win' ? winImage : failImage" />
      </span>
      <span v-else>
        <LazyImage class="lock-icon" :img-url="lockIcon" />
      </span>
    </div>
    <div v-else class="point" />
  </div>
</template>

<style scoped lang="scss">
.right-to-left {
  flex-direction: row-reverse;
  .desc {
    text-align: right;
  }
}
.team-box-un {
  &:hover {
    transform: scale(1.04);
  }
  transition: transform 0.2s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 26.4%;
  height: 58px;
  color: rgba(255, 255, 255, 0.8);
  overflow-x: visible;
  background-image: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 50%,
    rgba(146, 149, 147, 0.31) 99%
  );
  border: 1px solid rgba(104, 104, 104, 1);
  border-radius: 6px;
  cursor: url("@/assets/icons/home_mouse_32.png"), auto;
  .team-logo {
    width: 58px;
    flex-shrink: 0;
    .lazy-image {
      margin: auto;
      width: 32px;
      height: 32px;
    }
  }
  .desc {
    flex-grow: 1;
    white-space: pre-wrap;
    word-break: break-word;
    font-family: PingFangSC-Medium, monospace;
    font-size: 16px;
    font-weight: 500;
  }
  .point {
    text-align: center;
    font-family: Gotham-Medium, PingFangSC-Medium, monospace;
    font-size: 16px;
    color: #f2f2f6;
    font-weight: 500;
    flex-shrink: 0;
    .lazy-image {
      width: 24px !important;
      height: 24px !important;
    }
    .lock-icon {
      width: 22px !important;
      height: 22px !important;
      opacity: 0.2;
    }
  }
}
.cart-active {
  background-image: linear-gradient(90deg, #f16720 0%, #fd8908 94%) !important;
  border: 1px solid rgba(104, 104, 104, 0) !important;
  color: #ffffff !important;
  font-weight: 600 !important;
}
.not-allowed {
  cursor: not-allowed !important;
}
</style>
