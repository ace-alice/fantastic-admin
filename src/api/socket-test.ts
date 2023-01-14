import service from "@/service";
// 获取公告信息
export function setHotService(data: any) {
  return service({
    url: "/api/game/test/setHot",
    method: "post",
    data,
  });
}

// 获取公告信息
export function setOddService(params: any) {
  return service({
    url: "/api/game/test/setOdd",
    method: "get",
    params,
  });
}
