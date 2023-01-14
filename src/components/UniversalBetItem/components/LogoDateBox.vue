<template>
  <div class="LogoDateBox">
    <LazyImage :img-url="dataInfo.logo" />
    <div class="main-live">
      <div class="live-tag" v-if="dataInfo.isLive || handicap === 'live'">
        <template v-if="dataInfo.isLive">
          <LiveIcon style="margin-right: 12px" />
        </template>
        <template v-if="!dataInfo.isLive && handicap === 'live'">
          <HasLiveIcon style="margin-right: 12px" />
        </template>
      </div>
      <div class="start-time">
        <template v-if="!countdown[0]">
          {{
            parseTime(
              Number(String(dataInfo.startTime).padEnd(13, "0")),
              "{h}:{i}"
            )
          }}
        </template>
        <template v-else>
          {{ countdown[1] }}
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent, inject } from "vue";
import { parseTime } from "@/utils";
import { countdownHook } from "@/hooks/countdownHook";
const LiveIcon = defineAsyncComponent(
  () => import("@/components/LiveIcon/index.vue")
);
const HasLiveIcon = defineAsyncComponent(
  () => import("@/components/HasLiveIcon/index.vue")
);
export default defineComponent({
  name: "LogoDateBox",
  components: { LiveIcon, HasLiveIcon },
  props: {
    dataInfo: {
      type: Object,
      default: () => {
        return {
          logo: "",
          startTime: 0,
        };
      },
    },
  },
  setup(props) {
    const { countdown } = countdownHook(props.dataInfo.startTime, 3);

    const handicap = inject("handicap");

    return { parseTime, countdown, handicap };
  },
});
</script>

<style lang="scss" scoped>
@mixin text-overflow-ellipsis {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.LogoDateBox {
  display: flex;
  flex-shrink: 0;
  width: 16.5%;
  padding: 0 2.8%;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;

  .lazy-image {
    width: 32px;
    height: 32px;
    flex-shrink: 0;
  }
  .main-live {
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  .live-tag {
    display: flex;
    margin-bottom: 8px;
    overflow: hidden;
    .live-bet {
      font-family: PingFangSC-Medium, monospace;
      font-size: 16px;
      color: #ff4e00;
      font-weight: 500;
      flex-shrink: 0;
      @include text-overflow-ellipsis;
    }
    .live-has-1,
    .live-has-2 {
      font-family: PingFangSC-Medium, monospace;
      font-size: 16px;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.6);
      flex-shrink: 0;
      @include text-overflow-ellipsis;
    }
    .live-has-2 {
      color: #ffcd00;
    }
  }
  .start-time {
    //font-family: PingFangSC-Medium, monospace;
    font-size: 18px;
    color: #ffffff;
    font-weight: 500;
    @include text-overflow-ellipsis;
  }
}
</style>
