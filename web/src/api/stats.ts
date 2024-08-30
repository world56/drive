import request from "@/utils/request";

import { ENUM_HTTP } from "@/enum/http";

import type { TypeStats } from "@/interface/stats";

/**
 * @name getStorageInfo 查询 “系统存储情况”
 */
export function getStorageInfo() {
  return request<TypeStats.Storage>("storage", {
    method: ENUM_HTTP.REQUEST_MODE.GET,
    proxy: ENUM_HTTP.PROXY.STATS,
  });
}

/**
 * @name getAccessTrend 查询 “系统访问趋势”
 * @description 系统14天的访问趋势
 */
export function getAccessTrend() {
  return request<TypeStats.Access>("access", {
    method: ENUM_HTTP.REQUEST_MODE.GET,
    proxy: ENUM_HTTP.PROXY.STATS,
  });
}
