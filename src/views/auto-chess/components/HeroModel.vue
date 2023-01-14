<template>
  <div class="hero-model" @click.stop="changeHeroSelected">
    <div class="hero-base-block">
      <el-image v-show="!cardInfo.level" :src="heroBase.levelBBg" fit="contain">
        <template #error>
          <img :src="heroBase.levelBBg" />
        </template>
      </el-image>
      <el-image
        v-for="i in 5"
        :key="'BBg' + i"
        v-show="cardInfo.level == i"
        :src="heroBase['level' + i + 'BBg']"
        fit="contain"
      >
        <template #error>
          <img :src="heroBase.levelBBg" />
        </template>
      </el-image>
    </div>
    <div class="hero-name" v-show="hasHero">
      <div :style="{ color: cardInfo.color }">{{ cardInfo.name }}</div>
      <div>{{ cardInfo.symbol }}{{ cardInfo.price }}</div>
    </div>
    <div class="hero-card" v-if="cardInfo.picture">
      <transition
        name="custom-classes-transition"
        enter-active-class="animate__animated animate__fadeInUp"
        leave-active-class="animate__animated animate__bounceOut"
        mode="out-in"
      >
        <el-image
          v-show="!shellAnimate"
          :src="cardInfo.picture"
          fit="contain"
          :class="{
            'hero-card-animate': buyAnimate,
            'hero-card-merge-animate': mergeAnimate,
          }"
          :style="heroAnimate"
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
      </transition>
      <el-image
        v-show="moneyIconShow"
        :src="moneyIcon"
        class="money-icon"
        fit="contain"
        :class="{
          'animate__animated animate__bounce': iconBounce,
          'hero-card-shell-animate': !iconBounce,
        }"
        :style="shellAnimateOption"
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
    </div>
    <div class="hero-halo" v-show="isSelected">
      <div
        id="demoSvag"
        class="demoSvag"
        ref="demoSvag"
        v-show="isSelected"
      ></div>
      <div class="spark_fly_ani">
        <div
          class="spark_box"
          v-for="(spark, i) in lightSparksList"
          :style="{ left: spark.left, animationDelay: spark.delay }"
          :class="spark.className + spark.imgurl"
          :key="i"
        ></div>
      </div>
    </div>
    <div class="hero-same" v-show="sameHro" @click.stop>
      <div id="sameSvag" class="sameSvag" ref="sameSvag" v-show="sameHro"></div>
      <div class="spark_fly_ani up-down">
        <div
          class="spark_box"
          v-for="(spark, i) in lightSparksList"
          :style="{ left: spark.left, animationDelay: spark.delay }"
          :class="spark.className + spark.imgurl"
          :key="i"
        ></div>
      </div>
    </div>
    <div class="hero-star">
      <el-image
        v-for="i in cardInfo.star"
        :key="i"
        :src="starIcon"
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
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-var-requires */
import {
  computed,
  defineComponent,
  getCurrentInstance,
  onMounted,
  reactive,
  ref,
  toRefs,
} from "vue";
import SVGA from "svgaplayerweb";

export default defineComponent({
  name: "heroModel",
  props: {
    cardInfo: {
      type: Object,
      default: () => {
        return {
          card_id: 0,
          color: "#000000",
          level: 0,
          name: "",
          picture: "",
          star: 0,
          symbol: "￥",
        };
      },
    },
    idx: {
      type: String,
      default: "0",
    },
    selected: {
      type: Array,
      default: () => {
        return [];
      },
    },
    type: {
      type: String,
      default: "",
    },
    backpack: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  emits: ["changeHeroSelected"],
  setup(props, { emit }) {
    const moneyIcon = new URL("@/assets/autoChess/icon-money.png" ,import.meta.url).href;
    const starIcon = new URL("@/assets/autoChess/star.png" ,import.meta.url).href;
    const { proxy } = getCurrentInstance() as any;
    const selectSvg = new URL("@/assets/autoChess/hero_selected.svga" ,import.meta.url).href;
    function initSvga() {
      let player = new SVGA.Player(proxy.$refs["demoSvag"]);

      let parser = new SVGA.Parser();
      parser.load(selectSvg.default, function (videoItem) {
        player.setVideoItem(videoItem);
        player.startAnimation();
      });
    }

    const heroBase = reactive({
      levelBBg: new URL("@/assets/autoChess/hero_level.png" ,import.meta.url).href,
      level1BBg: new URL("@/assets/autoChess/hero_level_1.png" ,import.meta.url).href,
      level2BBg: new URL("@/assets/autoChess/hero_level_2.png" ,import.meta.url).href,
      level3BBg: new URL("@/assets/autoChess/hero_level_3.png" ,import.meta.url).href,
      level4BBg: new URL("@/assets/autoChess/hero_level_4.png" ,import.meta.url).href,
      level5BBg: new URL("@/assets/autoChess/hero_level_5.png" ,import.meta.url).href,
    });

    let animateList: { sparksList: any[]; lightSparksList: any[] } = reactive({
      sparksList: [],
      lightSparksList: [],
    });

    // 动画
    function getAbsoluteRandom(cache: any, base: number): any {
      var random = Number.parseInt(String(Math.random() * base));
      if (cache[random]) {
        return getAbsoluteRandom(cache, base);
      } else {
        cache[random] = 1;
        return random;
      }
    }
    function generateSnowflakes() {
      animateList.sparksList = [];
      animateList.lightSparksList = [];
      for (let i = 0; i < 10; i++) {
        let random = Math.random();
        animateList.sparksList.push({
          className: "snowflake" + i,
          left: getAbsoluteRandom({}, 100) + "%",
          delay:
            Number.parseInt(String(Math.random() * 3000)) +
            "ms," +
            Number.parseInt(String(random * 3)) +
            "s",
          imgurl: " spark" + (Math.floor(Math.random() * 2) + 1),
        });
        animateList.lightSparksList.push({
          className: "snowflake" + i,
          left: getAbsoluteRandom({}, 36) + 26 + "%",
          delay:
            Number.parseInt(String(Math.random() * 5000)) +
            "ms," +
            Number.parseInt(String(random * 5)) +
            "s",
          imgurl: " spark" + (Math.floor(Math.random() * 2) + 1),
        });
      }
    }

    //背包中是否有相同的英雄、
    const sameHro = computed(() => {
      let result = false;
      if (
        Object.keys(props.backpack).length > 0 &&
        props.type == "isMarket" &&
        hasHero.value
      ) {
        for (const key of Object.keys(props.backpack)) {
          if (
            (props.backpack[key as any] as any).card_id ==
            props.cardInfo.card_id
          ) {
            result = true;
          }
        }
      }
      return result;
    });

    //是否有英雄
    const hasHero = computed(() => {
      return props.cardInfo.card_id && props.cardInfo.level;
    });

    //是否被选中
    const isSelected = computed(() => {
      return (
        props.selected.includes(props.idx) && hasHero.value && !buyAnimate.value
      );
    });

    function changeHeroSelected() {
      if (!hasHero.value || buyAnimate.value || mergeAnimate.value) return;
      emit("changeHeroSelected", { type: props.type, idx: props.idx });
    }

    //开启购买后的动画
    const buyAnimate = ref(false);

    //合并动画
    const mergeAnimate = ref(false);

    // 通过设置图片的left,bottom实现图片移动
    let heroAnimate = reactive({});
    // 购买后的动画
    function setHeroAnimate({
      bottom,
      left,
    }: {
      bottom: string;
      left: string;
    }) {
      return new Promise((resolve) => {
        buyAnimate.value = true;
        Object.assign(heroAnimate, {
          bottom,
          left,
          "--bottom": bottom,
          "--left": left,
        });
        setTimeout(() => {
          Object.assign(heroAnimate, {
            bottom: 0,
            left: 0,
            "--bottom": 0,
            "--left": 0,
          });
          buyAnimate.value = false;
          resolve(true);
        }, 1500);
      });
    }

    // 购买后的动画
    function setHeroMergeAnimate({
      bottom,
      left,
      bottomBefore = "0",
      leftBefore = "0",
    }: {
      bottom: string;
      left: string;
      bottomBefore: string;
      leftBefore: string;
    }) {
      return new Promise((resolve) => {
        mergeAnimate.value = true;
        Object.assign(heroAnimate, {
          bottom,
          left,
          "--bottom-merge-before": bottomBefore,
          "--left-merge-before": leftBefore,
          "--bottom-merge": bottom,
          "--left-merge": left,
        });
        setTimeout(() => {
          Object.assign(heroAnimate, {
            bottom: 0,
            left: 0,
            "--bottom-merge-before": 0,
            "--left-merge-before": 0,
            "--bottom-merge": 0,
            "--left-merge": 0,
          });
          mergeAnimate.value = false;
          resolve(true);
        }, 300);
      });
    }

    //出售动画
    const shellAnimate = ref(false);
    const moneyIconShow = ref(false);
    const iconBounce = ref(true);

    let shellAnimateOption = reactive({
      bottom: 0,
      left: 0,
      "--bottom-move": 0,
      "--left-move": 0,
    });

    function setShellAnimate({
      bottom,
      left,
    }: {
      bottom: string;
      left: string;
    }) {
      shellAnimate.value = true;
      setTimeout(() => {
        moneyIconShow.value = true;
      }, 800);
      setTimeout(() => {
        iconBounce.value = false;
        Object.assign(shellAnimateOption, {
          // position: 'absolute',
          bottom,
          left,
          "--bottom-move": bottom,
          "--left-move": left,
        });
      }, 2100);
      setTimeout(() => {
        shellAnimate.value = false;
        moneyIconShow.value = false;
        iconBounce.value = true;
        Object.assign(shellAnimateOption, {
          // position: 'absolute',
          bottom: 0,
          left: 0,
          "--bottom-move": bottom,
          "--left-move": left,
        });
      }, 3200);
    }

    onMounted(() => {
      generateSnowflakes();
      initSvga();
    });

    return {
      starIcon,
      ...toRefs(animateList),
      isSelected,
      changeHeroSelected,
      hasHero,
      sameHro,
      heroAnimate,
      setHeroAnimate,
      buyAnimate,
      mergeAnimate,
      setHeroMergeAnimate,
      shellAnimate,
      moneyIcon,
      setShellAnimate,
      moneyIconShow,
      shellAnimateOption,
      iconBounce,
      heroBase,
    };
  },
});
</script>

<style lang="scss" scoped>
.ss {
  position: absolute;
}
@media screen and (max-width: 1200px) {
  .hero-model {
    --px_100: 1200px/19;
  }
}
@media screen and (min-width: 1201px) {
  .hero-model {
    --px_100: 100vw/19;
  }
}
@media screen and (min-width: 1600px) {
  .hero-model {
    --px_100: 1600px/19;
  }
}
.hero-model {
  height: calc(2.6 * var(--px_100));
  width: calc(1.8 * var(--px_100));
  //   background-color: bisque;
  flex-shrink: 0;
  position: relative;
  .hero-card {
    position: absolute;
    bottom: calc(0.46 * var(--px_100));
    height: calc(1.6 * var(--px_100));
    width: calc(1.6 * var(--px_100));
    left: calc(0.1 * var(--px_100));
    // display: flex;
    // align-items: center;
    // justify-content: center;
    z-index: 20;
    &:deep(.el-image) {
      flex-shrink: 0;
      height: calc(1.6 * var(--px_100));
      width: calc(1.6 * var(--px_100));
    }
    .money-icon {
      display: flex;
      justify-content: center;
      align-items: center;
      :deep(.el-image__inner) {
        height: calc(0.5 * var(--px_100)) !important;
        width: calc(0.5 * var(--px_100)) !important;
      }
    }
    .hero-card-shell-animate {
      position: absolute;
      animation: moneyIconMove 1.2s;
      // transition: left 1s, bottom 1s linear;
    }
    .hero-card-animate {
      position: absolute;
      animation: transitionHero 1s linear;
    }
    .hero-card-merge-animate {
      position: absolute;
      animation: heroMerge 0.3s linear;
    }

    @keyframes heroMerge {
      0% {
        left: var(--left-merge-before);
        bottom: var(--bottom-merge-before);
      }
      100% {
        left: var(--left-merge);
        bottom: var(--bottom-merge);
      }
    }

    @keyframes moneyIconMove {
      0% {
        left: 0;
        bottom: 0;
        opacity: 1;
        transform: rotateY(0deg);
      }
      100% {
        left: var(--left-move);
        bottom: var(--bottom-move);
        opacity: 0;
        transform: rotateY(360deg);
        // left: -200px;
        // bottom: -200px;
      }
    }
    @keyframes transitionHero {
      0% {
        left: 0;
        bottom: 0;
      }
      100% {
        left: var(--left);
        bottom: var(--bottom);
        // left: -200px;
        // bottom: -200px;
      }
    }
  }
  .hero-name {
    position: absolute;
    color: #ff5837;
    font-weight: 400;
    display: flex;
    align-items: center;
    justify-content: center;
    width: calc(1.8 * var(--px_100));
    bottom: calc(-0.3 * var(--px_100));
    font-size: calc(0.24 * var(--px_100));
    div + div {
      margin-left: calc(0.1 * var(--px_100));
      text-align: center;
    }
    div {
      height: calc(0.5 * var(--px_100));
      line-height: calc(0.5 * var(--px_100));
    }
  }
  .hero-base-block {
    position: absolute;
    bottom: calc(0.2 * var(--px_100));
    height: calc(0.72 * var(--px_100));
    width: calc(1.8 * var(--px_100));
    background-size: 100% 100%;
    z-index: 10;
  }

  .hero-halo {
    position: absolute;
    bottom: calc(0.46 * var(--px_100));
    height: calc(1.31 * var(--px_100));
    width: calc(1.82 * var(--px_100));
    background-image: url("../../../assets/autoChess/top_mask.png");
    background-size: 100% 100%;
    z-index: 100;
    .demoSvag {
      position: absolute;
      bottom: calc(-0.4 * var(--px_100));
      height: calc(2.2 * var(--px_100));
      width: calc(2.4 * var(--px_100));
      left: calc(-0.3 * var(--px_100));
      animation: fateShow 0.5s;
    }
  }
  .hero-star {
    position: absolute;
    bottom: calc(0.15 * var(--px_100));
    height: calc(0.3 * var(--px_100));
    width: calc(1.8 * var(--px_100));
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 15;
    &:deep(.el-image) {
      flex-shrink: 0;
      height: calc(0.25 * var(--px_100));
      width: calc(0.25 * var(--px_100));
      margin: 0 calc(0.03 * var(--px_100));
    }
  }
  .hero-same {
    position: absolute;
    bottom: calc(1 * var(--px_100));
    height: calc(4.6 * var(--px_100));
    width: calc(1.8 * var(--px_100));
    left: calc(0.2 * var(--px_100));
    background-image: url("../../../assets/autoChess/light.png");
    background-size: 100% 100%;
    .sameSvag {
      position: absolute;
      bottom: calc(-0.4 * var(--px_100));
      height: calc(4.6 * var(--px_100));
      width: calc(1.8 * var(--px_100));
      animation: fateShow 0.5s;
    }
    .up-down {
      transform: translateX(-50%) rotateZ(0deg);
    }
  }
}
@keyframes transformRotate {
  0% {
    transform: rotateZ(0deg);
  }
  100% {
    transform: rotateZ(360deg);
  }
}
.spark_fly_ani {
  position: absolute;
  width: 200%;
  height: 120%;
  left: 40%;
  transform: translateX(-50%) rotateZ(180deg);
  bottom: calc(0.05 * var(--px_100));
}
.spark_box {
  position: absolute;
  left: 0;
  user-select: none;
  animation-duration: 3s, 3s;
  animation-timing-function: linear;
  animation-iteration-count: infinite, infinite;
  animation-play-state: running, running;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center center;
}
.spark_fly_ani .spark_box {
  bottom: 0;
}
.spark_box {
  top: 0;
  animation-duration: 5s, 5s;
}
.spark_box.spark2 {
  width: calc(0.1 * var(--px_100));
  height: calc(0.1 * var(--px_100));
  background-image: url("../../../assets/autoChess/spark-2.png");
  background-size: 100% 100%;
  z-index: 1000;
}
.spark_box.spark1 {
  width: calc(0.08 * var(--px_100));
  height: calc(0.08 * var(--px_100));
  background-image: url("../../../assets/autoChess/spark-1.png");
  background-size: 100% 100%;
  z-index: 1000;
}
.snowflake0 {
  animation-name: snowflakes-fall, snowflakes-shake0;
}
.snowflake1 {
  animation-name: snowflakes-fall, snowflakes-shake1;
}
.snowflake2 {
  animation-name: snowflakes-fall, snowflakes-shake2;
}
.snowflake3 {
  animation-name: snowflakes-fall, snowflakes-shake3;
}
.snowflake4 {
  animation-name: snowflakes-fall, snowflakes-shake4;
}
.snowflake5 {
  animation-name: snowflakes-fall, snowflakes-shake5;
}
.snowflake6 {
  animation-name: snowflakes-fall, snowflakes-shake6;
}
.snowflake7 {
  animation-name: snowflakes-fall, snowflakes-shake7;
}
.snowflake8 {
  animation-name: snowflakes-fall, snowflakes-shake8;
}
.snowflake9 {
  animation-name: snowflakes-fall, snowflakes-shake9;
}
.snowflake10 {
  animation-name: snowflakes-fall, snowflakes-shake10;
}
.snowflake11 {
  animation-name: snowflakes-fall, snowflakes-shake11;
}
.snowflake12 {
  animation-name: snowflakes-fall, snowflakes-shake12;
}

.snowflake0 {
  animation-name: snowflakes-falldown, snowflakes-shake0;
}
.snowflake1 {
  animation-name: snowflakes-falldown, snowflakes-shake1;
}
.snowflake2 {
  animation-name: snowflakes-falldown, snowflakes-shake2;
}
.snowflake3 {
  animation-name: snowflakes-falldown, snowflakes-shake3;
}
.snowflake4 {
  animation-name: snowflakes-falldown, snowflakes-shake4;
}
.snowflake5 {
  animation-name: snowflakes-falldown, snowflakes-shake5;
}
.snowflake6 {
  animation-name: snowflakes-falldown, snowflakes-shake6;
}
.snowflake7 {
  animation-name: snowflakes-falldown, snowflakes-shake7;
}
.snowflake8 {
  animation-name: snowflakes-falldown, snowflakes-shake8;
}
.snowflake9 {
  animation-name: snowflakes-falldown, snowflakes-shake9;
}
.snowflake10 {
  animation-name: snowflakes-falldown, snowflakes-shake10;
}
.snowflake11 {
  animation-name: snowflakes-falldown, snowflakes-shake11;
}
.snowflake12 {
  animation-name: snowflakes-falldown, snowflakes-shake12;
}
@keyframes snowflakes-fall {
  0% {
    bottom: 0%;
  }
  100% {
    bottom: 100%;
  }
}
@keyframes snowflakes-falldown {
  0% {
    top: 0;
  }
  100% {
    top: 80%;
  }
}
@keyframes snowflakes-shake0 {
  0%,
  100% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(100%, 0, 0);
  }
}
@keyframes snowflakes-shake1 {
  0%,
  100% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(80%, 0, 0);
  }
}
@keyframes snowflakes-shake2 {
  0%,
  100% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(160%, 0, 0);
  }
}
@keyframes snowflakes-shake3 {
  0%,
  100% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(150%, 0, 0);
  }
}
@keyframes snowflakes-shake4 {
  0%,
  100% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(90%, 0, 0);
  }
}
@keyframes snowflakes-shake5 {
  0%,
  100% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(140%, 0, 0);
  }
}
@keyframes snowflakes-shake6 {
  0%,
  100% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(170%, 0, 0);
  }
}
@keyframes snowflakes-shake7 {
  0%,
  100% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(50%, 0, 0);
  }
}
@keyframes snowflakes-shake8 {
  0%,
  100% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(120%, 0, 0);
  }
}
@keyframes snowflakes-shake9 {
  0%,
  100% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(40%, 0, 0);
  }
}
@keyframes snowflakes-shake10 {
  0%,
  100% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(110%, 0, 0);
  }
}
@keyframes snowflakes-shake11 {
  0%,
  100% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(60%, 0, 0);
  }
}
@keyframes snowflakes-shake12 {
  0%,
  100% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(130%, 0, 0);
  }
}
@keyframes fateShow {
  0% {
    opacity: 0;
  }
  10% {
    opacity: 0;
  }
  40% {
    opacity: 0.5;
  }
  60% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
</style>
