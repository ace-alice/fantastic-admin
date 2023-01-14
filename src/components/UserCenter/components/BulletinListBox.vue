<template>
  <div class="BulletinListBox tab-box">
    <div class="box-header"></div>
    <div class="box-body">
      <el-scrollbar ref="scrollbarRef" v-if="noticeList.length > 0 || loading">
        <transition-group name="list" appear>
          <BulletinItem
            v-for="info in noticeList"
            :key="info['id']"
            :info="info"
          />
        </transition-group>
      </el-scrollbar>
      <div class="no-data">
        <LazyImage :img-url="emptyImg" />
        <div>{{ $t("no_data_now") }}</div>
      </div>
    </div>
    <div class="box-footer">
      <el-pagination
        layout="prev, pager, next"
        :total="noticeNum"
        v-model:page-size="formData.limit"
        v-model:current-page="formData.page"
        @current-change="getNoticeList"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, Ref } from "vue";
import { getNoticeInfo } from "@/api/tools-api";
import BulletinItem from "@/components/UserCenter/components/BulletinItem.vue";
import { ElScrollbar } from "element-plus";
import useImageResource from "@/hooks/useImageResource";

export default defineComponent({
  name: "BulletinListBox",
  components: { BulletinItem },
  setup() {
    const { emptyImg } = useImageResource();

    const scrollbarRef: Ref<InstanceType<typeof ElScrollbar> | null> =
      ref(null);

    // 公告列表
    const noticeList: Ref<Array<any>> = ref([]);

    // 公告数量
    const noticeNum = ref(0);

    // 发送请求的 数据
    let formData = reactive({
      start_date: null,
      end_date: null,
      keywords: null,
      page: 1,
      limit: 10,
    });

    const loading = ref(false);

    // 获取公告列表
    function getNoticeList() {
      loading.value = true;
      getNoticeInfo(formData)
        .then(({ data }: any) => {
          if (+data.code === 1) {
            if (scrollbarRef.value) {
              scrollbarRef.value.setScrollTop(0);
            }
            noticeNum.value = +data.data.total;
            noticeList.value = data.data.data;
          }
        })
        .finally(() => {
          loading.value = false;
        });
    }

    onMounted(() => {
      getNoticeList();
    });

    return {
      noticeList,
      noticeNum,
      formData,
      getNoticeList,
      scrollbarRef,
      loading,
      emptyImg,
    };
  },
});
</script>

<!--suppress CssInvalidPseudoSelector -->
<style lang="scss" scoped>
.BulletinListBox {
  .box-body {
    padding: 12px;
    overflow: hidden;
  }
  .no-data {
    display: flex;
    height: 100%;
    width: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .lazy-image {
      height: 100px;
    }
    font-family: PingFangSC-Regular, monospace;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.6);
    font-weight: 400;
    div:nth-child(2) {
      margin-top: 16px;
    }
  }
}
</style>
