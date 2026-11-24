import request from "@/utils/request";

import { ENUM_HTTP } from "@/enum/http";

import type { TypeLog } from "@/interface/log";
import type { TypeCommon } from "@/interface/common";

/**
 * @name getLogs 获取 “系统日志” 列表
 */
export function getLogs(params: TypeLog.ReqLogs) {
  return request<TypeCommon.Response<TypeLog.DTO>>("log", {
    method: ENUM_HTTP.REQUEST_MODE.GET,
    proxy: ENUM_HTTP.PROXY.AUTH,
    params,
  });
}

/**
 * @name clearLogs 清空 “系统日志”
 */
export function clearLogs() {
  return request("log/clear", {
    method: ENUM_HTTP.REQUEST_MODE.GET,
    proxy: ENUM_HTTP.PROXY.AUTH,
    message: "日志已清空",
  });
}
