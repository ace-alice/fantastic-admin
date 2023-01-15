<!-- suppress ALL -->
<script lang="ts">
import { defineAsyncComponent } from 'vue'

import SocketTest from '@/layout/header/components/SocketTest.vue'
const ShortcutMenu = defineAsyncComponent(() =>
  import('./components/ShortcutMenu.vue'),
)
const UserInfoItem = defineAsyncComponent(() =>
  import('./components/UserInfoItem.vue'),
)
const NoticeItem = defineAsyncComponent(() =>
  import('./components/NoticeItem.vue'),
)

export default {

  name: 'HeaderBox',
  components: { ShortcutMenu, UserInfoItem, NoticeItem, SocketTest },
  setup() {
    return {}
  },
}
</script>

<template>
  <div class="header">
    <div class="center-box">
      <NoticeItem />
      <ShortcutMenu />
    </div>
    <div class="right-box">
      <SocketTest />
      <UserInfoItem />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header {
  background: var(--color-bg-primary);
  height: 74px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2.4% 0 0;
  overflow: hidden;
  & > div {
    display: flex;
    align-items: center;
  }
  .center-box {
    flex-grow: 1;
  }
  .right-box {
    flex-shrink: 0;
  }
}
</style>
