<script lang="ts">
import { defineAsyncComponent, defineComponent, ref, watch } from 'vue'
import getUniversalListHook from '@/hooks/getUniversalListHook'
import useImageResource from '@/hooks/useImageResource'
const HotBoxItem = defineAsyncComponent(
  () => import('@/components/HotBoxItem/index.vue'),
)

const gameTypeCode: any = {
  1: 'yxlm_',
  2: 'dota_',
  3: 'csgo_',
  16: 'wzry_',
}

export default defineComponent({
  name: 'HotMatchBox',
  components: { HotBoxItem },
  setup() {
    const { matchListData } = getUniversalListHook('hot' as any)

    const imageResource: any = useImageResource()

    function getImageUrl(game_type_id: number, index: number) {
      const prev = gameTypeCode[String(game_type_id)]
      const next = `0${index % 3 + 1}`
      return imageResource[prev + next]
    }

    return { matchListData, getImageUrl }
  },
})
</script>

<template>
  <div class="HotMatchBox" :class="{ hasMatch: matchListData.length > 0 }">
    <template v-for="(match, index) in matchListData">
      <HotBoxItem
        v-if="index < 3"
        :key="match.id"
        :match-info="match"
        :bg="getImageUrl(+match.game_type_id, index)"
      />
    </template>
  </div>
</template>

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
