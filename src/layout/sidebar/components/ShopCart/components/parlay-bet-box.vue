<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import CountTo from '@/components/VueCountTo/index.vue'

export default defineComponent({
  name: 'ParlayBetBox',
  components: { CountTo },
  props: {
    totalBet: {
      type: Number,
      default: 0,
    },
    totalBonus: {
      type: Number,
      default: 0,
    },
    disabled: {
      type: Boolean,
      default: true,
    },
    warnMessage: {
      type: String,
      default: '',
    },
  },
  emits: ['toBet', 'acceptChange'],
  setup(props: any, { emit }: any) {
    const betStartVal = ref(0)

    const bonusStartVal = ref(0)

    const hasChange = computed(() => {
      return props.warnMessage
    })

    function toBet() {
      if (hasChange.value) {
        emit('acceptChange')
        return
      }
      if (props.disabled) {
        return
      }
      emit('toBet')
    }

    return { betStartVal, bonusStartVal, toBet, hasChange }
  },
})
</script>

<template>
  <div class="parlay-bet-box">
    <div v-show="hasChange" class="warn-box">
      {{ warnMessage }}
    </div>
    <div class="total-bet">
      <div>{{ $t("tot_bet") }}</div>
      <div>
        <CountTo
          :start-val="Number(betStartVal)"
          :end-val="Number(totalBet)"
          :duration="1000"
        />
      </div>
    </div>
    <div class="total-bonus">
      <div>{{ $t("tot_bonus") }}</div>
      <div>
        <CountTo
          :start-val="Number(bonusStartVal)"
          :end-val="Number(totalBonus)"
          :duration="1000"
        />
      </div>
    </div>
    <div
      class="bet-btn" :class="{ 'disabled': disabled, 'has-change': hasChange }"
      @click.stop="toBet"
    >
      {{ hasChange ? $t("accept_odds") : $t("bet_now") }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.parlay-bet-box {
  width: 100%;
  padding: 14px 28px;
  //box-shadow: 0 -5px 5px rgba(255, 255, 255, 0.1);
  z-index: 50;
  .total-bonus,
  .total-bet {
    padding: 0 5px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 14px;
    div:nth-child(1) {
      font-family: PingFangSC-Regular, PingFangSC-Medium, monospace;
      font-size: 14px;
      color: #ffffff;
      font-weight: 400;
    }
    div:nth-child(2) {
      font-family: Gotham-Medium, PingFangSC-Medium, monospace;
      font-size: 14px;
      color: #ffffff;
      font-weight: 500;
    }
  }
  .total-bonus {
    div:nth-child(2) {
      color: #fecb00;
    }
  }
  .bet-btn {
    height: 40px;
    line-height: 40px;
    background-image: linear-gradient(90deg, #f98442 0%, #fd8908 94%);
    border-radius: 8px;
    font-size: 16px;
    color: #ffffff;
    font-weight: 500;
    text-align: center;
    cursor: url("@/assets/icons/home_mouse.png"), auto;
  }
  .disabled {
    background-image: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0) 0%,
      rgba(146, 149, 147, 0.31) 99%
    );
    border: 1px solid rgba(104, 104, 104, 1);
    cursor: not-allowed;
  }
  .has-change {
    background-image: linear-gradient(90deg, #d53720 0%, #f2691e 98%);
    color: #ffffff;
    cursor: url("@/assets/icons/home_mouse.png"), auto;
  }
  .warn-box {
    background-image: linear-gradient(
      90deg,
      rgba(254, 94, 0, 0.2) 0%,
      rgba(0, 0, 0, 0) 100%
    );
    min-height: 52px;
    display: flex;
    align-items: center;
    padding: 10px 0 10px 20px;
    margin-bottom: 14px;
    font-family: PingFangSC-Regular, PingFangSC-Medium, monospace;
    font-size: 14px;
    color: #f36c1d;
    font-weight: 400;
    position: relative;
    &:before {
      content: "";
      position: absolute;
      height: 100%;
      width: 4px;
      top: 0;
      left: -4px;
      background: #f36c1d;
      border-radius: 8px 0 0 8px;
    }
  }
}
</style>
