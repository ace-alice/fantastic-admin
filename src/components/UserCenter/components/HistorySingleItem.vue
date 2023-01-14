<template>
  <div class="HistorySingleItem">
    <div class="single-body">
      <div class="body-logo">
        <LazyImage :img-url="info['game_type_logo']"></LazyImage>
        <div class="single-tag">{{ $t("single_bet") }}</div>
      </div>
      <div class="body-info">
        <div>{{ info["event_name"] }}</div>
        <div>{{ info["desc"] }}</div>
        <div v-if="!+info['is_champion']">
          {{ info["team_name_1"] }} - Vs - {{ info["team_name_2"] }}
        </div>
      </div>
      <div class="body-status">
        <div class="odds-status">
          <div>x{{ info["odds"] }}</div>
          <div
            :style="{
              color: getBetListStatus(info).color,
            }"
          >
            {{ getBetListStatus(info).name }}
          </div>
        </div>
        <div
          :class="{
            'win-lose': true,
            'win-bg': [5, '5'].includes(getBetListStatus(info).code),
            'lose-bg': [6, '6'].includes(getBetListStatus(info).code),
          }"
          v-if="[5, 6, '5', '6'].includes(getBetListStatus(info).code)"
        >
          {{ getBetListStatus(info).name }}
        </div>
      </div>
    </div>
    <div class="single-footer">
      <div>
        {{ $t("bet_amount") }}:{{
          info.amount ? toFixedNumber(info.amount) : "--"
        }}
      </div>
      <div>
        {{ $t("bet_clearing_amount") }}:
        <span
          :class="Number(info['win_lose']) < 0 ? 'red-color' : 'green-color'"
          >{{ info["win_lose"] > 0 ? "+" : ""
          }}{{ toFixedNumber(info["win_lose"]) }}</span
        >
      </div>
      <div>
        {{ $t("order_id") }}:
        <Clipboard :content="info['order_id']">
          <template #label>
            <span class="order-id">
              <span>{{ info["order_id"] }}</span>
              <LazyImage :img-url="copyImage" />
            </span>
          </template>
        </Clipboard>
      </div>
      <div>
        {{ info["create_time"] ? parseTime(info["create_time"]) : "--" }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { toFixedNumber, getBetListStatus, parseTime } from "@/utils";
import Clipboard from "@/components/Clipboard/index.vue";

export default defineComponent({
  name: "HistorySingleItem",
  components: { Clipboard },
  props: {
    info: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  setup() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const copyImage = new URL("@/assets/icons/time-Copy.png" ,import.meta.url).href;

    return { toFixedNumber, copyImage, getBetListStatus, parseTime };
  },
});
</script>

<style lang="scss" scoped>
.HistorySingleItem {
  background: #262d34;
  flex-shrink: 0;
  margin-bottom: 8px;
  .single-body {
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
  .single-footer {
    height: 32px;
    padding: 0 4%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #1c252e;
    font-family: PingFangSC-Regular, PingFangSC-Medium, monospace;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.6);
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
.green-color {
  color: green !important;
}
.red-color {
  color: red !important;
}
</style>
