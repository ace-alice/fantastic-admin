/* eslint-disable @typescript-eslint/no-unused-vars */
// noinspection JSIgnoredPromiseFromCall
import { storeToRefs } from 'pinia'
import io from 'socket.io-client'
import { onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import router from '@/router'
import { gameInfoStore } from '@/store/gameInfo'
import { socketCacheStore } from '@/store/socketCache'
import { shopCartStore } from '@/store/shopCart'
import type { HandicapType } from '@/interface/gameInfo'
import webSocketEdge from '@/service/webSocketEdge'
import { getLocal } from '@/utils/storage'
import type { ShopCartElementType } from '@/interface/shopCart'

interface DataType {
  room_type: string
  message_type: string
  content: any
}

export function socketServiceHook(proxy?: any) {
  /**
   * @description 引入推送缓存方法
   * */
  const { pushOddInfo, pushVideoInfo, pushAnimationInfo } = socketCacheStore()

  /**
     * @description 引入购物车方法
     * */
  const { socketPushChange } = shopCartStore()

  /**
     * @description 引入比赛信息处理方法
     * */
  const { hasInitHandicap } = storeToRefs(gameInfoStore())

  const { toGetHandicapList, toGetGameList } = gameInfoStore()

  /**
     * @description 更新比赛统计信息的定时器
     * */
  let updateMatchCountTimer: any = null

  const {
    close,
    disconnect,
    error,
    connectError,
    reconnectFailed,
    reconnectError,
    reconnectAttempt,
    reconnecting,
    reconnect,
    connectTimeout,
    ping,
    pong,
    joinRoomCallBack,
    leaveRoomCallBack,
  } = webSocketEdge()

  const socket = io(import.meta.env.VUE_APP_SOCKET_API, {
    transports: ['websocket'],
    auth: {
      token: '123',
    },
  })

  const route = useRoute()

  socket.on('ping', ping)
  socket.on('pong', pong)
  socket.on('close', close)
  socket.on('connect', initRoomConnect)
  socket.on('disconnect', disconnect)
  socket.on('connect-error', connectError)
  socket.on('error', error)
  socket.on('reconnect-failed', reconnectFailed)
  socket.on('reconnect-error', reconnectError)
  socket.on('reconnect-attempt', reconnectAttempt)
  socket.on('reconnecting', reconnecting)
  socket.on('reconnect', reconnect)
  socket.on('connect-timeout', connectTimeout)
  socket.on('joinRoomCallBack', joinRoomCallBack)
  socket.on('leaveRoomCallBack', leaveRoomCallBack)
  socket.on('roomMessageCallBack', roomMessageCallBack)

  /**
   * @description 加入房间
   * @param room_type 房间类型
   * @param handicap_id 房间id
   * */
  function joinRoom(room_type: string, handicap_id?: number) {
    if (!socket.connected) {
      return
    }
    socket.emit('RoomJoin', {
      room_type,
      handicap_id,
    })
  }

  /**
   * @description 离开房间
   * @param room_type 房间类型
   * @param handicap_id 房间id
   * */
  function leaveRoom(room_type: string, handicap_id?: number) {
    if (!socket.connected) {
      return
    }
    socket.emit('RoomLeave', {
      room_type,
      handicap_id,
    })
  }

  /**
   * @description 初始化房间连接
   * */
  function initRoomConnect() {
    joinRoom('room_type_index_content_push')
    const gameRoomIds = (getLocal('shopCartList') || []).map(
      (cart: ShopCartElementType) => {
        return String(cart.game_id)
      },
    )
    if (route.name === 'MatchDetail' && route.query.game_id) {
      gameRoomIds.push(route.query.game_id)
    }
    [...new Set(gameRoomIds)].forEach((gameId: any) => {
      joinRoom('room_type_handicap_push', Number(gameId))
    })
  }

  /**
   * @description 接收信息后的操作
   * @param data {type:DataType} 推送的数据
   * */
  function roomMessageCallBack(data: DataType) {
    switch (data.message_type) {
      case 'message_type_push_point_change':
        if (!data.content) {
          return
        }
        // eslint-disable-next-line no-case-declarations
        const contentData = JSON.parse(data.content)
        if (contentData.point_id && contentData.delta) {
          pushOddInfo(contentData)
        }
        break
      default:
        //
    }
  }

  /**
   * @description 触发获取比赛统计信息
   * */
  function emitUpdateMatchCount() {
    if (!updateMatchCountTimer) {
      return
    }
    updateMatchCountTimer = setTimeout(() => {
      toGetHandicapList()
      toGetGameList()
    }, 6000)
  }

  /**
   * @description 盘口赛事变化信息处理方法
   * @param data { [赛事id]: 盘口code[] }
   * */
  async function pushChangedGame(data: { [key: string]: string[] }) {
    const gameId = Object.keys(data)[0]
    const codeArr = data[gameId]
    for (const handicap of codeArr) {
      proxy.mittBus.emit(`${handicap}UpdateBus`, gameId)
    }
    emitUpdateMatchCount()
  }

  /**
   * @description 比赛信息变化
   * @param data string|{game_id:比赛id;category_id:1|2|3}
   * */
  async function pushGame(data: any) {
    if (!(typeof data === 'number' || typeof data === 'string')) {
      const currentRoute = router.currentRoute.value

      /**
       * @description 如果目前处于详情页面，当前页面的比赛详情有变化时出发页面数据初始化
       * */
      if (
        currentRoute.name === 'MatchDetail'
        && String(currentRoute.query?.game_id) === String(data.game_id)
      ) {
        if (
          String(currentRoute.query?.category_id)
            !== String(data.category_id)
          && String(data.category_id) === '3'
        ) {
          // noinspection ES6MissingAwait
          router.replace({
            name: 'MatchDetail',
            query: Object.assign({}, router.currentRoute.value.query, {
              category_id: 3,
            }),
          })
        }
        proxy.mittBus.emit('getMatchDetailBus')
      }

      /**
       * @description 当 is_change为true时，说明当前盘口有状态变化
       * */
      if (data.category_id && data.game_id && data.is_change) {
        socketPushChange(data)
      }
      hasInitHandicap.value.forEach((handicap: HandicapType | any) => {
        proxy.mittBus.emit(`${handicap}UpdateBus`, String(data.game_id))
      })
    }
    else {
      hasInitHandicap.value.forEach((handicap: HandicapType | any) => {
        proxy.mittBus.emit(`${handicap}UpdateBus`, String(data))
      })
    }
  }

  onMounted(() => {
    proxy.mittBus.on(
      'joinRoomBus',
      (data: { room_type: string; handicap_id: number }) => {
        joinRoom(data.room_type, data.handicap_id)
      },
    )
    proxy.mittBus.on(
      'leaveRoomBus',
      (data: { room_type: string; handicap_id: number }) => {
        leaveRoom(data.room_type, data.handicap_id)
      },
    )
  })

  onUnmounted(() => {
    proxy.mittBus.off('joinRoomBus')
    proxy.mittBus.off('leaveRoomBus')
  })

  return { joinRoom, leaveRoom }
}
