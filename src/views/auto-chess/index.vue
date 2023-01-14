// 自走棋
<template>
  <div class="auto-chess-container">
    <!--    <GlobalLoading ref="globalLoading" />-->
    <Header
      :symbol="chessMoney.symbol"
      :refreshPrices="refreshPrices"
      :cardPrices="cardPrices"
      :free_limited_deadline="free_limited_deadline"
    />
    <div class="auto-chess-market" ref="market-ref">
      <div class="auto-chess-market-box">
        <div class="auto-chess-market-model">
          <div
            v-for="mode in modeList"
            :key="mode.id"
            @click.stop="changeMode(mode.id)"
            @mouseenter="mode.isHover = true"
            @mouseleave="mode.isHover = false"
          >
            <el-image
              v-show="!mode.isHover && +mode.id !== +model"
              :src="mode.normalImg"
              fit="contain"
            >
              <template #error>
                <img :src="mode.normalImg" alt="" />
              </template>
              <template #placeholder>
                <img :src="mode.normalImg" alt="" />
              </template>
            </el-image>
            <el-image
              v-show="mode.isHover || +mode.id === +model"
              :src="mode.selectedImg"
              fit="contain"
            >
              <template #error>
                <img :src="mode.selectedImg" alt="" />
              </template>
              <template #placeholder>
                <img :src="mode.selectedImg" alt="" />
              </template>
            </el-image>
          </div>
        </div>
        <el-image
          class="market-title"
          :src="getImage('market_title')"
          fit="contain"
        >
          <template #error>
            <div></div>
          </template>
          <template #placeholder>
            <div></div>
          </template>
        </el-image>
        <div v-show="cards['duration']" class="countdown">
          {{ countdown }}
        </div>
        <RefreshPriceBox
          :refreshPrice="refreshPrice"
          :refreshPrices="refreshPrices"
          @changePrice="changePrice"
        />
        <HeroModel
          v-for="info in Object.keys(cards.cards)"
          :key="info"
          :ref="'market' + info"
          :cardInfo="cards.cards[info]"
          :idx="info"
          :selected="isMarket"
          type="isMarket"
          :backpack="backpack"
          @changeHeroSelected="changeHeroSelected"
        />
        <div class="refresh-btn">
          <div
            class="refresh-btn-click"
            @mouseenter="refreshHover = true"
            @mouseleave="refreshHover = false"
            @click.stop="refreshCardsFun"
          >
            <el-image
              v-show="!refreshHover"
              class="refresh-btn-bg"
              :src="refreshNormalBg"
              fit="contain"
            >
              <template #error>
                <img :src="refreshNormalBg" alt="" />
              </template>
              <template #placeholder>
                <img :src="refreshNormalBg" alt="" />
              </template>
            </el-image>
            <el-image
              v-show="refreshHover"
              class="refresh-btn-bg"
              :src="refreshHoverBg"
              fit="contain"
            >
              <template #error>
                <img :src="refreshHoverBg" alt="" />
              </template>
              <template #placeholder>
                <img :src="refreshHoverBg" alt="" />
              </template>
            </el-image>
            <div
              class="refresh-btn-load"
              :class="{ 'refresh-load': refreshLoading }"
            >
              <el-image
                v-show="!refreshHover"
                :src="refreshArrowNormal"
                fit="contain"
              >
                <template #error>
                  <img :src="refreshArrowNormal" alt="" />
                </template>
                <template #placeholder>
                  <img :src="refreshArrowNormal" alt="" />
                </template>
              </el-image>
              <el-image
                v-show="refreshHover"
                :src="refreshArrowHover"
                fit="contain"
              >
                <template #error>
                  <img :src="refreshArrowHover" alt="" />
                </template>
                <template #placeholder>
                  <img :src="refreshArrowHover" alt="" />
                </template>
              </el-image>
            </div>
          </div>
          <div class="refresh-btn-text">
            {{ refreshPrice.symbol }}{{ refreshPrice.price }} /
            {{ $t("autoChessRule.times") }}
          </div>
        </div>
        <div
          class="active-wallet-chesMoney"
          v-if="chessMoney.chesMoney"
          @click.stop="changeIsActiveWallet"
        >
          <el-image style="height: 20px" :src="activeWalletImg" fit="contain">
            <template #error>
              <img :src="activeWalletImg" alt="" />
            </template>
            <template #placeholder>
              <img :src="activeWalletImg" alt="" />
            </template>
          </el-image>
          <el-image
            class="is-active-wallet"
            style="height: 15px"
            v-show="isActiveWallet"
            :src="isActiveWalletImg"
            fit="contain"
          >
            <template #error>
              <img :src="isActiveWalletImg" alt="" />
            </template>
            <template #placeholder>
              <img :src="isActiveWalletImg" alt="" />
            </template>
          </el-image>
          <span>{{ $t("autoChessRule.active_wallet") }}</span
          ><span>{{ chessMoney.symbol }}</span
          ><span>{{ chessMoney.chesMoney }}</span>
        </div>
        <div
          v-show="+model === 1"
          class="buy-card"
          :class="{ 'buy-card-hover': isMarket.length > 0 }"
          @click.stop="buyCard"
          @mouseenter="buyBackground.isHover = true"
          @mouseleave="buyBackground.isHover = false"
        >
          <el-image
            v-show="isMarket.length > 0 && !buyBackground.isHover"
            :src="buyBackground.able"
            fit="contain"
          >
            <template #error>
              <img :src="buyBackground.able" alt="" />
            </template>
          </el-image>
          <el-image
            v-show="isMarket.length > 0 && buyBackground.isHover"
            :src="buyBackground.hover"
            fit="contain"
          >
            <template #error>
              <img :src="buyBackground.hover" alt="" />
            </template>
          </el-image>
          <el-image
            v-show="isMarket.length < 1"
            :src="buyBackground.disabled"
            fit="contain"
          >
            <template #error>
              <img :src="buyBackground.disabled" alt="" />
            </template>
          </el-image>
        </div>
      </div>
    </div>
    <div class="auto-chess-pack" ref="backpack-ref">
      <div class="auto-chess-pack-box">
        <el-image
          class="backpack-title"
          :src="getImage('package_title')"
          fit="contain"
        >
          <template #error>
            <div class="image-slot">
              <div></div>
            </div>
          </template>
          <template #placeholder>
            <div></div>
          </template>
        </el-image>
        <HeroModel
          v-for="info in Object.keys(backpack)"
          :key="info"
          :idx="info"
          :ref="'backpack' + info"
          :cardInfo="backpack[info]"
          :selected="isBackpack"
          type="isBackpack"
          @changeHeroSelected="changeHeroSelected"
        />
        <div
          class="buy-card buy-card-hover"
          @click.stop="shellCard"
          @mouseenter="shellBackground.isHover = true"
          @mouseleave="shellBackground.isHover = false"
        >
          <el-image
            v-show="isBackpack.length > 0 && !shellBackground.isHover"
            :src="shellBackground.able"
            fit="contain"
          >
            <template #error>
              <img :src="shellBackground.able" alt="" />
            </template>
          </el-image>
          <el-image
            v-show="isBackpack.length > 0 && shellBackground.isHover"
            :src="shellBackground.hover"
            fit="contain"
          >
            <template #error>
              <img :src="shellBackground.hover" alt="" />
            </template>
          </el-image>
          <el-image
            v-show="isBackpack.length < 1"
            :src="shellBackground.disabled"
            fit="contain"
          >
            <template #error>
              <img :src="shellBackground.disabled" alt="" />
            </template>
          </el-image>
        </div>
      </div>
    </div>
  </div>
</template>
<!--suppress JSMismatchedCollectionQueryUpdate -->
<script lang="ts">
/* eslint-disable @typescript-eslint/no-var-requires */
import {
  computed,
  defineComponent,
  getCurrentInstance,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  toRefs,
  watch,
} from "vue";
import {
  buyCards,
  finishUserGuide,
  getChessInitInfo,
  refreshCards,
  sellCards,
} from "@/api/autoChess";
// import GlobalLoading from "@/components/GlobalLoading/index.vue";
import HeroModel from "./components/HeroModel.vue";
import Header from "./components/header/index.vue";
import RefreshPriceBox from "./components/RefreshPriceBox.vue";
import { ElMessage } from "element-plus";
import { loadAllImage } from "./hook";
import { parseTime } from "@/utils";
import { storeToRefs } from "pinia";
import { userInfoStore } from "@/store/userInfo";

const defaultCard = {
  card_id: 0,
  color: "#000000",
  level: 0,
  name: "",
  picture: "",
  star: 0,
  symbol: "￥",
};
export default defineComponent({
  name: "autoChess",
  components: { HeroModel, Header, RefreshPriceBox },
  setup() {
    const { proxy }: any = getCurrentInstance();
    loadAllImage(proxy);

    const { langConfig } = storeToRefs(userInfoStore());

    const { doGetUserInfo } = userInfoStore();

    //当前语言
    const lang = computed(() => {
      if (langConfig.value.id == 1) {
        return "";
      } else {
        return "en/";
      }
    });

    //买卡按钮背景图片
    const buyBackground = reactive({
      disabled: new URL(
        `@/assets/autoChess/${lang.value}btn-buy-disabled.png`,
        import.meta.url
      ).href,
      able: new URL(
        `@/assets/autoChess/${lang.value}btn-buy-normal.png`,
        import.meta.url
      ).href,
      hover: new URL(
        `@/assets/autoChess/${lang.value}btn-buy-hover.png`,
        import.meta.url
      ).href,
      isHover: false,
    });

    //买卡按钮背景图片
    const shellBackground = reactive({
      disabled: new URL(
        `@/assets/autoChess/${lang.value}btn-sold-disabled.png`,
        import.meta.url
      ).href,
      able: new URL(
        `@/assets/autoChess/${lang.value}btn-sold-normal.png`,
        import.meta.url
      ).href,
      hover: new URL(
        `@/assets/autoChess/${lang.value}btn-sold-hover.png`,
        import.meta.url
      ).href,
      isHover: false,
    });

    //获取图片的方法
    function getPicture(name: string, selected = "") {
      const bg = new URL(
        `@/assets/autoChess/${lang.value}${name}${selected}.png`,
        import.meta.url
      ).href;
      return `url(${bg})`;
    }

    //获取图片的方法
    function getImage(name: string, selected = "") {
      return new URL(
        `@/assets/autoChess/${lang.value}${name}${selected}.png`,
        import.meta.url
      ).href;
    }

    const activeWalletImg = new URL(
      "@/assets/autoChess/check_box_bg.png",
      import.meta.url
    ).href;
    const isActiveWalletImg = new URL(
      "@/assets/autoChess/checked_box_bg.png",
      import.meta.url
    ).href;
    const isActiveWallet = ref(false);
    function changeIsActiveWallet() {
      isActiveWallet.value = !isActiveWallet.value;
    }

    const modeList = ref([
      {
        id: 1,
        name: "normal",
        isHover: false,
        normalImg: new URL(
          `@/assets/autoChess/${lang.value}btn-buy-mode-normal-default.png`,
          import.meta.url
        ).href,
        selectedImg: new URL(
          `@/assets/autoChess/${lang.value}btn-buy-mode-normal-selected.png`,
          import.meta.url
        ).href,
      },
      {
        id: 2,
        name: "fast",
        isHover: false,
        normalImg: new URL(
          `@/assets/autoChess/${lang.value}btn-buy-mode-fast-default.png`,
          import.meta.url
        ).href,
        selectedImg: new URL(
          `@/assets/autoChess/${lang.value}btn-buy-mode-fast-selected.png`,
          import.meta.url
        ).href,
      },
    ]);
    //改变买卡模式
    function changeMode(id: number) {
      statusState.model = id;
      if (statusState.model == 2) {
        selectedHero.isMarket = [];
      }
    }

    //改变刷新钱
    function changePrice({
      priceObj,
      room_id,
    }: {
      priceObj: any;
      room_id: string;
    }) {
      statusState.refreshPrice = priceObj;
      statusState.room_id = room_id;
    }

    let statusState = reactive({
      //刷新等级
      room_id: "1",
      //购买模式
      model: 1,
      refreshPrice: {
        price: 0,
        symbol: "¥",
      },
    });

    //初始化卡牌
    function getChessInitInfoFun() {
      return new Promise((resolve) => {
        getChessInitInfo().then(
          (res: { data: { status: number; data: unknown } }) => {
            if (+res.data.status === 1) {
              Object.assign(cardInfoState, res.data.data);
              resolve(res.data.data);
            }
          }
        );
      });
    }

    //刷新的loading
    const refreshLoading = ref(false);
    //刷新按鈕hover
    const refreshHover = ref(false);

    const refreshImg = reactive({
      refreshNormalBg: new URL(
        `@/assets/autoChess/${lang.value}btn-refresh-normal.png`,
        import.meta.url
      ).href,
      refreshHoverBg: new URL(
        `@/assets/autoChess/${lang.value}btn-refresh-hover.png`,
        import.meta.url
      ).href,
      refreshArrowNormal: new URL(
        `@/assets/autoChess/refresh_arrow.png`,
        import.meta.url
      ).href,
      refreshArrowHover: new URL(
        `@/assets/autoChess/refresh_arrow_hover.png`,
        import.meta.url
      ).href,
    });
    //刷新市场卡牌
    function refreshCardsFun() {
      if (refreshLoading.value || shopStatus.buying || shopStatus.shelling)
        return;
      return new Promise((resolve) => {
        refreshLoading.value = true;
        selectedHero.isMarket = [];
        let params: any = {};
        if (isActiveWallet.value) {
          params = { room_id: statusState.room_id, is_free: true };
        } else {
          params = { room_id: statusState.room_id };
        }

        refreshCards(params)
          .then((res: { data: { status: number; data: unknown } }) => {
            if (+res.data.status === 1) {
              selectedHero.isMarket = [];
              Object.assign(cardInfoState, res.data.data);
              doGetUserInfo();
              resolve(res.data.data);
            }
          })
          .finally(() => {
            setTimeout(() => {
              refreshLoading.value = false;
            }, 800);
          });
      });
    }

    //初始化的数据
    let cardInfoState: any = reactive({
      backpack: {
        "1": defaultCard,
        "2": defaultCard,
        "3": defaultCard,
        "4": defaultCard,
        "5": defaultCard,
        "6": defaultCard,
        "7": defaultCard,
        "8": defaultCard,
      },
      cardPrices: [],
      cards: {
        cards: {
          "1": defaultCard,
          "2": defaultCard,
          "3": defaultCard,
          "4": defaultCard,
          "5": defaultCard,
        },
        duration: 0,
      },
      chessMoney: {
        chesMoney: 0,
        symbol: "¥",
      },
      free_limited_deadline: 0,
      isNew: false,
      refreshPrices: {},
      tags: [],
    });

    const parseTimeFun = parseTime;

    //倒计时
    const countdown = computed(() => {
      if (cardInfoState.cards.duration) {
        return parseTimeFun(cardInfoState.cards.duration * 1000, "{i}:{s}");
      } else {
        return "00:00";
      }
    });

    //选中的英雄
    let selectedHero: { isMarket: any[]; isBackpack: any[] } = reactive({
      isMarket: [],
      isBackpack: [],
    });

    let shopStatus = reactive({
      buying: false,
      shelling: false,
    });
    //更改英雄状态是否选中
    async function changeHeroSelected({
      type,
      idx,
    }: {
      type: "isMarket" | "isBackpack";
      idx: string;
    }) {
      if (shopStatus.buying || shopStatus.shelling) return;
      const cIdx = selectedHero[type].indexOf(idx);
      if (cIdx == -1) {
        selectedHero[type].push(idx);
        if (statusState.model == 2 && type == "isMarket") {
          await buyCard();
          // selectedHero.isMarket = [];
        }
      } else {
        selectedHero[type].splice(cIdx, 1);
      }
    }

    //购买卡牌
    function buyCard() {
      new Promise((resolve) => {
        if (shopStatus.buying || shopStatus.shelling) return;
        if (selectedHero.isMarket.length > 0) {
          shopStatus.buying = true;
          const card_num_str = selectedHero.isMarket.join(",");
          buyCards({ card_num_str })
            .then(
              async (res: {
                data: { status: number; data: any; message: any };
              }) => {
                if (+res.data.status === 1) {
                  //动画时长 ms
                  let time = 0;
                  proxy.mittBus.emit(
                    "autoChessAudio",
                    `audio${
                      (cardInfoState.cards.cards as any)[
                        selectedHero.isMarket[0]
                      ].card_id
                    }`
                  );

                  let buyTime: any = await toStartBuyAnimate();
                  let mergeTime: any = await toMergeHeroAnimate();
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  time = buyTime + mergeTime;
                  selectedHero.isMarket = [];
                  selectedHero.isBackpack = [];
                  Object.assign(cardInfoState, res.data.data);
                  doGetUserInfo();
                  shopStatus.buying = false;
                  resolve(true);
                } else {
                  shopStatus.buying = false;
                  if (statusState.model == 2) {
                    selectedHero.isMarket = [];
                  }
                  ElMessage({
                    type: "error",
                    message: res.data.message,
                    customClass: "virtual-fail-bet",
                  });
                  resolve(false);
                }
              }
            )
            .catch(() => {
              shopStatus.buying = false;
              if (statusState.model == 2) {
                selectedHero.isMarket = [];
              }
              resolve(false);
            });
        } else {
          shopStatus.buying = false;
          resolve(false);
        }
      });
    }

    //进行开启合并卡牌动画
    function toMergeHeroAnimate() {
      return new Promise((resolve) => {
        let tempBackpack: any[] = [];
        //找到当前背包的空位
        let idx = 0;
        for (const key of Object.keys(cardInfoState.backpack)) {
          if (!(cardInfoState.backpack as any)[key as any].card_id) {
            if (selectedHero.isMarket[idx]) {
              tempBackpack.push(
                Object.assign(
                  (cardInfoState.cards.cards as any)[
                    selectedHero.isMarket[idx]
                  ],
                  {
                    idx: key,
                    beforeIdx: selectedHero.isMarket[idx],
                  }
                )
              );
              idx++;
            } else {
              tempBackpack.push((cardInfoState.backpack as any)[key as any]);
            }
          } else {
            tempBackpack.push(
              Object.assign((cardInfoState.backpack as any)[key as any], {
                idx: key,
              })
            );
          }
        }

        let time = 0;

        for (const key of selectedHero.isMarket) {
          //一星英雄的数量
          const sameHeroOne = tempBackpack.filter((hero) => {
            return (
              hero.card_id == (cardInfoState.cards.cards as any)[key].card_id &&
              hero.star == 1
            );
          });
          //二星英雄的数量
          const sameHeroTwo = tempBackpack.filter((hero) => {
            return (
              hero.card_id == (cardInfoState.cards.cards as any)[key].card_id &&
              hero.star == 2
            );
          });

          //第一个英雄的位置
          const heroIndex = tempBackpack.findIndex((hero) => {
            return (
              hero.card_id == (cardInfoState.cards.cards as any)[key].card_id
            );
          });

          const firstHero = tempBackpack[heroIndex];

          if (sameHeroOne.length < 3) {
            // 什么也不做
          } else if (sameHeroOne.length == 3 && sameHeroTwo.length == 2) {
            sameHeroOne.forEach((hero) => {
              if (hero.idx != firstHero.idx) {
                startMergeAnimate(firstHero.idx, hero.idx);
              }
            });
            sameHeroTwo.forEach((hero) => {
              if (hero.idx != firstHero.idx) {
                startMergeAnimate(firstHero.idx, hero.idx);
              }
            });
            time = 300;
          } else if (sameHeroOne.length == 3 && sameHeroTwo.length < 2) {
            sameHeroOne.forEach((hero) => {
              if (hero.idx != firstHero.idx) {
                startMergeAnimate(firstHero.idx, hero.idx);
              }
            });
            time = 300;
          }
        }
        setTimeout(() => {
          resolve(time);
        }, time);
      });
    }

    //购买卡牌后的动画
    function startMergeAnimate(targetRef: string, animateRef: string) {
      return new Promise((resolve) => {
        const targetRefBox = proxy.$refs["backpack" + targetRef];
        const animateRefBox = proxy.$refs["backpack" + animateRef];
        let bottom = 0;
        let left =
          targetRefBox.$el.offsetLeft - animateRefBox.$el.offsetLeft + "px";

        proxy.$refs["backpack" + animateRef].setHeroMergeAnimate({
          bottom,
          left,
        });

        resolve(true);
      });
    }

    //进行开启购买卡牌动画
    function toStartBuyAnimate() {
      return new Promise((resolve) => {
        let emptyPack: string[] = [];
        //找到当前背包的空位
        for (const key of Object.keys(cardInfoState.backpack)) {
          if (!(cardInfoState.backpack as any)[key as any].card_id) {
            emptyPack.push(key);
          }
        }
        //购买的卡片开始动画
        selectedHero.isMarket.forEach(async (ref, index) => {
          startBuyAnimate(ref, (emptyPack as any)[index]).then(() => true);
        });

        setTimeout(() => {
          resolve(1000);
        }, 990);
      });
    }

    //购买卡牌后的动画
    function startBuyAnimate(marketRef: string, emptyPackRef: string) {
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve) => {
        const marketRefBox = proxy.$refs["market" + marketRef];
        const emptyPackBox = proxy.$refs["backpack" + emptyPackRef];
        let bottom =
          proxy.$refs["market-ref"].offsetTop -
          proxy.$refs["backpack-ref"].offsetTop +
          "px";
        let left =
          (emptyPackBox instanceof Array ? emptyPackBox[0] : emptyPackBox).$el
            .offsetLeft -
          (marketRefBox instanceof Array ? marketRefBox[0] : marketRefBox).$el
            .offsetLeft +
          "px";
        await (marketRefBox instanceof Array
          ? marketRefBox[0]
          : marketRefBox
        ).setHeroAnimate({
          bottom,
          left,
        });
        resolve(true);
      });
    }

    //出售卡牌
    function shellCard() {
      new Promise((resolve) => {
        if (shopStatus.buying || shopStatus.shelling) return;
        if (selectedHero.isBackpack.length > 0) {
          shopStatus.shelling = true;
          const pack_num_str = selectedHero.isBackpack.join(",");
          sellCards({ pack_num_str })
            .then((res: { data: { status: number; data: any } }) => {
              if (+res.data.status === 1) {
                selectedHero.isBackpack.forEach((key) => {
                  toStartShellAnimate(key);
                });

                proxy.mittBus.emit("autoChessAudio", "audioCoin");

                setTimeout(() => {
                  Object.assign(cardInfoState, res.data.data);
                  selectedHero.isBackpack = [];
                  shopStatus.shelling = false;
                  doGetUserInfo();
                  resolve(true);
                }, 3200);
              } else {
                shopStatus.shelling = false;
                resolve(false);
              }
            })
            .catch(() => {
              shopStatus.buying = false;
              resolve(false);
            });
        } else {
          shopStatus.buying = false;
          resolve(false);
        }
      });
    }
    //开启出售动画
    function toStartShellAnimate(shellRef: string) {
      const height =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight;
      const shellRefEle =
        proxy.$refs["backpack" + shellRef] instanceof Array
          ? proxy.$refs["backpack" + shellRef][0]
          : proxy.$refs["backpack" + shellRef];
      let bottom = 36 + (height - 72) / 2 + (height - 72) / 6 + "px";
      let left = 260 - shellRefEle.$el.offsetLeft + "px";
      shellRefEle.setShellAnimate({ bottom, left });
    }

    let timer: any = null;

    watch(
      () => cardInfoState.cards.duration,
      (newVal, oldVal) => {
        if (oldVal > 0 && !newVal) {
          getChessInitInfoFun();
        }
      }
    );

    onMounted(async () => {
      // proxy.$refs["globalLoading"].loading();
      doGetUserInfo();
      await finishUserGuide();
      await getChessInitInfoFun();
      statusState.refreshPrice = (cardInfoState.refreshPrices as any)["1"];
      timer = setInterval(() => {
        if (cardInfoState.cards.duration && cardInfoState.cards.duration > 0) {
          cardInfoState.cards.duration--;
        }
      }, 1000);
    });

    onUnmounted(() => {
      clearInterval(timer);
      timer = null;
    });

    return {
      modeList,
      ...toRefs(cardInfoState),
      ...toRefs(statusState),
      ...toRefs(selectedHero),
      selectedHero,
      refreshLoading,
      refreshCardsFun,
      getPicture,
      changeMode,
      changePrice,
      changeHeroSelected,
      buyBackground,
      buyCard,
      shellBackground,
      shellCard,
      getImage,
      refreshHover,
      ...toRefs(refreshImg),
      countdown,
      activeWalletImg,
      isActiveWallet,
      changeIsActiveWallet,
      isActiveWalletImg,
    };
  },
});
</script>
<style lang="scss">
.auto-chess-container {
  cursor: url("../../assets/autoChess/sz.png"), default !important;
}
</style>
<!--suppress CssInvalidPseudoSelector -->
<style lang="scss" scoped>
@media screen and (max-width: 1200px) {
  .auto-chess-container {
    --px_100: 1200px/19;
  }
}
@media screen and (min-width: 1201px) {
  .auto-chess-container {
    --px_100: 100vw/19;
  }
}
@media screen and (min-width: 1600px) {
  .auto-chess-container {
    --px_100: 1600px/19;
  }
}
@mixin autoChess {
  width: 100%;
  flex-grow: 1;
  display: flex;
  position: relative;
  .active-wallet-chesMoney {
    position: absolute;
    right: calc(1.4 * var(--px_100));
    bottom: calc(0.5 * var(--px_100));
    display: flex;
    align-items: center;
    color: #ffe2ce;
    font-size: calc(0.24 * var(--px_100));
    .is-active-wallet {
      position: absolute;
      left: 2.5px;
      top: 5px;
    }
    span {
      display: inline-block;
      margin: 0 calc(0.05 * var(--px_100));
    }
  }
  .buy-card {
    position: absolute;
    bottom: calc(-0.28 * var(--px_100));
    height: calc(0.62 * var(--px_100));
    width: calc(2.08 * var(--px_100));
    background-image: var(--buy-bg);
    background-size: 100% 100%;
  }
  .buy-card-hover {
    &:hover {
      box-shadow: 0 -20px 20px 0 #fee08b30 inset;
    }
  }

  &-box {
    width: 100%;
    display: flex;
    height: 80%;
    min-height: calc(4 * var(--px_100));
    flex-shrink: 0;
    align-items: center;
    justify-content: space-evenly;
    background-image: url("../../assets/autoChess/section_bg.png");
    background-size: 100% 100%;
    padding: calc(1 * var(--px_100)) 0;
    position: relative;
    &::before {
      content: "";
      position: absolute;
      height: 0;
      width: 0;
      background-color: #151f2800;
      z-index: 1;
      top: 0;
    }
    .market-title {
      position: absolute;
      z-index: 100;
      height: calc(0.31 * var(--px_100));
      width: calc(0.6 * var(--px_100));
      top: calc(0.3 * var(--px_100));
    }
    .countdown {
      position: absolute;
      z-index: 200;
      height: calc(0.32 * var(--px_100));
      width: calc(1.93 * var(--px_100));
      top: calc(0.3 * var(--px_100));
      background-image: url("../../assets/autoChess/count_down_bg.png");
      background-size: 100% 100%;
      left: 60%;
      line-height: calc(0.32 * var(--px_100));
      text-align: center;
      color: #ffe2ce;
      font-size: calc(0.28 * var(--px_100));
    }

    .backpack-title {
      position: absolute;
      z-index: 100;
      height: calc(0.31 * var(--px_100));
      width: calc(1.21 * var(--px_100));
      top: calc(0.3 * var(--px_100));
    }
  }
}
.auto-chess-container {
  height: 100vh;
  width: 100%;
  min-width: 1200px;
  // max-width: 1920px;
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background-image: url("../../assets/autoChess/bg.png");
  background-size: 100% 100%;
  position: relative;
  .auto-chess-market {
    @include autoChess;

    .auto-chess-market-model {
      position: absolute;
      left: calc(0.6 * var(--px_100));
      top: calc(0.3 * var(--px_100));
      z-index: 2001;
      display: flex;
      & > div {
        height: 32px;
        width: 120px;
        &:deep(.el-image) {
          height: 32px;
          img {
            height: 100%;
          }
        }
        & + div {
          margin-left: calc(0.2 * var(--px_100));
        }
      }
    }
    .refresh-btn {
      position: relative;

      .refresh-btn-click {
        height: calc(1.6 * var(--px_100));
        width: calc(1.6 * var(--px_100));
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        .refresh-btn-bg {
          position: absolute;
        }
        .refresh-btn-load {
          height: calc(1.2 * var(--px_100));
          width: calc(1.2 * var(--px_100));
        }
      }
      .refresh-load {
        animation: refreshLoad 1s infinite;
      }
      .refresh-btn-text {
        width: calc(1.6 * var(--px_100));
        text-align: center;
        margin-top: calc(0.2 * var(--px_100));
        font-size: calc(0.24 * var(--px_100));
        font-weight: 400;
        color: #ff5837;
      }
    }
  }
  .auto-chess-pack {
    @include autoChess;
  }

  @keyframes refreshLoad {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}
</style>
<style lang="scss">
.virtual-success-bet {
  border-radius: 4px;
  background: rgba(67, 85, 103, 0.8);
  border: 2px solid #2eb14d;
  box-sizing: border-box;
  backdrop-filter: blur(20px);
  padding: 20px 200px;
  color: #f5faff !important;
  .el-message__content {
    color: #f5faff !important;
  }
}

.virtual-fail-bet {
  border-radius: 4px;
  background: rgba(67, 85, 103, 0.8);
  border: 2px solid #f31f1f;
  box-sizing: border-box;
  backdrop-filter: blur(20px);
  padding: 20px 200px;
  color: #f5faff !important;
  .el-message__content {
    color: #f5faff !important;
  }
}
</style>
