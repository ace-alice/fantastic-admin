<script lang="ts">
import { defineComponent, ref } from 'vue'
import { getBetListStatus, parseTime } from '@/utils'
import Clipboard from '@/components/Clipboard/index.vue'

export default defineComponent({
  name: 'ParlayBetItem',
  components: { Clipboard },
  props: {
    betInfo: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  setup(props: any) {
    const openImage = new URL('@/assets/icons/spread-01.png', import.meta.url)
      .href

    const closeImage = new URL('@/assets/icons/spread-02.png', import.meta.url)
      .href

    const copyImage = new URL('@/assets/icons/time-Copy.png', import.meta.url)
      .href

    const winBg = new URL(
      '@/assets/icons/settlement-win-01.png',
      import.meta.url,
    ).href

    const loseBg = new URL(
      '@/assets/icons/settlement-lose-01.png',
      import.meta.url,
    ).href
    const statusInfo: any = getBetListStatus(props.betInfo)

    const groupHeight = ref(
      104.2 * (props.betInfo.parlay_info || []).length,
    )

    const showAll = ref(false)

    return {
      copyImage,
      statusInfo,
      openImage,
      closeImage,
      parseTime,
      getBetListStatus,
      winBg,
      loseBg,
      groupHeight,
      showAll,
    }
  },
})
</script>

<template>
  <div
    class="parlay-bet-item"
    :style="{ '--group-height': showAll ? groupHeight : 104.2 }"
  >
    <div class="bet-header">
      <LazyImage :img-url="betInfo.game_type_logo" />
      <div class="event-name">
        {{ betInfo.desc }}
      </div>
      <div class="bet-status" :style="{ color: statusInfo.color }">
        <span> {{ statusInfo.name }}</span>
        <LazyImage
          :img-url="showAll ? closeImage : openImage"
          @click="showAll = !showAll"
        />
      </div>
    </div>
    <div class="match-content-group">
      <div
        v-for="info in betInfo.parlay_info || []"
        :key="info.parlay_id"
        class="match-content"
      >
        <div>
          {{ info.desc }}
        </div>
        <div>{{ info.team_name_1 }} - VS - {{ info.team_name_2 }}</div>
        <div>
          <span>{{ $t("cart_bet_odds") }}</span>
          <span>x{{ info.odds }}</span>
        </div>
        <div
          v-if="[5, 6, '5', '6'].includes(getBetListStatus(info).code)"
          class="win-lose"
        >
          <LazyImage
            :img-url="+getBetListStatus(info).code === 5 ? winBg : loseBg"
          />
          <div class="text">
            {{ +getBetListStatus(info).code === 5 ? $t("win") : $t("lose") }}
          </div>
        </div>
      </div>
    </div>
    <div class="currency-content">
      <div>
        <span>{{ betInfo.desc }}:</span>
        <span>x{{ betInfo.odds }}</span>
      </div>
      <div>
        <span>{{ $t("bet_amount") }}:</span>
        <span>{{ betInfo.amount }}</span>
      </div>
      <div>
        <span>{{ $t("v_profit") }}:</span>
        <span v-if="betInfo.maybe_amount">{{
          betInfo.maybe_amount
        }}</span>
      </div>
      <div>
        <span>{{ $t("bet_currency") }}:{{
          betInfo.currency_info?.short_name || ""
        }}</span>
        <span v-if="betInfo.create_time_stamp">{{
          parseTime(
            Number(betInfo.create_time_stamp) * 1000,
            "{y}-{m}-{d} {h}:{i}:{s}",
          )
        }}</span>
      </div>
      <div>
        <span>{{ $t("order_id") }}:</span>
        <Clipboard :content="betInfo.order_id">
          <template #label>
            {{ betInfo.order_id }} <LazyImage :img-url="copyImage" />
          </template>
        </Clipboard>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.parlay-bet-item {
  width: 288px;
  margin: 0 auto 12px;
  padding: 10px;
  background: #181c22;
  border-radius: 16px;
  .match-content-group {
    transition: height 0.3s ease-in-out;
    height: calc(var(--group-height) * 1px);
    overflow: hidden;
  }
  .match-content {
    padding: 12px 6px 0;
    font-size: 14px;
    color: #ffffff;
    font-weight: 400;
    position: relative;
    .win-lose {
      position: absolute;
      height: 20px;
      width: 38px;
      right: 1px;
      top: 12px;
      .text {
        position: absolute;
        height: 20px;
        width: 38px;
        left: 0;
        top: 0;
        text-align: center;
        line-height: 20px;
        z-index: 100;
        margin: 0;
        padding: 0 0 0 5px;
      }
      .lazy-image {
        position: absolute;
        left: 0;
        top: 0;
        height: 20px;
        width: 38px;
      }
    }
    div:nth-child(2) {
      margin-top: 12px;
      color: rgba(255, 255, 255, 0.6);
    }
    div:nth-child(3) {
      height: 36px;
      padding: 0 10px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      margin-top: 12px;
      color: rgba(255, 255, 255, 0.6);
      font-size: 14px;
      font-weight: 500;
      display: flex;
      justify-content: space-between;
      align-items: center;
      span:nth-child(1) {
        font-family: PingFangSC-Medium, monospace;
        color: #ffffff;
      }
      span:nth-child(2) {
        font-family: Gotham-Medium, PingFangSC-Medium, monospace;
        color: #fecb00;
      }
    }
  }
  .bet-header {
    background: #262d34;
    border-radius: 8px 8px 0 0;
    height: 44px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 12px;
    .lazy-image {
      flex-shrink: 0;
      height: 32px;
      width: 32px;
    }
    .event-name {
      flex-grow: 1;
      padding: 0 14px;
      white-space: pre-wrap;
      font-family: PingFangSC-Regular, PingFangSC-Medium, monospace;
      font-size: 14px;
      color: #ffffff;
      font-weight: 400;
    }
    .bet-status {
      flex-shrink: 0;
      font-family: PingFangSC-Regular, PingFangSC-Medium, monospace;
      font-size: 14px;
      font-weight: 400;
      display: flex;
      align-items: center;
      .lazy-image {
        height: 24px;
        width: 24px;
        margin-left: 8px;
        cursor: url("~@/assets/icons/home_mouse.png"), auto;
      }
    }
  }
  .currency-content {
    padding: 12px 6px;
    font-family: PingFangSC-Regular, PingFangSC-Medium, monospace;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.6);
    font-weight: 400;
    & > div {
      display: flex;
      justify-content: space-between;
      align-items: center;
      &:nth-child(1) {
        justify-content: flex-start;
        span:nth-child(2) {
          color: #ffffff;
          margin-left: 8px;
        }
      }
      &:nth-child(2) {
        justify-content: flex-start;
        span:nth-child(2) {
          color: #ffffff;
          margin-left: 8px;
        }
      }
      &:nth-child(3) {
        justify-content: flex-start;
        span:nth-child(2) {
          color: #fecb00;
          margin-left: 8px;
        }
      }
      & + div {
        margin-top: 12px;
      }
    }
    .clipboard {
      display: flex;
      align-items: center;
      .lazy-image {
        margin-left: 12px;
        height: 24px;
        width: 24px;
      }
    }
  }
}
</style>
