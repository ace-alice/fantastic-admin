<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { setHotService, setOddService } from '@/api/socket-test'

export default defineComponent({
  name: 'SocketTest',
  components: {},
  setup() {
    const dialogVisible = ref(false)

    const setHotForm = reactive({
      game_id: null,
    })

    const setHotLoading = ref(false)

    function setHot() {
      if (!setHotForm.game_id || setHotLoading.value) {
        return
      }
      setHotLoading.value = true
      setHotService(setHotForm)
        .then((res: any) => {
          if (+res.data.code === 1) {
            setHotForm.game_id = null
            ElMessage('设置成功')
          }
          else {
            ElMessage('设置失败')
          }
        })
        .catch(() => {
          ElMessage('设置失败')
        })
        .finally(() => {
          setHotLoading.value = false
        })
    }

    const setOddForm = reactive({
      point_id: null,
      delta: null,
      match_id: null,
    })

    const setOddLoading = ref(false)

    function setOdd() {
      if (
        !setOddForm.point_id
        || !setOddForm.delta
        || !setOddForm.match_id
        || setOddLoading.value
      ) { return }
      setOddLoading.value = true
      setOddService(setOddForm)
        .then((res: any) => {
          if (+res.data.code === 1) {
            setOddForm.point_id = null
            setOddForm.match_id = null
            setOddForm.delta = null

            ElMessage('设置成功')
          }
          else {
            ElMessage('设置失败')
          }
        })
        .catch(() => {
          ElMessage('设置失败')
        })
        .finally(() => {
          setOddLoading.value = false
        })
    }

    return {
      dialogVisible,
      setHotForm,
      setHot,
      setHotLoading,
      setOddForm,
      setOddLoading,
      setOdd,
    }
  },
})
</script>

<template>
  <div class="SocketTest">
    <el-button type="success" plain @click="dialogVisible = true">
      Socket测试
    </el-button>
    <el-dialog v-model="dialogVisible" title="Socket测试" width="1080px">
      <el-form :model="setHotForm" :inline="true">
        <el-form-item label="游戏id">
          <el-input
            v-model="setHotForm.game_id"
            type="number"
            :disabled="setHotLoading"
          />
        </el-form-item>
        <el-form-item>
          <el-button :loading="setHotLoading" type="primary" @click="setHot">
            设置热门赛事
          </el-button>
        </el-form-item>
      </el-form>
      <el-form :model="setOddForm" :inline="true">
        <el-form-item label="比赛id">
          <el-input
            v-model="setOddForm.match_id"
            type="number"
            :disabled="setOddLoading"
          />
        </el-form-item>
        <el-form-item label="投注项id">
          <el-input
            v-model="setOddForm.point_id"
            type="number"
            :disabled="setOddLoading"
          />
        </el-form-item>
        <el-form-item label="赔率">
          <el-input
            v-model="setOddForm.delta"
            type="number"
            :disabled="setOddLoading"
          />
        </el-form-item>
        <el-form-item>
          <el-button :loading="setOddLoading" type="primary" @click="setOdd">
            赔率推送
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
</style>
