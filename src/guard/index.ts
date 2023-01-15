// 引入 router 实例
import router from '@/router'
import { userInfoStore } from '@/store/userInfo'

// 路由加载前
router.beforeEach(async (to, from, next) => {
  const { doGetUserInfo } = userInfoStore()
  doGetUserInfo()
  const ripple = document.querySelector('.tooltip-hover')
  if (ripple && ripple.parentNode) {
    ripple.parentNode.removeChild(ripple)
  }
  if (
    to.query.teamPointIds
    && to.query.game_id
    && to.query.category_id
    && to.name !== 'MatchDetail'
  ) {
    next({
      name: 'MatchDetail',
      query: Object.assign(to.query, { betType: 'single' }),
    })
  }
  else {
    next()
  }
})

// 路由加载后
router.afterEach(() => {
  //
})
