<script lang="ts">
import type { Ref } from 'vue'
import {
  defineAsyncComponent,
  defineComponent,
  onMounted,
  ref,
} from 'vue'
import HeaderBox from '@/layout/header/index.vue'
import Sidebar from '@/layout/sidebar/index.vue'
import Container from '@/layout/container/index.vue'
import LoadingPage from '@/components/LodingPage/index.vue'
import { gameInfoStore } from '@/store/gameInfo'
const userCenter = defineAsyncComponent(
  () => import('@/components/UserCenter/index.vue'),
)
export default defineComponent({
  name: 'LayoutBox',
  components: {
    HeaderBox,
    Sidebar,
    Container,
    UserCenter: userCenter,
    LoadingPage,
  },
  setup() {
    const loadingPageRef: Ref<any> = ref(null)

    const { initGameInfo } = gameInfoStore()

    onMounted(() => {
      initGameInfo().finally(() => {
        setTimeout(() => {
          if (loadingPageRef.value) {
            loadingPageRef.value.end()
          }
        }, 240)
      })
    })

    return { loadingPageRef }
  },
})
</script>

<template>
  <div class="layout">
    <LoadingPage ref="loadingPageRef" />
    <Sidebar />
    <div class="layout-body">
      <HeaderBox />
      <Container />
      <div class="footer" />
    </div>
    <UserCenter />
  </div>
</template>

<style lang="scss" scoped>
.layout {
  height: 100%;
  display: flex;
  background: var(--color-bg-primary);
  overflow: hidden;
  max-width: 1440px;
  margin: auto;
  min-width: 1080px;
  position: relative;

  .layout-body {
    flex-grow: 1;
    overflow: hidden;

    & > div {
      overflow: hidden;
    }

    .footer {
      height: 20px;
      width: 100%;
      position: relative;
      overflow: visible;

      &::before {
        content: "";
        position: absolute;
        top: -10px;
        left: 14px;
        height: 10px;
        width: calc(100% - 28px);
        background-color: var(--color-bg-second);
        z-index: 10;
      }
    }
  }
}
</style>
