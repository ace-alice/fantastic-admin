import { defineStore } from 'pinia'
import type { Ref } from 'vue'
import { ref } from 'vue'
import type { PullPointsType } from '@/interface/matchList'
import type { PushAnimationInfoType, PushVideoInfoType } from '@/interface/gameInfo'
import { shopCartStore } from '@/store/shopCart'

export const socketCacheStore = defineStore('socketCache', () => {
  const { pushOddUpdate } = shopCartStore()

  /**
   * @description 赔率推送缓存数据
   * */
  const oddInfoCache: Ref<PullPointsType[]> = ref([])

  function initOddRoom() {
    oddInfoCache.value = []
  }

  /**
   * @description 设置赔率推送缓存数据
   * */
  function pushOddInfo(oddInfo: PullPointsType) {
    pushOddUpdate(oddInfo)
    if (oddInfo.delta) {
      oddInfo.point = oddInfo.delta
      delete oddInfo.delta
    }
    const inx = oddInfoCache.value.findIndex((p) => {
      return +p.point_id === +oddInfo.point_id
    })
    if (inx === -1) {
      oddInfoCache.value.push(oddInfo)
    }
    else {
      oddInfoCache.value.splice(
        inx,
        1,
        Object.assign(oddInfoCache.value[inx], oddInfo),
      )
    }
  }

  /**
   * @description 视频推送缓存数据
   * */
  const videoInfoCache: Ref<PushVideoInfoType[]> = ref([])

  /**
   * @description 设置视频推送缓存数据
   * */
  function pushVideoInfo(videoInfo: PushVideoInfoType) {
    const inx = videoInfoCache.value.findIndex((video) => {
      return String(video.game_id) === String(videoInfo.game_id)
    })
    inx === -1
      ? videoInfoCache.value.push(videoInfo)
      : videoInfoCache.value.splice(inx, 1, videoInfo)
  }

  /**
   * @description 动画推送缓存数据
   * */
  const animationInfoCache: Ref<PushAnimationInfoType[]> = ref([])

  /**
   * @description 设置动画推送缓存数据
   * */
  function pushAnimationInfo(animationInfo: PushAnimationInfoType) {
    const inx = animationInfoCache.value.findIndex((animation) => {
      return String(animation.game_id) === String(animationInfo.game_id)
    })
    inx === -1
      ? animationInfoCache.value.push(animationInfo)
      : animationInfoCache.value.splice(inx, 1, animationInfo)
  }

  return {
    oddInfoCache,
    pushOddInfo,
    videoInfoCache,
    pushVideoInfo,
    animationInfoCache,
    pushAnimationInfo,
    initOddRoom,
  }
})
