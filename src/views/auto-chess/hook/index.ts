/* eslint-disable @typescript-eslint/no-var-requires */
import { computed, ref, onMounted, reactive, onUnmounted } from "vue";
import { getChessCards } from "@/api/autoChess";
import { storeToRefs } from "pinia";
import { userInfoStore } from "@/store/userInfo";
export function loadAllImage(proxy: any) {
  const { langConfig } = storeToRefs(userInfoStore());
  //获取所有卡牌图片
  function getChessCardsFun() {
    return new Promise((resolve) => {
      getChessCards()
        .then((res: { data: { status: any; data: unknown } }) => {
          if (+res.data.status) {
            // console.log(res.data.data);
            resolve(res.data.data);
          } else {
            resolve([]);
          }
        })
        .catch(() => {
          resolve([]);
        });
    });
  }
  const isZhCN = computed(() => {
    return +langConfig.value.id === 1;
  });

  const audioTypes: any = reactive({
    audioCoin: new Audio(
      new URL("@/assets/autoChess/audio/cn/coin.mp3", import.meta.url).href
    ),
  });

  for (let i = 1; i < 73; i++) {
    if ([11, 14, 20, 21, 24, 25, 27, 28, 41, 42, 51, 52, 56, 61].includes(i)) {
      continue;
    }
    audioTypes["audio" + i] = new Audio(
      new URL(
        `@/assets/autoChess/audio/${isZhCN.value ? "cn" : "en"}/${i}.mp3`,
        import.meta.url
      ).href
    );
  }

  const zhImgs = ref([
    new URL("@/assets//autoChess/btn-buy-disabled.png", import.meta.url).href,
    new URL(
      "@/assets/autoChess/btn-buy-mode-fast-selected.png",
      import.meta.url
    ).href,
    new URL("@/assets/autoChess/btn-buy-mode-fast-default.png", import.meta.url)
      .href,
    new URL(
      "@/assets/autoChess/btn-buy-mode-normal-default.png",
      import.meta.url
    ).href,
    new URL(
      "@/assets/autoChess/btn-buy-mode-normal-selected.png",
      import.meta.url
    ).href,
    new URL("@/assets/autoChess/btn-buy-hover.png", import.meta.url).href,
    new URL("@/assets/autoChess/btn-buy-disabled.png", import.meta.url).href,
    new URL("@/assets/autoChess/btn-buy-normal.png", import.meta.url).href,
    new URL("@/assets/autoChess/btn-refresh-normal.png", import.meta.url).href,
    new URL("@/assets/autoChess/btn-refresh-hover.png", import.meta.url).href,
    new URL("@/assets/autoChess/btn-rule-normal.png", import.meta.url).href,
    new URL("@/assets/autoChess/btn-sold-disabled.png", import.meta.url).href,
    new URL("@/assets/autoChess/btn-sold-normal.png", import.meta.url).href,
    new URL("@/assets/autoChess/btn-sold-hover.png", import.meta.url).href,
    new URL("@/assets/autoChess/login_out_btn_normal.png", import.meta.url)
      .href,
    new URL("@/assets/autoChess/login_out_btn_hover.png", import.meta.url).href,
    new URL("@/assets/autoChess/lv1-normal.png", import.meta.url).href,
    new URL("@/assets/autoChess/lv2-normal.png", import.meta.url).href,
    new URL("@/assets/autoChess/lv3-normal.png", import.meta.url).href,
    new URL("@/assets/autoChess/lv1-selected.png", import.meta.url).href,
    new URL("@/assets/autoChess/lv2-selected.png", import.meta.url).href,
    new URL("@/assets/autoChess/lv3-selected.png", import.meta.url).href,
    new URL("@/assets/autoChess/market_title.png", import.meta.url).href,
    new URL("@/assets/autoChess/package_7_title.png", import.meta.url).href,
    new URL("@/assets/autoChess/package_8_title.png", import.meta.url).href,
    new URL("@/assets/autoChess/package_title.png", import.meta.url).href,
    new URL("@/assets/autoChess/top_title.png", import.meta.url).href,
  ]);

  const enImgs = ref([
    new URL("@/assets//autoChess/en/btn-buy-disabled.png", import.meta.url)
      .href,
    new URL(
      "@/assets/autoChess/en/btn-buy-mode-fast-selected.png",
      import.meta.url
    ).href,
    new URL(
      "@/assets/autoChess/en/btn-buy-mode-fast-default.png",
      import.meta.url
    ).href,
    new URL(
      "@/assets/autoChess/en/btn-buy-mode-normal-default.png",
      import.meta.url
    ).href,
    new URL(
      "@/assets/autoChess/en/btn-buy-mode-normal-selected.png",
      import.meta.url
    ).href,
    new URL("@/assets/autoChess/en/btn-buy-hover.png", import.meta.url).href,
    new URL("@/assets/autoChess/en/btn-buy-disabled.png", import.meta.url).href,
    new URL("@/assets/autoChess/en/btn-buy-normal.png", import.meta.url).href,
    new URL("@/assets/autoChess/en/btn-refresh-normal.png", import.meta.url)
      .href,
    new URL("@/assets/autoChess/en/btn-refresh-hover.png", import.meta.url)
      .href,
    new URL("@/assets/autoChess/en/btn-rule-normal.png", import.meta.url).href,
    new URL("@/assets/autoChess/en/btn-sold-disabled.png", import.meta.url)
      .href,
    new URL("@/assets/autoChess/en/btn-sold-normal.png", import.meta.url).href,
    new URL("@/assets/autoChess/en/btn-sold-hover.png", import.meta.url).href,
    new URL("@/assets/autoChess/en/login_out_btn_normal.png", import.meta.url)
      .href,
    new URL("@/assets/autoChess/en/login_out_btn_hover.png", import.meta.url)
      .href,
    new URL("@/assets/autoChess/en/lv1-normal.png", import.meta.url).href,
    new URL("@/assets/autoChess/en/lv2-normal.png", import.meta.url).href,
    new URL("@/assets/autoChess/en/lv3-normal.png", import.meta.url).href,
    new URL("@/assets/autoChess/en/lv1-selected.png", import.meta.url).href,
    new URL("@/assets/autoChess/en/lv2-selected.png", import.meta.url).href,
    new URL("@/assets/autoChess/en/lv3-selected.png", import.meta.url).href,
    new URL("@/assets/autoChess/en/market_title.png", import.meta.url).href,
    new URL("@/assets/autoChess/en/package_7_title.png", import.meta.url).href,
    new URL("@/assets/autoChess/en/package_8_title.png", import.meta.url).href,
    new URL("@/assets/autoChess/en/package_title.png", import.meta.url).href,
    new URL("@/assets/autoChess/en/top_title.png", import.meta.url).href,
  ]);

  const imgs: any = ref([
    new URL("@/assets/autoChess/bg.png", import.meta.url).href,
    new URL("@/assets/autoChess/btn-x-normal.png", import.meta.url).href,
    new URL("@/assets/autoChess/btn-x-hover.png", import.meta.url).href,
    new URL("@/assets/autoChess/count_down_bg.png", import.meta.url).href,
    new URL("@/assets/autoChess/game_rule_dialog_bg.png", import.meta.url).href,
    new URL("@/assets/autoChess/hero_level_1.png", import.meta.url).href,
    new URL("@/assets/autoChess/hero_level_2.png", import.meta.url).href,
    new URL("@/assets/autoChess/hero_level_3.png", import.meta.url).href,
    new URL("@/assets/autoChess/hero_level_4.png", import.meta.url).href,
    new URL("@/assets/autoChess/hero_level_5.png", import.meta.url).href,
    new URL("@/assets/autoChess/icon-down.png", import.meta.url).href,
    new URL("@/assets/autoChess/icon-money.png", import.meta.url).href,
    new URL("@/assets/autoChess/level_list_bg.png", import.meta.url).href,
    new URL("@/assets/autoChess/level_select_bg.png", import.meta.url).href,
    new URL("@/assets/autoChess/level_selected_bg.png", import.meta.url).href,
    new URL("@/assets/autoChess/logo.png", import.meta.url).href,
    new URL("@/assets/autoChess/package_dialog_bg.png", import.meta.url).href,
    new URL("@/assets/autoChess/refresh_arrow.png", import.meta.url).href,
    new URL("@/assets/autoChess/section_bg.png", import.meta.url).href,
    new URL("@/assets/autoChess/spark-1.png", import.meta.url).href,
    new URL("@/assets/autoChess/spark-2.png", import.meta.url).href,
    new URL("@/assets/autoChess/star.png", import.meta.url).href,
    new URL("@/assets/autoChess/top_mask.png", import.meta.url).href,
    new URL("@/assets/autoChess/top-bg.png", import.meta.url).href,
    new URL("@/assets/autoChess/user_money_bg.png", import.meta.url).href,
  ]);

  function loadAllImagePromise(imgArr: any[]) {
    return new Promise((resolve) => {
      if (isZhCN.value) {
        imgs.value = [...zhImgs.value, ...imgs.value];
      } else {
        imgs.value = [...enImgs.value, imgs.value];
      }
      if (imgArr && imgArr.length > 0) {
        imgs.value = [...imgs.value, ...imgArr];
      }
      let count = 0;
      const imgLength = imgs.value.length;
      for (const img of imgs.value) {
        const image = new Image();
        image.onload = () => {
          count++;
          if (count == imgLength) {
            // proxy.$refs["globalLoading"].done();
            resolve(true);
          }
        };
        image.onerror = () => {
          count++;
          if (count == imgLength) {
            // proxy.$refs["globalLoading"].done();
            resolve(true);
          }
        };
        image.src = img;
      }
    });
  }
  onMounted(async () => {
    proxy.mittBus.on("autoChessAudio", (value: string) => {
      if (audioTypes[value]) {
        audioTypes[value].load();
        audioTypes[value].play();
      }
    });
    const cards: any = await getChessCardsFun();
    await loadAllImagePromise(cards);
  });

  onUnmounted(() => {
    proxy.mittBus.off("autoChessAudio");
  });

  return { loadAllImagePromise };
}
