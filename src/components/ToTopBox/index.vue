<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ToTop',
  components: {},
  emits: ['toTop'],
  setup(props: any, { emit }: any) {
    const topImage = new URL('@/assets/icons/home_ live_top.png', import.meta.url).href

    function toTopHandle() {
      emit('toTop')
      const el: any = document.querySelector('.match-list')
      if (!el) {
        return
      }
      setTimeout(() => {
        el.scrollTo({ behavior: 'smooth', top: 0 })
      }, 700)
    }
    return { topImage, toTopHandle }
  },
})
</script>

<template>
  <teleport to=".layout">
    <div class="to-top" @click="toTopHandle">
      <LazyImage :img-url="topImage" />
    </div>
  </teleport>
</template>

<style lang="scss" scoped>
.to-top {
  background: rgba(254, 94, 0, 0.15);
  border: 2px solid rgba(212, 141, 2, 0.5);
  border-radius: 8px;
  height: 48px;
  width: 48px;
  position: absolute;
  bottom: 28px;
  right: 20px;
  z-index: 9001;
  cursor: url("@/assets/icons/home_mouse.png"), auto;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s ease-in-out;
  .lazy-image {
    height: 24px;
    width: 24px;
    opacity: 0.8;
  }
  &:hover {
    background: rgba(254, 94, 0, 0.2);
    border: 2px solid rgba(212, 141, 2, 0.8);
    opacity: 1;
    .lazy-image {
      opacity: 1;
    }
  }
  &:active {
    border: 2px solid rgba(212, 141, 2, 1);
    transform: scale(0.95);
  }
}
</style>
