<script lang="ts">
import { defineComponent } from 'vue'
import { getBetListStatus, parseTime, toFixedNumber } from '@/utils'
import Clipboard from '@/components/Clipboard/index.vue'

export default defineComponent({
  name: 'HistoryParlayItem',
  components: { Clipboard },
  props: {
    info: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  setup() {
    const copyImage = new URL('@/assets/icons/time-Copy.png', import.meta.url).href
    return { toFixedNumber, copyImage, getBetListStatus, parseTime }
  },
})
</script>

<template>
  <div class="HistoryParlayItem">
    <div class="parlay-body">
      <div
        v-for="parlayInfo in info.parlay_info"
        :key="parlayInfo.parlay_id"
        class="parlay-info"
      >
        <div class="body-logo">
          <LazyImage :img-url="parlayInfo.game_type_logo" />
          <div class="single-tag">
            {{ $t("single_bet") }}
          </div>
        </div>
        <div class="body-info">
          <div>{{ parlayInfo.event_name }}</div>
          <div>{{ parlayInfo.desc }}</div>
          <div v-if="!+parlayInfo.is_champion">
            {{ parlayInfo.team_name_1 }} - Vs -
            {{ parlayInfo.team_name_2 }}
          </div>
        </div>
        <div class="body-status">
          <div class="odds-status">
            <div>x{{ parlayInfo.odds }}</div>
            <div
              :style="{
                color: getBetListStatus(parlayInfo).color,
              }"
            >
              {{ getBetListStatus(parlayInfo).name }}
            </div>
          </div>
          <div
            v-if="[5, 6, '5', '6'].includes(getBetListStatus(parlayInfo).code)" class="win-lose"
            :class="{
              'win-bg': [5, '5'].includes(getBetListStatus(parlayInfo).code),
              'lose-bg': [6, '6'].includes(getBetListStatus(parlayInfo).code),
            }"
          >
            {{ getBetListStatus(parlayInfo).name }}
          </div>
        </div>
      </div>
    </div>
    <div class="parlay-footer">
      <div class="footer-top">
        <div>{{ info.desc }}</div>
        <div class="odd-status">
          <div>x{{ info.odds }}</div>
          <div
            :style="{
              color: getBetListStatus(info).color,
            }"
          >
            {{ getBetListStatus(info).name }}
          </div>
        </div>
      </div>
      <div class="bottom">
        <div>
          {{ $t("bet_amount") }}:{{
            info.amount ? toFixedNumber(info.amount) : "--"
          }}
        </div>
        <div>
          {{ $t("bet_clearing_amount") }}:
          <span
            :class="Number(info.win_lose) < 0 ? 'red-color' : 'green-color'"
          >{{ info.win_lose > 0 ? "+" : ""
          }}{{ toFixedNumber(info.win_lose) }}</span>
        </div>
        <div>
          {{ $t("order_id") }}:
          <Clipboard :content="info.order_id">
            <template #label>
              <span class="order-id">
                <span>{{ info.order_id }}</span>
                <LazyImage :img-url="copyImage" />
              </span>
            </template>
          </Clipboard>
        </div>
        <div>
          {{ info.create_time ? parseTime(info.create_time) : "--" }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.HistoryParlayItem {
  background: #262d34;
  flex-shrink: 0;
  margin-bottom: 8px;
  .parlay-body {
    .parlay-info {
      & + .parlay-info {
        //border-top: 1px solid rgba(255, 255, 255, 0.1);
        position: relative;
        &:after {
          content: "";
          height: 1px;
          position: absolute;
          top: 0;
          width: 96%;
          left: 2%;
          background-color: rgba(255, 255, 255, 0.1);
        }
      }
      padding: 14px 4%;
      display: flex;
      justify-content: space-between;
      .body-status {
        width: 120px;
        flex-shrink: 0;
        display: flex;
        justify-content: space-between;
        flex-direction: row-reverse;
        .odds-status {
          & > div:nth-child(1) {
            font-family: Gotham-Medium, PingFangSC-Medium, monospace;
            font-size: 16px;
            color: #ffffff;
            font-weight: 500;
            margin-bottom: 8px;
          }
          & > div:nth-child(2) {
            font-family: PingFangSC-Regular, PingFangSC-Medium, monospace;
            font-size: 14px;
            color: #fecb00;
          }
        }
        .win-lose {
          height: 20px;
          width: 38px;
          text-align: center;
          line-height: 20px;
          font-family: PingFangSC-Regular, PingFangSC-Medium, monospace;
          font-size: 14px;
          color: #ffffff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          background-size: 100% 100%;
          padding-left: 6px;
        }
        .win-bg {
          background-image: url("../../../assets/icons/settlement-win-01.png");
        }
        .lose-bg {
          background-image: url("../../../assets/icons/settlement-lose-01.png");
        }
      }
      .body-logo {
        padding-right: 56px;
        flex-shrink: 1;
        .lazy-image {
          height: 32px;
          width: 32px;
          margin-bottom: 8px;
        }
        .single-tag {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          font-family: PingFangSC-Regular, PingFangSC-Medium, monospace;
          font-size: 14px;
          color: #ffffff;
          padding: 2px 8px;
        }
      }
      .body-info {
        font-family: PingFangSC-Regular, PingFangSC-Medium, monospace;
        flex-grow: 1;
        & > div + div {
          margin-top: 12px;
        }
        & > div:nth-child(1) {
          font-size: 16px;
          color: #ffffff;
        }
        & > div:nth-child(2) {
          font-size: 14px;
          color: #ffffff;
        }
        & > div:nth-child(3) {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.6);
        }
      }
    }
  }
  .parlay-footer {
    .footer-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .odd-status {
        width: 146px;
        flex-shrink: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #ffffff;
      }
    }
    height: 64px;
    padding: 12px 4%;
    background: #1c252e;
    font-family: PingFangSC-Regular, PingFangSC-Medium, monospace;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.6);
    .bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 4px;
      & > div {
        display: flex;
        align-items: center;
      }
      & > div:nth-child(1) {
        width: 20%;
        flex-shrink: 0;
      }
      & > div:nth-child(2) {
        width: 20%;
        flex-shrink: 0;
        span {
          margin-left: 8px;
        }
      }
      & > div:nth-child(3) {
        flex-grow: 1;
      }
      .order-id {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        .lazy-image {
          height: 24px;
          width: 24px;
        }
      }
    }
  }
}
.green-color {
  color: green !important;
}
.red-color {
  color: red !important;
}
</style>
