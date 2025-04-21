import request from "@/utils/request";

import { ENUM_HTTP } from "@/enum/http";

import type { TypeStats } from "@/interface/stats";

/**
 * @name getStorageInfo 查询 “系统存储情况”
 */
export function getStorageInfo() {
  return request<TypeStats.ResStorage>("storage", {
    method: ENUM_HTTP.REQUEST_MODE.GET,
    proxy: ENUM_HTTP.PROXY.STATS,
  });
}

/**
 * @name getAccessTrend 查询 “系统访问趋势”
 * @description 系统14天的访问趋势
 */
export function getAccessTrend() {
  return request<TypeStats.ResAccess>("access", {
    method: ENUM_HTTP.REQUEST_MODE.GET,
    proxy: ENUM_HTTP.PROXY.STATS,
  });
}

/**
 * @name insertHotSearch 新增 “用户热门” 字眼
 */
export function insertHotSearch(data: TypeStats.ReqHot) {
  return request<boolean>("hot", {
    method: ENUM_HTTP.REQUEST_MODE.PUT,
    proxy: ENUM_HTTP.PROXY.STATS,
    data,
  });
}

/**
 * @name getHotSearch 查询 “用户热门” 字眼
 */
export function getHotSearch() {
  return request<TypeStats.ResHot>("hot", {
    method: ENUM_HTTP.REQUEST_MODE.GET,
    proxy: ENUM_HTTP.PROXY.STATS,
  });
}

/**
 * @name getRecentResources 查询 “最近创建、上传资源”
 */
export function getRecentResources() {
  return request<TypeStats.ResRecently[]>("recently", {
    method: ENUM_HTTP.REQUEST_MODE.GET,
    proxy: ENUM_HTTP.PROXY.STATS,
  });
}

/**
 * @name getFavoriteCount 查询 “收藏排行”
 */
export function getFavoriteCount() {
  return request<TypeStats.ResFavorite[]>("favorite", {
    method: ENUM_HTTP.REQUEST_MODE.GET,
    proxy: ENUM_HTTP.PROXY.STATS,
  });
}
