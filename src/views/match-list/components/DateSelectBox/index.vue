<script lang="ts">
import { defineComponent } from 'vue'
import { parseTime } from '@/utils'

export default defineComponent({
  name: 'DateSelectBox',
  components: {},
  props: {
    weekDateOptions: {
      type: Object,
      default: () => {
        return {}
      },
    },
    currentDate: {
      type: String,
      default: '',
    },
  },
  emits: ['change'],
  setup(props, { emit }) {
    function changeCurrentDate(item: any) {
      emit('change', item)
    }

    return { changeCurrentDate, parseTime }
  },
})
</script>

<template>
  <div class="DateSelectBox">
    <div class="current-data">
      {{ parseTime(new Date(), "{y}-{m}") }}
    </div>
    <div class="time-list">
      <div
        v-for="item in weekDateOptions"
        :key="item.label"
        class="time-item"
        :class="{ active: currentDate === item.dataValue }"
        @click="changeCurrentDate(item)"
      >
        <div class="label">
          {{ item.label }}
        </div>
        <div class="value">
          {{ item.data }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.DateSelectBox {
  width: 100%;
  display: flex;
  height: 64px;
  flex-shrink: 0;
  justify-content: space-between;
  align-items: center;
  background-color: #23272d;
  box-shadow: 2px 2px 3px 0 #00000015;
  border-radius: 8px;
  margin-bottom: 8px;
  padding: 0 24px;
  .current-data {
    font-family: Gotham-Medium, PingFangSC-Medium, monospace;
    font-size: 22px;
    color: #ffffff;
    font-weight: 500;
    width: 20%;
    letter-spacing: 2px;
  }
  .time-list {
    display: flex;
    width: 80%;
    justify-content: flex-end;
    .time-item {
      text-align: center;
      cursor: url("~@/assets/icons/home_mouse.png"), auto;
      transition: all 0.2s ease-in-out;
      &:hover {
        .value {
          transform: scale(1.1);
          color: #ffffff;
        }
      }
      & + .time-item {
        margin-left: 6%;
      }
      .label {
        font-family: PingFangSC-Regular, PingFangSC-Medium, monospace;
        font-size: 16px;
        color: rgba(255, 255, 255, 0.4);
        font-weight: 400;
      }
      .value {
        position: relative;
        font-family: Gotham-Medium, PingFangSC-Medium, monospace;
        font-size: 18px;
        margin-top: 6px;
        color: rgba(255, 255, 255, 0.6);
        font-weight: 500;
        height: 22.5px;
        transition: all 0.2s ease-in-out;
      }
    }
    .active {
      .label,
      .value {
        color: #ffffff;
        font-weight: 500;
      }
      .value {
        color: var(--color-theme-primary) !important;
      }
    }
  }
}
</style>
