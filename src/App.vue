<script lang="ts">
import {
  defineComponent,
  getCurrentInstance,
  onMounted,
  onUnmounted,
  watch,
} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { socketServiceHook } from '@/service/webSocket'
import { globalApiConfigStore } from '@/store/globalApiConfig'
import { userInfoStore } from '@/store/userInfo'
import { GetParam } from '@/utils/getCommonInfo'
import { socketCacheStore } from '@/store/socketCache'

export default defineComponent({
  name: 'App',
  setup() {
    const { openTimer, closeTimer } = globalApiConfigStore()

    const { initLangAction } = userInfoStore()

    const { initOddRoom } = socketCacheStore()

    const router = useRouter()

    const route = useRoute()

    const { proxy } = getCurrentInstance() as any

    const { leaveRoom, joinRoom } = socketServiceHook(proxy)

    let gameId: any = null

    function roomConfig(to: any) {
      if (to.name === 'MatchDetail') {
        gameId = to.query?.game_id
        joinRoom('room_type_handicap_push', Number(gameId))
        return
      }
      if (route.name !== 'MatchDetail' && gameId) {
        leaveRoom('room_type_handicap_push', Number(gameId))
        gameId = null
      }
    }

    watch(
      () => route,
      (to) => {
        roomConfig(to)
        initOddRoom()
      },
      { deep: true },
    )

    // 是否跳转
    function isJump() {
      const game_id
        = GetParam(window.location.href, 'id')
        || GetParam(window.location.href, 'game_id')
      const category_id = GetParam(window.location.href, 'category_id')
      const teamPointIds = GetParam(window.location.href, 'teamPointIds')
      if (game_id && category_id) {
        if (teamPointIds) {
          router.push({
            name: 'MatchDetail',
            query: { game_id, category_id, teamPointIds, betType: 'simple' },
          })
        }
        else {
          router.push({
            name: 'MatchDetail',
            query: { game_id, category_id, betType: 'simple' },
          })
        }
      }
    }

    onMounted(() => {
      // 开启全局计时器获取当前时间
      openTimer()
      // 初始化语言
      initLangAction()
      // 尝试跳转
      isJump()
    })

    onUnmounted(() => {
      closeTimer()
      leaveRoom('room_type_index_content_push')
    })
  },
})
</script>

<template>
  <router-view />
</template>
