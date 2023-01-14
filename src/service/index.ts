// noinspection JSIgnoredPromiseFromCall
import { i18n } from "@/locale";
import axios from "axios";
import { ElMessage } from "element-plus";
import router from "@/router";
import qs from "qs";
// import { GetParam } from "@/utils/getCommonInfo";

// 配置新建一个 axios 实例
const service = axios.create({
  baseURL: window.location.origin,
  withCredentials: false, // send cookies when cross-domain requests
  timeout: 50000,
});

// 添加请求拦截器
service.interceptors.request.use(
  (config:any) => {
    if (config.method === "get") {
      Object.assign(config.headers, {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json",
        "Content-Type": "application/json; charset=UTF-8",
      });
    } else {
      Object.assign(config.headers, {
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      });
    }
    if (config.headers) {
      config.headers["token"] = "ceShi";
    }
    config.data = qs.stringify(config.data);
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// 添加响应拦截器
service.interceptors.response.use(
  (response) => {
    const code = response.status;
    if (code < 200 || code > 300) {
      (ElMessage as any)({
        message: i18n.global.t("network_connection_failed"),
        type: "error",
        duration: 3000,
        customClass: "virtual-fail-bet",
        offset: 320,
        grouping: true,
      });
      return Promise.reject("error");
    } else if (
      parseInt(response.data.code) === 0 &&
      (parseInt(response.data.error_code) == 18 ||
        parseInt(response.data.error_code) == 17 ||
        parseInt(response.data.error_code) == 15)
    ) {
      ElMessage({
        message: response.data.message,
        type: "error",
        duration: 3000,
        customClass: "virtual-fail-bet",
        offset: 320,
      });

      // noinspection JSIgnoredPromiseFromCall
      router.push({
        name: "NotPage",
        query: {
          message: response.data.message,
        },
      });
      return Promise.reject("error");
    } else if (
      parseInt(response.data.code) == 0 &&
      parseInt(response.data.error_code) == 14
    ) {
      (ElMessage as any)({
        message: response.data.message,
        type: "error",
        duration: 3000,
        customClass: "virtual-fail-bet",
        offset: 320,
        grouping: true,
      });
      return Promise.reject("error");
    } else {
      return response;
    }
  },
  (error) => {
    // 对响应错误做点什么
    (ElMessage as any)({
      message: i18n.global.t("network_connection_failed"),
      type: "error",
      duration: 3000,
      customClass: "virtual-fail-bet",
      offset: 320,
      grouping: true,
    });
    return Promise.reject(error);
  }
);

export default service;
