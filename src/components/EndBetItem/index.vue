<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
export default defineComponent({
  name: 'EndBetItem',
  components: {},
  props: {
    matchInfo: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  setup(props: any) {
    const router = useRouter()

    function setWinLoseImage(tag: number) {
      return new URL(`@/assets/icons/status-${tag || 2}.png`, import.meta.url).href
    }

    function toMatchDetail() {
      const query: any = {
        game_id: props.matchInfo.id,
        category_id: props.matchInfo.category_id,
      }
      router.push({
        name: 'MatchDetail',
        query,
      })
    }

    return { setWinLoseImage, toMatchDetail }
  },
})
</script>

<template>
  <div class="end-bet-item" @click.stop="toMatchDetail">
    <div class="LogoDateBox">
      <LazyImage :img-url="matchInfo.game_logo" />
    </div>
    <div class="VideoAndAnimationBox">
      <div class="top">
        {{ matchInfo.event_name }}
      </div>
      <div class="bottom">
        <div>BO{{ matchInfo.bo || 0 }}</div>
      </div>
    </div>
    <div class="team-box">
      <div class="team-logo">
        <LazyImage :img-url="matchInfo.team_logo_1" />
      </div>
      <div class="desc">
        {{ matchInfo.team_name_1 }}
      </div>
      <LazyImage
        :img-url="
          +matchInfo.is_del === 1
            ? ''
            : !matchInfo.show_win_lose
              ? ''
              : setWinLoseImage(matchInfo.team_winloss_1)
        "
      />
    </div>
    <div class="PlayNameBox">
      <span v-if="+matchInfo.is_del === 1" class="score-info">{{
        $t("abolished")
      }}</span>
      <span v-else-if="!matchInfo.show_win_lose" class="score-info">{{
        $t("ended")
      }}</span>
      <LazyImage
        v-else-if="matchInfo.team_winloss_3 >= 0"
        :img-url="setWinLoseImage(matchInfo.team_winloss_3)"
      />
      <span v-else class="score-info">
        {{ matchInfo.score_1 }} - {{ matchInfo.score_2 }}
      </span>
    </div>
    <div class="team-box team-left">
      <div class="team-logo">
        <LazyImage :img-url="matchInfo.team_logo_2" />
      </div>
      <div class="desc">
        {{ matchInfo.team_name_1 || "IA ESPORT" }}
      </div>
      <LazyImage
        :img-url="
          +matchInfo.is_del === 1
            ? ''
            : !matchInfo.show_win_lose
              ? ''
              : setWinLoseImage(matchInfo.team_winloss_2)
        "
      />
    </div>
    <div class="points-count">
      +{{ matchInfo.points_count }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.end-bet-item {
  width: 100%;
  height: 88px;
  background: var(--color-bg-primary);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  cursor: url("../../assets/icons/home_mouse.png"), auto;
  flex-shrink: 0;
  & + .end-bet-item {
    margin-top: 4px;
  }
  .points-count {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 2.8% 0 4.6%;
    flex-shrink: 0;
    font-family: Gotham-Medium, PingFangSC-Medium, monospace;
    font-size: 16px;
    color: #ffffff;
    letter-spacing: 0;
    font-weight: 500;
  }
  .PlayNameBox {
    width: 10%;
    display: flex;
    flex-shrink: 0;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0 10px;
    .score-info {
      font-family: Gotham-Medium, PingFangSC-Medium, monospace;
      font-size: 16px;
      color: #ffffff;
      letter-spacing: 0;
      font-weight: 500;
    }
    .lazy-image {
      height: 32px;
      width: 32px;
    }
  }
  .team-left {
    flex-direction: row-reverse;
    .desc {
      text-align: right;
    }
  }
  .team-box {
    .lazy-image {
      height: 32px;
      width: 32px;
    }
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 26.4%;
    height: 58px;
    padding: 0 16px;
    color: rgba(255, 255, 255, 0.8);
    overflow-x: visible;
    background-image: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0) 0%,
      rgba(146, 149, 147, 0.31) 99%
    );
    border: 1px solid rgba(104, 104, 104, 1);
    border-radius: 6px;
    .team-logo {
      flex-shrink: 0;
    }
    .desc {
      flex-grow: 1;
      padding: 0 12px;
      white-space: pre-wrap;
      word-break: break-word;
      font-family: PingFangSC-Medium, monospace;
      font-size: 16px;
      font-weight: 500;
    }
  }
  .LogoDateBox {
    display: flex;
    flex-shrink: 0;
    width: 8%;
    padding: 0 2.8%;
    justify-content: space-between;
    align-items: center;
    overflow: hidden;

    .lazy-image {
      width: 32px;
      height: 32px;
      flex-shrink: 0;
    }
  }
  .VideoAndAnimationBox {
    width: 12.3%;
    padding-right: 2.8%;
    flex-shrink: 0;
    .top {
      font-family: PingFangSC-Regular, PingFangSC-Medium, monospace;
      font-size: 14px;
      color: #ffffff;
    }
    .bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: PingFangSC-Regular, PingFangSC-Medium, monospace;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.6);
      .video-animate {
        display: flex;
      }
      .lazy-image {
        height: 24px;
        & + .lazy-image {
          margin-left: 12px;
        }
      }
    }
  }
}
</style>
