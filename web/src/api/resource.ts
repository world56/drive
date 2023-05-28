import request from "@/utils/request";

import { ENUM_HTTP } from "@/enum/http";

import type { TypeResource } from "@/interface/resource";

/**
 * @name getResources 获取资源列表
 * @param params 通过文件夹ID查询旗下的资源列表
 */
export function getResources(params: TypeResource.QueryResources) {
  return request<TypeResource.DTO[]>("resource/list", {
    method: ENUM_HTTP.REQUEST_MODE.GET,
    proxy: ENUM_HTTP.PROXY.EXPLORER,
    params,
  });
}

/**
 * @name getFolders 获取全部文件夹
 * @description 资源页面 左侧的文件夹目录树
 */
export function getFolders() {
  return request<TypeResource.DTO[]>("resource/folders", {
    method: ENUM_HTTP.REQUEST_MODE.GET,
    proxy: ENUM_HTTP.PROXY.EXPLORER,
  });
}

/**
 * @name createFolder 创建文件夹
 */
export function createFolder(data: TypeResource.DTO) {
  return request("resource/create", {
    method: ENUM_HTTP.REQUEST_MODE.POST,
    proxy: ENUM_HTTP.PROXY.EXPLORER,
    data,
  });
}
