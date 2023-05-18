import request from "@/utils/request";

import { ENUM_HTTP } from "@/enum/http";

import type { TypeUser } from "@/interface/user";

export function getSecretKey() {
  return request<string>("auth/crypto", {
    method: ENUM_HTTP.REQUEST_MODE.GET,
  });
}

export function getSuperStatus() {
  return request<boolean>("auth/account/super", {
    method: ENUM_HTTP.REQUEST_MODE.GET,
  });
}

export function getUserInfo() {
  return request<Omit<TypeUser.DTO, "password">>("auth/account/user", {
    method: ENUM_HTTP.REQUEST_MODE.POST,
  });
}

export function register(data: string) {
  return request<string>("auth/account/register", {
    method: ENUM_HTTP.REQUEST_MODE.POST,
    data,
  });
}

export function login(data: string) {
  return request<string>("auth/account/login", {
    method: ENUM_HTTP.REQUEST_MODE.POST,
    data,
  });
}
