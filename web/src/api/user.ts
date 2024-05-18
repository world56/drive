import request from "@/utils/request";

import { ENUM_HTTP } from "@/enum/http";

import type { TypeUser } from "@/interface/user";
import type { TypeCommon } from "@/interface/common";

/**
 * @name getUsers 查询-用户列表
 */
export function getUsers(params: TypeUser.ReqUsers) {
  return request<TypeCommon.Response<TypeUser.DTO>>("user/list", {
    method: ENUM_HTTP.REQUEST_MODE.GET,
    proxy: ENUM_HTTP.PROXY.AUTH,
    params,
  });
}

/**
 * @name getUser 查询-用户详情
 */
export function getUser(params: Pick<TypeUser.DTO, "id">) {
  return request<TypeUser.DTO>("user/detail", {
    method: ENUM_HTTP.REQUEST_MODE.GET,
    proxy: ENUM_HTTP.PROXY.AUTH,
    params,
  });
}

/**
 * @name insertUser 新增-用户
 */
export function insertUser(data: TypeUser.DTO) {
  return request<TypeUser.DTO>("user/insert", {
    method: ENUM_HTTP.REQUEST_MODE.POST,
    proxy: ENUM_HTTP.PROXY.AUTH,
    message: "创建成功",
    data,
  });
}

/**
 * @name updateUser 编辑-用户
 */
export function updateUser(data: TypeUser.DTO) {
  return request<TypeUser.DTO>("user/update", {
    method: ENUM_HTTP.REQUEST_MODE.PUT,
    proxy: ENUM_HTTP.PROXY.AUTH,
    message: "编辑成功",
    data,
  });
}

/**
 * @name changeUserStatus 编辑状态-用户
 */
export function changeUserStatus(data: Pick<TypeUser.DTO, "id">) {
  return request<TypeUser.DTO>("user/status", {
    method: ENUM_HTTP.REQUEST_MODE.PUT,
    proxy: ENUM_HTTP.PROXY.AUTH,
    message: "操作成功",
    data,
  });
}

/**
 * @name updatePassword 修改 “用户密码”
 */
export function updatePassword(data: string) {
  return request<TypeUser.DTO>("user/pwd", {
    method: ENUM_HTTP.REQUEST_MODE.PUT,
    proxy: ENUM_HTTP.PROXY.AUTH,
    message: "密码修改成功",
    data,
  });
}
