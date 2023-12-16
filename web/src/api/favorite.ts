import request from "@/utils/request";

import { ENUM_HTTP } from "@/enum/http";

import type { TypeCommon } from "@/interface/common";
import type { TypeFavorite } from "@/interface/favorite";

/**
 * @name getFavorites 获取“资源”收藏列表
 */
export function getFavorites(params: TypeFavorite.ReqFavorites) {
  return request<TypeCommon.Response<TypeFavorite.DTO>>("favorite/list", {
    method: ENUM_HTTP.REQUEST_MODE.GET,
    proxy: ENUM_HTTP.PROXY.FAVORITE,
    params,
  });
}

/**
 * @name updateFavorite 收藏、取消收藏“资源” 单个
 */
export function updateFavorite(params: TypeFavorite.Insert) {
  return request<boolean>(`favorite/${params.resourceId}`, {
    method: ENUM_HTTP.REQUEST_MODE.GET,
    proxy: ENUM_HTTP.PROXY.FAVORITE,
    message: true,
  });
}

/**
 * @name removeFavorite 移除“资源”
 */
export function removeFavorite(params: TypeFavorite.Remove) {
  return request<boolean>("favorite/insert", {
    method: ENUM_HTTP.REQUEST_MODE.POST,
    proxy: ENUM_HTTP.PROXY.FAVORITE,
    message: true,
    params,
  });
}
