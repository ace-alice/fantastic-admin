<template>
  <div :class="{ CenterCartBox: true, 'hidden-box': !show }">
    <div class="user-info">
      <LazyImage :img-url="avatarImg"></LazyImage>
      <div class="amount-name">
        <div>
          {{
            balanceInfo.nickname
              ? balanceInfo.nickname
              : $t("you_not_login_now")
          }}
        </div>
        <div v-if="balanceInfo.amount">
          <span>
            {{ currentCurrencyInfo?.symbol || "" }}
          </span>
          <CountTo
            :startVal="Number(startVal)"
            :endVal="Number(balanceInfo.amount)"
            :duration="1000"
          />
        </div>
      </div>
    </div>
    <div class="router-list">
      <div
        class="router-tab"
        v-for="tab in tabs"
        :key="tab.code"
        @click.stop="toOpenCenter(tab.code)"
      >
        {{ tab.label }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, getCurrentInstance, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import CountTo from "@/components/VueCountTo/index.vue";
import { storeToRefs } from "pinia";
import { userInfoStore } from "@/store/userInfo";

export default defineComponent({
  name: "CenterCartBox",
  components: { CountTo },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const i18n = useI18n();

    const { balanceInfo, currentCurrencyInfo, avatarId } = storeToRefs(
      userInfoStore()
    );

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const avatarImg = computed(() => {
      return new URL(`@/assets/avatar/image-${
        +avatarId.value > 0 && +avatarId.value < 16 ? avatarId.value : 1
      }.png`, import.meta.url).href;
    });

    const startVal = ref(0);

    watch(
      () => balanceInfo.value.amount,
      (newVal, oldVal) => {
        startVal.value = (oldVal as any) || 0;
      }
    );

    const tabs = [
      {
        label: "更换头像",
        code: "AccountChangeBox",
      },
      {
        label: i18n.t("bet_records"),
        code: "BetHistoryBox",
      },
      // {
      //   label: "账变记录",
      //   code: "AccountChangeBox",
      // },
      {
        label: i18n.t("the_announcement"),
        code: "BulletinListBox",
      },
    ];

    const { proxy }: any = getCurrentInstance();

    function toOpenCenter(code: string) {
      proxy.mittBus.emit("openUserCenterBus", code);
    }

    return {
      balanceInfo,
      avatarImg,
      tabs,
      toOpenCenter,
      startVal,
      currentCurrencyInfo,
    };
  },
});
</script>

<style lang="scss" scoped>
.CenterCartBox {
  .user-info {
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    margin-bottom: 12px;
    padding-bottom: 16px;
    display: flex;
    align-items: center;
    .lazy-image {
      height: 48px;
      width: 48px;
      flex-shrink: 0;
      border-radius: 50%;
      overflow: hidden;
    }
    .amount-name {
      flex-grow: 1;
      padding: 0 24px;
      color: rgba(255, 255, 255, 0.8);
      font-weight: 500;
      div:nth-child(1) {
        font-family: PingFangSC-Medium, monospace;
        font-size: 18px;
      }
      div:nth-child(2) {
        font-family: Gotham-Medium, PingFangSC-Medium, monospace;
        font-size: 16px;
      }
      div + div {
        margin-top: 12px;
      }
    }
  }
  position: absolute;
  cursor: default;
  overflow: hidden;
  top: 74px;
  right: 32px;
  height: 190px;
  width: 344px;
  background-color: #01fb66;
  z-index: 6666;
  transition: all 0.2s ease-in-out 0.1s;
  background-image: linear-gradient(
    180deg,
    rgba(239, 150, 112, 0.95) 0%,
    rgba(233, 87, 104, 0.95) 100%
  );
  border-radius: 8px;
  padding: 24px;
  &:before {
    height: 100%;
    width: 100%;
    position: absolute;
    content: "";
    top: 0;
    left: 0;
    background-image: url("../../../assets/banner/csgo_04.png");
    background-size: 100% auto;
    opacity: 0.1;
    z-index: -1;
  }
  .router-list {
    .router-tab {
      padding: 4px 8px;
      font-size: 14px;
      color: #ffffff;
      cursor: url("~@/assets/icons/home_mouse.png"), auto;
      &:hover {
        font-weight: 500;
        transform: scale(1.14) translateX(16px);
      }
    }
  }
}
.hidden-box {
  height: 0 !important;
  padding: 0 24px !important;
}
</style>
