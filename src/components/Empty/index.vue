<template>
  <div :style="{ '--margin-top': dataObj.top }" class="ia-empty">
    <img :src="dataObj.image" :width="dataObj.width" alt="" />
    <div class="bottom">
      <div class="text">{{ dataObj.text }}</div>
      <slot name="top"></slot>
      <div class="url-text" v-show="type === 'live'">
        去<span class="jump" @click="dataObj.callback">滚球</span>看看吧~
      </div>
      <slot name="bottom"></slot>
    </div>
  </div>
</template>
<script lang="ts">
import { merge } from "lodash";
import useImageResource from "@/hooks/useImageResource";
import { gameInfoStore } from "@/store/gameInfo";
export default {
  name: "empty-data",
  props: {
    //使用场景
    type: {
      type: String,
      default: "default",
    },
    top: {
      type: Number,
      default: 160,
    },
    // option: {
    //   type: [Object, undefined, null],
    //   // eslint-disable-next-line @typescript-eslint/no-empty-function
    //   default: () => {},
    // },
  },
  setup(props: any) {
    const { setHandicapValue } = gameInfoStore();
    const { emptyImg, emptyLiveImg, notMatchImg } = useImageResource();

    const data: { [key: string]: any } = {
      default: {
        width: "100",
        top: 140,
        image: emptyImg,
        text: "暂无记录",
        urlText: "",
        callback: () => null,
      },
      //滚球
      live: {
        width: "140",
        top: 80,
        image: emptyLiveImg,
        text: "暂无更多赛事",
        urlText: "去滚球看看",
        callback: () => {
          setHandicapValue("live");
        },
      },
      event: {
        width: "120",
        top: 120,
        image: notMatchImg,
        text: "暂无更多赛事",
        urlText: "",
        callback: () => null,
      },
    };
    const dataObj:any = merge(data[props.type], props.option);
    return {
      dataObj,
    };
  },
};
</script>
<style lang="scss" scoped>
.ia-empty {
  text-align: center;
  font-family: PingFangSC-Regular, PingFangSC-Medium, monospace;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin-top: calc(var(--margin-top) * 1px);
  .bottom {
    margin-top: 12px;
    .url-text {
      margin-top: 12px;
      .jump {
        display: inline-block;
        width: 56px;
        margin: 0 5px;
        line-height: 24px;
        border-radius: 13px;
        color: var(--color-white) !important;
        background: var(--color-theme-primary);
        cursor: url("~@/assets/icons/home_mouse.png"), auto;
        opacity: 1;
      }
    }
  }
}
</style>
