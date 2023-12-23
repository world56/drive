import request from "@/utils/request";

import { ENUM_HTTP } from "@/enum/http";

import type { TypeFavorite } from "@/interface/favorite";

/**
 * @name getFavorites 获取“资源”收藏列表
 */
export function getFavorites(params: TypeFavorite.ReqFavorites) {
  return request<TypeFavorite.DTO[]>("favorite/list", {
    method: ENUM_HTTP.REQUEST_MODE.GET,
    proxy: ENUM_HTTP.PROXY.FAVORITE,
    params,
  });
}

/**
 * @name updateFavorite 收藏、取消收藏“资源” 单个
 */
export function updateFavorite(data: TypeFavorite.Insert) {
  return request<boolean>(`favorite/insert`, {
    method: ENUM_HTTP.REQUEST_MODE.POST,
    proxy: ENUM_HTTP.PROXY.FAVORITE,
    message: '收藏成功',
    data
  });
}

/**
 * @name removeFavorite 移除“资源”
 */
export function removeFavorite(data: TypeFavorite.Remove) {
  return request<boolean>(`favorite/remove`, {
    method: ENUM_HTTP.REQUEST_MODE.DELETE,
    proxy: ENUM_HTTP.PROXY.FAVORITE,
    data
  });
}
