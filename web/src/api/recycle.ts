import request from "@/utils/request";

import { ENUM_HTTP } from "@/enum/http";

import type { TypeRecycle } from "@/interface/recycle";

/**
 * @name getRecycles “回收站资源” 列表
 */
export function getRecycles() {
  return request<TypeRecycle.DTO[]>("recovery", {
    method: ENUM_HTTP.REQUEST_MODE.GET,
    proxy: ENUM_HTTP.PROXY.RECOVERY,
  });
}

/**
 * @name deleteRecycles 删除 “回收站资源”
 */
export function deleteRecycles(data: TypeRecycle.ReqDelete) {
  return request<boolean>("recovery", {
    method: ENUM_HTTP.REQUEST_MODE.DELETE,
    proxy: ENUM_HTTP.PROXY.RECOVERY,
    data,
    message: "操作完成",
  });
}

/**
 * @name recoverRecycles 恢复 “回收站资源”
 */
export function recoverRecycles(data: TypeRecycle.ReqRecover) {
  return request<boolean>("recovery", {
    method: ENUM_HTTP.REQUEST_MODE.POST,
    proxy: ENUM_HTTP.PROXY.RECOVERY,
    data,
    message: "操作成功，若资源归属文件夹被删除，则恢复至根目录",
  });
}

/**
 * @name recoverRecycles 检查 “回收站资源” 上级目录是否存在
 */
export function checkRecycles(params: TypeRecycle.ReqCheck) {
  return request<TypeRecycle.ResCheck>("recovery/check", {
    method: ENUM_HTTP.REQUEST_MODE.GET,
    proxy: ENUM_HTTP.PROXY.RECOVERY,
    params,
  });
}
