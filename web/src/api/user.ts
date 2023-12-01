import request from "@/utils/request";

import { ENUM_HTTP } from "@/enum/http";

import type { TypeUser } from "@/interface/user";
import type { TypeCommon } from "@/interface/common";

/**
 * @name getUsers 查询-用户列表
 */
export function getUsers(params: TypeUser.Finds) {
  return request<TypeCommon.Response<TypeUser.DTO>>("/user/list", {
    method: ENUM_HTTP.REQUEST_MODE.GET,
    proxy: ENUM_HTTP.PROXY.AUTH,
    params,
  });
}

/**
 * @name getUser 查询-用户详情
 */
export function getUser(params: Pick<TypeUser.DTO, "id">) {
  return request<TypeUser.DTO>("/user/list", {
    method: ENUM_HTTP.REQUEST_MODE.GET,
    proxy: ENUM_HTTP.PROXY.AUTH,
    params,
  });
}
