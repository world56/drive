import request from "@/utils/request";

import { ENUM_HTTP } from "@/enum/http";

import type { TypeUser } from "@/interface/user";

/**
 * @name getSecretKey 获取密钥（公钥）
 * @description 客户端用来加密数据
 */
export function getSecretKey() {
  return request<string>("crypto", {
    method: ENUM_HTTP.REQUEST_MODE.GET,
    proxy: ENUM_HTTP.PROXY.AUTH,
  });
}

/**
 * @name getSuperStatus 系统是否注册超级管理员
 * @description 系统初始化必需拥有“超级管理员”
 */
export function getSuperStatus() {
  return request<boolean>("account/super", {
    method: ENUM_HTTP.REQUEST_MODE.GET,
    proxy: ENUM_HTTP.PROXY.AUTH,
  });
}

/**
 * @name getUserInfo 获取登陆用户信息
 */
export function getUserInfo() {
  return request<Omit<TypeUser.DTO, "password">>("account/user", {
    method: ENUM_HTTP.REQUEST_MODE.POST,
    proxy: ENUM_HTTP.PROXY.AUTH,
  });
}

/**
 * @name register 注册超级管理员
 */
export function register(data: string) {
  return request<string>("account/register", {
    method: ENUM_HTTP.REQUEST_MODE.POST,
    proxy: ENUM_HTTP.PROXY.AUTH,
    data,
  });
}

/**
 * @name login 用户登陆
 * @returns 用户token
 */
export function login(data: string) {
  return request<string>("account/login", {
    method: ENUM_HTTP.REQUEST_MODE.POST,
    proxy: ENUM_HTTP.PROXY.AUTH,
    data,
  });
}

/**
 * @name logout 用户退出
 * @description 通知服务器用户主动下线
 */
export function logout() {
  return request<boolean>("account/logout", {
    method: ENUM_HTTP.REQUEST_MODE.POST,
    proxy: ENUM_HTTP.PROXY.AUTH,
  });
}
