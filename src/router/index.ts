import type { RouteRecordRaw } from "vue-router";
import { createRouter, createWebHistory } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/match",
  },
  {
    path: "/match",
    name: "Match",
    redirect: "/match/list",
    component: () =>
      import(/* webpackChunkName: "Match" */ "../layout/index.vue"),
    children: [
      {
        path: "list",
        name: "MatchList",
        component: () =>
          import(
            /* webpackChunkName: "MatchList" */ "../views/match-list/index.vue"
          ),
      },
      {
        path: "detail",
        name: "MatchDetail",
        component: () =>
          import(
            /* webpackChunkName: "MatchDetail" */ "../views/match-detail/index.vue"
          ),
      },
    ],
  },
  {
    path: "/schedule",
    name: "Schedule",
    redirect: "/schedule/list",
    component: () =>
      import(/* webpackChunkName: "Schedule" */ "../layout/index.vue"),
    children: [
      {
        path: "list",
        name: "ScheduleList",
        component: () =>
          import(
            /* webpackChunkName: "ScheduleList" */ "../views/schedule-list/index.vue"
          ),
      },
      {
        path: "detail",
        name: "ScheduleDetail",
        component: () =>
          import(
            /* webpackChunkName: "ScheduleDetail" */ "../views/schedule-detail/index.vue"
          ),
      },
    ],
  },
  // 极速LOL
  {
    path: "/virtual",
    name: "Virtual",
    component: () =>
      import(/* webpackChunkName: "virtual" */ "../views/virtual/index.vue"),
  },
  // 自走棋
  {
    path: "/auto-chess",
    name: "AutoChess",
    component: () =>
      import(
        /* webpackChunkName: "AutoChess" */ "../views/auto-chess/index.vue"
      ),
  },
  // ip限制
  {
    path: "/ip-limit",
    name: "IpLimit",
    component: () =>
      import(
        /* webpackChunkName: "IpLimit" */ "../views/error-page/ip-limit.vue"
      ),
  },
  // ip限制
  {
    path: "/404",
    name: "NotPage",
    component: () =>
      import(
        /* webpackChunkName: "NotPage" */ "../views/error-page/not-find-404.vue"
      ),
  },
  // 错误路由处理
  {
    path: "/:catchAll(.*)",
    name: "NotFound",
    redirect: "/404",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0, left: 0 };
    }
  },
});

export default router;
