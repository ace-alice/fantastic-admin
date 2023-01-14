<!--suppress JSUnresolvedVariable -->
<template>
  <div
    class="auto-chess-bet-history"
    @click.stop="openDialog"
    @mouseenter="historyBtnImg.isHover = true"
    @mouseleave="historyBtnImg.isHover = false"
  >
    <el-image
      v-show="!historyBtnImg.isHover && !historyBtnImg.isSelected"
      :src="historyBtnImg.normal"
      fit="contain"
    >
      <template #error>
        <img :src="historyBtnImg.normal" alt="" />
      </template>
      <template #placeholder>
        <div></div>
      </template>
    </el-image>
    <el-image
      v-show="historyBtnImg.isHover || historyBtnImg.isSelected"
      :src="historyBtnImg.hover"
      fit="contain"
    >
      <template #error>
        <img :src="historyBtnImg.hover" alt="" />
      </template>
      <template #placeholder>
        <div></div>
      </template>
    </el-image>
  </div>
  <el-dialog
    v-model="historyBtnImg.isSelected"
    :append-to-body="true"
    class="auto-chess-bet-history-dialog-class"
    :show-close="false"
  >
    <div class="history-dialog-title">
      <!-- <el-image :src="historyBtnImg.titleImg" fit="contain">
        <template #error>
          <img :src="historyBtnImg.titleImg" />
        </template>
        <template #placeholder>
          <div></div>
        </template>
      </el-image> -->
      <div class="autochess-rule-title">{{ $t("game_records") }}</div>
      <div
        class="close-icon"
        @click.stop="historyBtnImg.isSelected = false"
        @mouseenter="historyBtnImg.closeIconIsHover = true"
        @mouseleave="historyBtnImg.closeIconIsHover = false"
      >
        <el-image
          v-show="historyBtnImg.closeIconIsHover"
          class="close-icon"
          :src="historyBtnImg.closeIconHover"
          fit="contain"
        >
          <template #error>
            <img :src="historyBtnImg.closeIconHover" alt="" />
          </template>
          <template #placeholder>
            <div></div>
          </template>
        </el-image>
        <el-image
          v-show="!historyBtnImg.closeIconIsHover"
          class="close-icon"
          :src="historyBtnImg.closeIcon"
          fit="contain"
        >
          <template #error>
            <img :src="historyBtnImg.closeIcon" alt="" />
          </template>
          <template #placeholder>
            <div></div>
          </template>
        </el-image>
      </div>
    </div>
    <div
      class="history-box"
      :class="{ 'history-box-loading': historyBtnImg.loading }"
    >
      <div class="history-table-title">
        <div class="table-user-name">
          <span> {{ $t("autoChessRule.user_name") }}</span>
        </div>
        <div class="table-amount">
          <span class="table-amount-amount">{{
            $t("autoChessRule.game_amout")
          }}</span>
          <span>( {{ symbol }} )</span>
        </div>
        <div class="table-time">
          <span>{{ $t("autoChessRule.game_time") }}</span>
        </div>
        <div class="table-type">
          <span>{{ $t("autoChessRule.op_type") }}</span>
        </div>
        <div class="table-content">
          <span>{{ $t("autoChessRule.bet_content") }}</span>
        </div>
      </div>
      <div v-if="historyData.data.length === 0">{{ $t("no_data_now") }}</div>
      <div
        class="history-table-body"
        v-for="(data, index) in historyData.data"
        :key="index"
      >
        <div class="table-user-name">
          <span v-if="data['username']">{{ data.username }}</span>
        </div>
        <div class="table-amount">
          <span v-if="data.amount && data.amount > 0">+</span>
          <span v-if="data.amount">{{ data.amount }}</span>
        </div>
        <div class="table-time">
          <span v-if="data.time_stamp">{{
            parseTimeFun(
              Number(String(data.time_stamp).padEnd(13, "0")),
              "{y}/{m}/{d} {h}:{i}"
            )
          }}</span>
        </div>
        <div class="table-type">
          <span
            v-if="data.type"
            :class="{
              buy: data.type_code === 'buy',
              shell: data.type_code === 'sell',
            }"
            >{{ data.type }}</span
          >
        </div>
        <div class="table-content">
          <div
            class="table-content-has"
            v-if="
              data.type_code !== 'refresh' &&
              data.content &&
              data.content.length > 0
            "
          >
            <div class="table-content-picture">
              <el-image :src="data.content[0].picture" fit="contain">
                <template #error>
                  <img style="width: 30px; height: 30px" :src="errImg" alt="" />
                </template>
                <template #placeholder>
                  <div></div>
                </template>
              </el-image>
            </div>
            <div
              v-if="data.content[0].name"
              class="table-content-name"
              :style="{
                color: data.content[0].color ? data.content[0].color : '#fff',
              }"
            >
              {{ data.content[0].name }}
            </div>
            <div class="table-content-star">
              <el-image
                v-for="i in data.content[0].star"
                :key="i"
                :src="starImg"
                fit="contain"
              >
                <template #error>
                  <img :src="errImg" alt="" />
                </template>
                <template #placeholder>
                  <div></div>
                </template>
              </el-image>
            </div>
          </div>
          <div v-else>- - -</div>
        </div>
      </div>
    </div>
    <div class="pagination">
      <el-pagination
        layout="prev, pager, next"
        :total="historyData.total"
        v-model:current-page="formData.page"
        @current-change="getHistoryFun"
      ></el-pagination>
    </div>
  </el-dialog>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-var-requires */
import { getGameHistory } from "@/api/autoChess";
import { computed, defineComponent, reactive } from "vue";
import { parseTime } from "@/utils";
import { storeToRefs } from "pinia";
import { userInfoStore } from "@/store/userInfo";

export default defineComponent({
  name: "betHistory",
  props: {
    symbol: {
      type: String,
      default: "¥",
    },
  },
  setup() {
    const parseTimeFun = parseTime;

    const { langConfig } = storeToRefs(userInfoStore());
    // 图片加载失败时显示的默认图片
    const errImg = new URL("@/assets/images/logo-error.png", import.meta.url)
      .href;
    // 星星图片
    const starImg = new URL("@/assets/autoChess/star.png", import.meta.url)
      .href;
    //当前语言
    const lang = computed(() => {
      if (+langConfig.value.id === 1) {
        return "";
      } else {
        return "en/";
      }
    });
    //游戏记录图片
    const historyBtnImg = reactive({
      normal: new URL(
        `@/assets/autoChess/${lang.value}btn-history-normal.png`,
        import.meta.url
      ).href,
      hover: new URL(
        `@/assets/autoChess/${lang.value}btn-history-hover.png`,
        import.meta.url
      ).href,
      // titleImg: new URL(`@/assets/autoChess/${lang.value}history_title.png` ,import.meta.url).href,
      closeIcon: new URL(`@/assets/autoChess/btn-x-normal.png`, import.meta.url)
        .href,
      closeIconHover: new URL(
        `@/assets/autoChess/btn-x-hover.png`,
        import.meta.url
      ).href,
      closeIconIsHover: false,
      isHover: false,
      isSelected: false,
      // 加载loading
      loading: false,
    });

    let historyData: any = reactive({
      current_page: 1,
      data: [],
      last_page: 1,
      per_page: 1,
      total: 0,
    });

    //游戏列表的formData
    let formData = reactive({
      page: 1,
    });

    //获取游戏记录
    function getGameHistoryFun() {
      return new Promise((resolve) => {
        historyBtnImg.loading = true;
        getGameHistory(formData)
          .then((res: { data: { status: number; data: any } }) => {
            if (+res.data.status === 1) {
              Object.assign(historyData, res.data.data);
            }
          })
          .finally(() => {
            historyBtnImg.loading = false;
            resolve(true);
          });
      });
    }

    //页码改变
    function getHistoryFun() {
      getGameHistoryFun();
    }

    // 打开游戏记录
    async function openDialog() {
      formData.page = 1;
      await getGameHistoryFun();
      historyBtnImg.isSelected = true;
    }

    return {
      errImg,
      historyBtnImg,
      openDialog,
      historyData,
      parseTimeFun,
      starImg,
      formData,
      getHistoryFun,
    };
  },
});
</script>

<style lang="scss" scoped>
.auto-chess-bet-history {
  position: absolute;
  right: 200px;
}
</style>
