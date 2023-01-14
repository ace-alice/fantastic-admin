// noinspection JSUnusedGlobalSymbols

import { defineStore } from "pinia";
import { getLocal, setLocal } from "@/utils/storage";
import {
  currencyInfoFn,
  getLangFn,
  getUserInfo,
  setLangFn,
} from "@/api/store-user-info";
import { LangCode } from "@/enum";
import { getLocale } from "@/locale";
import {
  BalanceInfosType,
  CurrencyInfoType,
  LangConfigType,
} from "@/interface/userInfo";
import { ref, reactive, Ref, computed } from "vue";

export const userInfoStore = defineStore("userInfo", () => {
  const balanceInfo: BalanceInfosType = reactive({
    amount: "",
    nickname: "",
    currency_id: "",
  });

  const currencyInfo: Ref<CurrencyInfoType[]> = ref([]);

  getLocal("avatarId") || setLocal("avatarId", 1);

  const avatarId = ref(getLocal("avatarId"));

  function changeAvatarId(id: number) {
    if (id > 0 && id < 16) {
      avatarId.value = id;
      setLocal("avatarId", id);
    }
  }

  const isLogin: Ref<boolean> = ref(false);

  const langConfig: LangConfigType = reactive(
    getLocal("langConfig") || {
      id: 1,
      lang: "zh-CN",
      change_lang: 1,
      theme: "b",
    }
  );

  function getCurrencyInfo() {
    currencyInfoFn().then((res: any) => {
      if (+res.data.code === 1) {
        currencyInfo.value = res.data.data;
      }
    });
  }

  const currentCurrencyInfo = computed(() => {
    return currencyInfo.value.find((currency) => {
      return String(currency.id) === String(balanceInfo.currency_id);
    });
  });

  // 获取会员信息
  function doGetUserInfo() {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      getUserInfo()
        .then(({ data }: any) => {
          if (data.code === 1) {
            Object.assign(balanceInfo, data.data);
            setLoginStatus(true);
            getCurrencyInfo();
          }
        })
        .finally(() => {
          resolve(true);
        });
    });
  }

  // 切换语言
  function changLangAction(data: { lang: number }) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      setLangFn(data)
        .then((res: any) => {
          if (+res.data.code === 1) {
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch(() => resolve(false));
    });
  }

  function updateLangConfig(data: { lang: any }) {
    Object.assign(langConfig, data, {
      id: data.lang,
      lang: LangCode[Number(data.lang)],
    });
    setLocal("langConfig", langConfig);
    document.title = String(langConfig.id) === "1" ? "小艾电竞" : "IA ESPORTS";
    // setLocale(LangCode[Number(res.data.data.lang)]);
    if (data.lang != Number(getLocale())) {
      window.location.reload();
    }
  }

  function initLangAction() {
    getLangFn()
      .then((res: any) => {
        if (res.data.code === 1) {
          updateLangConfig(res.data.data);
        } else {
          updateLangConfig({
            lang: getLocal("lang") || 1,
          });
        }
      })
      .catch(() => {
        updateLangConfig({
          lang: getLocal("lang") || 1,
        });
      });
  }

  function setLoginStatus(status: boolean) {
    isLogin.value = status;
  }

  return {
    balanceInfo,
    isLogin,
    langConfig,
    doGetUserInfo,
    updateLangConfig,
    changLangAction,
    initLangAction,
    avatarId,
    currencyInfo,
    changeAvatarId,
    currentCurrencyInfo,
    setLoginStatus,
  };
});
