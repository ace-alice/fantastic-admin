<template>
  <div :class="{ HotMatchBox: true, hasMatch: matchListData.length > 0 }">
    <template v-for="(match, index) in matchListData">
      <HotBoxItem
        :key="match.id"
        v-if="index < 3"
        :matchInfo="match"
        :bg="getImageUrl(hotBgImage[index])"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent, ref, watch } from "vue";
import getUniversalListHook from "@/hooks/getUniversalListHook";
const HotBoxItem = defineAsyncComponent(
  () => import("@/components/HotBoxItem/index.vue")
);

const gameTypeCode: any = {
  "1": "yxlm_",
  "2": "dota_",
  "3": "csgo_",
  "16": "wzry_",
};

export default defineComponent({
  name: "HotMatchBox",
  components: { HotBoxItem },
  setup() {
    const { matchListData } = getUniversalListHook("hot" as any);

    const hotBgImage = ref(["yxlm_01", "yxlm_02", "yxlm_03"]);

    watch(
      () => matchListData.value,
      (newVal) => {
        const tempArr: string[] = [];
        newVal.forEach((match: any, index) => {
          if (index < 3) {
            tempArr.push(String(match.game_type_id));
            const len = tempArr.filter((id: string) => {
              return id === String(match.game_type_id);
            }).length;

            hotBgImage.value.splice(
              index,
              1,
              `${gameTypeCode[String(match.game_type_id)] || "wzry_"}${
                len ? String(len).padStart(2, "0") : "1"
              }`
            );
          } else {
            return;
          }
        });
      },
      { deep: true }
    );

    function getImageUrl(str: string) {
      return new URL("@/assets/banner/" + str + ".png" ,import.meta.url).href;
    }

    return { matchListData, hotBgImage, getImageUrl };
  },
});
</script>

<style lang="scss" scoped>
.HotMatchBox {
  height: 0;
  display: flex;
  align-items: flex-end;
}
.hasMatch {
  height: 242px;
}
</style>
