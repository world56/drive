import request from "@/utils/request";

import { ENUM_HTTP } from "@/enum/http";
import { API_PROXY_EXPLORER_URL } from "@/config/request";

import type { TypeResource } from "@/interface/resource";

/**
 * @name API_DOWNLOAD_FILE_URL 下载文件URL
 */
export const API_DOWNLOAD_FILE_URL = `${API_PROXY_EXPLORER_URL}resource/download`;

/**
 * @name getGlobalResources 查询全局资源
 */
export function getGlobalResources(params: TypeResource.ReqGlobalResources) {
  return request<TypeResource.DTO[]>("resource", {
    method: ENUM_HTTP.REQUEST_MODE.GET,
    proxy: ENUM_HTTP.PROXY.EXPLORER,
    params,
  });
}

/**
 * @name getResources 获取资源列表
 * @param params 通过文件夹ID查询旗下的资源列表
 */
export function getResources(params: TypeResource.ReqResources) {
  return request<TypeResource.DTO[]>("resource/list", {
    method: ENUM_HTTP.REQUEST_MODE.GET,
    proxy: ENUM_HTTP.PROXY.EXPLORER,
    params,
  });
}

/**
 * @name getFolders 获取全部文件夹列表
 * @description 资源页面 左侧的文件夹目录树
 */
export function getFolders() {
  return request<TypeResource.DTO[]>("resource/folders", {
    method: ENUM_HTTP.REQUEST_MODE.GET,
    proxy: ENUM_HTTP.PROXY.EXPLORER,
  });
}

/**
 * @name getResourceDetails 获取资源详情
 */
export function getResourceDetails(
  params: Required<Pick<TypeResource.ReqResources, "id">>,
) {
  return request<TypeResource.DTO>("resource/details", {
    method: ENUM_HTTP.REQUEST_MODE.GET,
    proxy: ENUM_HTTP.PROXY.EXPLORER,
    params,
  });
}

/**
 * @name createFolder 创建文件夹
 */
export function createFolder(data: TypeResource.DTO) {
  return request("resource/create", {
    method: ENUM_HTTP.REQUEST_MODE.POST,
    proxy: ENUM_HTTP.PROXY.EXPLORER,
    message: "创建成功",
    data,
  });
}

/**
 * @name updateResource 编辑文件夹、资源信息
 */
export function updateResource(data: TypeResource.DTO) {
  return request("resource/update", {
    method: ENUM_HTTP.REQUEST_MODE.PUT,
    proxy: ENUM_HTTP.PROXY.EXPLORER,
    message: "编辑成功",
    data,
  });
}

/**
 * @name deleteResources 删除资源（文件、文件夹）
 */
export function deleteResources(data: TypeResource.ReqDeleteResources) {
  return request("resource/delete", {
    method: ENUM_HTTP.REQUEST_MODE.DELETE,
    proxy: ENUM_HTTP.PROXY.EXPLORER,
    message: "删除成功",
    data,
  });
}

/**
 * @name moveResources 批量移动资源
 */
export function moveResources(data: TypeResource.ReqMoveResources) {
  return request("resource/move", {
    method: ENUM_HTTP.REQUEST_MODE.PUT,
    proxy: ENUM_HTTP.PROXY.EXPLORER,
    message: "移动资源成功",
    data,
  });
}

/**
 * @name uploadChunk 上传资源
 */
export function uploadChunk(data: FormData, control: AbortController) {
  return request<TypeResource.DTO | false>("resource/upload", {
    data,
    signal: control.signal,
    proxy: ENUM_HTTP.PROXY.EXPLORER,
    method: ENUM_HTTP.REQUEST_MODE.POST,
    headers: { contentType: ENUM_HTTP.CONTENT_TYPE.MULTIPART },
  });
}
