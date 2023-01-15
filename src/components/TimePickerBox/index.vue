<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { parseTime } from '@/utils'

export default defineComponent({
  name: 'TimePickerBox',
  components: {},
  props: {
    startTime: {
      type: Number,
      default: null,
    },
    endTime: {
      type: Number,
      default: null,
    },
    partType: {
      type: String,
      default: '{y}/{m}/{d}',
    },
  },
  emits: ['change'],
  setup(props: any, { emit }: any) {
    const i18n = useI18n()

    const dateImage = new URL('@/assets/icons/clear.png', import.meta.url).href

    const state = ref<any>([props.startTime, props.endTime])

    const test = ref('')

    watch(
      () => [props.startTime, props.endTime],
      ([sNewVal, eNewVal]) => {
        state.value = [sNewVal, eNewVal]
      },
    )

    function getOffsetTime(offset: number) {
      return new Date(
        parseTime(
          new Date().getTime() - offset * 24 * 60 * 60 * 1000,
          '{y}-{m}-{d}',
        ) as any,
      ).getTime()
    }

    const shortTimeArr = [
      {
        label: i18n.t('today'),
        timeValue: {
          start_time: getOffsetTime(0),
          end_time: getOffsetTime(0),
        },
      },
      {
        label: '本周',
        timeValue: {
          start_time: getOffsetTime(6),
          end_time: getOffsetTime(0),
        },
      },
      {
        label: '本月',
        timeValue: {
          start_time: getOffsetTime(29),
          end_time: getOffsetTime(0),
        },
      },
    ]

    function pickerChange(val: any) {
      changeTime({ start_time: val[0], end_time: val[1] })
    }

    function changeTime(newTime: { start_time: number; end_time: number }) {
      if (
        props.startTime === newTime.start_time
        && props.endTime === newTime.end_time
      ) {
        return
      }
      emit('change', newTime)
    }

    return {
      test,
      parseTime,
      state,
      shortTimeArr,
      changeTime,
      dateImage,
      pickerChange,
    }
  },
})
</script>

<template>
  <div class="time-picker-box">
    <div class="picker-box">
      <el-date-picker
        v-model="state"
        type="daterange"
        range-separator="-"
        value-format="X"
        :start-placeholder="$t('start_time')"
        :end-placeholder="$t('end_time')"
        :clearable="false"
        :editable="false"
        format="YYYY/MM/DD"
        popper-class="picker-popper-box"
        @change="pickerChange"
      />
      <div class="delve" />
      <LazyImage
        :img-url="dateImage"
        @click.stop="pickerChange([null, null])"
      />
    </div>
    <div class="short-time">
      <div v-for="short in shortTimeArr" :key="short.label">
        <div
          :class="{
            active:
              short.timeValue.start_time === startTime
              && short.timeValue.end_time === endTime,
          }"
          @click.stop="changeTime(short.timeValue)"
        >
          {{ short.label }}
        </div>
      </div>
    </div>
  </div>
</template>

<!-- suppress CssInvalidPseudoSelector -->
<style lang="scss" scoped>
.time-picker-box {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  .picker-box {
    display: flex;
    align-items: center;
    padding: 0 12px;
    .delve {
      height: 18px;
      width: 1.5px;
      background-color: rgba(255, 255, 255, 0.2);
    }
    .lazy-image {
      height: 24px;
      width: 24px;
      margin-left: 8px;
      cursor: url("~@/assets/icons/home_mouse.png"), auto;
    }
    &:deep(.el-date-editor) {
      --el-input-border: none;
      --el-input-hover-border: none;
      --el-input-border-color: #0000000;
      --el-input-bg-color: #0000000;
      --el-input-focus-border: none;
      --el-input-focus-border-color: #0000000;
      --el-input-hover-border-color: #0000000;
      --el-input-text-color: #ffffff;
      --el-input-placeholder-color: rgba(255, 255, 255, 0.6);
      width: 220px !important;
      padding: 0;
      .el-range-input {
        color: #ffffff;
      }
      .el-range-separator {
        color: rgba(255, 255, 255, 0.6);
      }
      .el-range__icon {
        display: none;
      }
      .el-range-separator {
        padding: 0 5px;
        flex: 0;
      }
      .el-range__close-icon {
        display: none;
      }
    }
  }
  & > div {
    height: 38px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 25px;
  }
  .short-time {
    margin-left: 24px;
    display: flex;
    align-items: center;
    .active {
      background: rgba(255, 255, 255, 0.2);
      color: #ffffff !important;
      font-weight: 500;
    }
    & > div {
      padding: 0 8px;
      font-family: PingFangSC-Regular, PingFangSC-Medium, monospace;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.6);
      flex-shrink: 0;
      div {
        height: 24px;
        line-height: 24px;
        width: 46px;
        text-align: center;
        border-radius: 12px;
        cursor: url("~@/assets/icons/home_mouse.png"), auto;
      }
    }
    & > div + div {
      border-left: 2px solid rgba(255, 255, 255, 0.1);
    }
  }
}
</style>
