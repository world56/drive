import request from "@/utils/request";

import { ENUM_HTTP } from "@/enum/http";

import type { TypeResource } from "@/interface/resource";

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

/**
 * @name getResources 获取资源列表
 * @description 通过ID查询目录下的资源
 */
export function getResources(params: TypeResource.QueryResources) {
  return request<TypeResource.DTO[]>("resource/list", {
    method: ENUM_HTTP.REQUEST_MODE.GET,
    proxy: ENUM_HTTP.PROXY.EXPLORER,
    params,
  });
}
