import { computed } from "vue";
import { userInfoStore } from "@/store/userInfo";
import { storeToRefs } from "pinia";

export function getImgOfLang() {
  const { langConfig } = storeToRefs(userInfoStore());

  //是不是中文
  const isZh = computed(() => {
    if (+langConfig.value === 1) {
      return "";
    } else {
      return "-other";
    }
  });

  function getImg(dir: string, name: string, status: boolean, type = "png") {
    return new URL(
      `@/assets/virtual/${dir}/${name}${status ? "active" : "un"}${
        isZh.value
      }.${type}`,
      import.meta.url
    ).href;
  }

  function getPopupsImg(
    dir: string,
    name: string,
    langId: string | number,
    type = "png"
  ) {
    return new URL(
      `@/assets/virtual/${dir}/${name}${langId}.${type}`,
      import.meta.url
    ).href;
  }

  return { getImg, getPopupsImg };
}
