<script lang="ts">
import { defineComponent } from 'vue'
import { getBetListStatus, parseTime, toFixedNumber } from '@/utils'
import CountTo from '@/components/VueCountTo/index.vue'
import Clipboard from '@/components/Clipboard/index.vue'

export default defineComponent({
  name: 'SingleBetItem',
  components: { CountTo, Clipboard },
  props: {
    betInfo: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  setup(props: any) {
    const copyImage = new URL('@/assets/icons/time-Copy.png', import.meta.url).href

    const statusInfo: any = getBetListStatus(props.betInfo)

    return {
      statusInfo,
      toFixedNumber,
      parseTime,
      copyImage,
    }
  },
})
</script>

<template>
  <div class="single-bet-Item">
    <div class="bet-header">
      <LazyImage :img-url="betInfo.game_type_logo" />
      <div class="event-name">
        {{ betInfo.event_name }}
      </div>
      <div class="bet-status" :style="{ color: statusInfo.color }">
        {{ statusInfo.name }}
      </div>
    </div>
    <div class="match-content">
      <div>
        {{ betInfo.desc }}
      </div>
      <div v-if="!betInfo.is_champion">
        {{ betInfo.team_name_1 }} - VS - {{ betInfo.team_name_2 }}
      </div>
    </div>
    <div class="bet-content">
      <div>
        <span>{{ $t("cart_bet_odds") }}</span>
        <span>x{{ betInfo.odds }}</span>
      </div>
      <div>
        <span>{{ $t("bet_amount") }}</span>
        <span><CountTo :start-val="0" /></span>
      </div>
      <div>
        <span>{{ $t("v_profit") }}</span>
        <span class="amount">
          <CountTo
            v-if="betInfo.maybe_amount"
            :start-val="0"
            :end-val="toFixedNumber(betInfo.maybe_amount)"
          />
          <span v-else />
        </span>
      </div>
    </div>
    <div class="currency-content">
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
.single-bet-Item {
  width: 288px;
  margin: 0 auto 12px;
  padding: 10px;
  background: #181c22;
  border-radius: 16px;
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
    }
  }
  .match-content {
    padding: 16px 6px 12px;
    font-family: PingFangSC-Regular, PingFangSC-Medium, monospace;
    font-size: 14px;
    color: #ffffff;
    font-weight: 400;
    div:nth-child(2) {
      margin-top: 12px;
      color: rgba(255, 255, 255, 0.6);
    }
  }
  .bet-content {
    width: calc(100% - 6px);
    margin: auto;
    padding: 12px 0;
    font-family: PingFangSC-Medium, monospace;
    font-size: 14px;
    color: #ffffff;
    line-height: 20px;
    font-weight: 500;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    & > div {
      display: flex;
      justify-content: space-between;
      span:nth-child(2) {
        font-family: Gotham-Medium, monospace;
      }
      & + div {
        margin-top: 12px;
      }
      .amount {
        color: #fecb00;
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
