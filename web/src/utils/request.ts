import store from "@/store";
import { message } from "antd";
import Cookies from "js-cookie";
import { extend } from "umi-request";
import { ActionsUser } from "@/store/user";

import {
  TOKEN_KEY,
  REQUEST_TIMEOUT,
  API_PROXY_AUTH_URL,
  API_PROXY_RECYCLE_URL,
  API_PROXY_EXPLORER_URL,
  API_PROXY_FAVORITE_URL,
} from "@/config/request";
import { ENUM_HTTP } from "@/enum/http";

import type { ResponseError } from "umi-request";

export interface ServiceResponse<T> {
  content: T;
  readonly message?: string;
  readonly code: ENUM_HTTP.HTTP_CODE;
}

const MSG_WHITELIST = [
  "AbortError: The user aborted a request.",
  "DOMException: The user aborted a request.",
];

async function errorHandler(res: ResponseError) {
  return Promise.reject(res.response);
}

const request = extend({
  timeout: REQUEST_TIMEOUT,
  errorHandler,
});

request.interceptors.request.use(
  (url, options) => {
    const config = { url, options };
    switch (options.proxy) {
      case ENUM_HTTP.PROXY.AUTH:
        config.url = API_PROXY_AUTH_URL + url;
        break;
      case ENUM_HTTP.PROXY.EXPLORER:
        config.url = API_PROXY_EXPLORER_URL + url;
        break;
      case ENUM_HTTP.PROXY.FAVORITE:
        config.url = API_PROXY_FAVORITE_URL + url;
        break;
      case ENUM_HTTP.PROXY.RECOVERY:
        config.url = API_PROXY_RECYCLE_URL + url;
        break;
      default:
        break;
    }
    return config;
  },
  {
    global: true,
  },
);

request.interceptors.response.use(
  async (res, req) => {
    try {
      const data = await res.clone().json();
      switch (data.code) {
        case ENUM_HTTP.HTTP_CODE.OK:
          req.message &&
            message.success(req.message === true ? "操作成功" : req.message);
          return Promise.resolve(data.content);
        case ENUM_HTTP.HTTP_CODE.UNAUTHORIZED:
          Cookies.remove(TOKEN_KEY);
          store.dispatch(ActionsUser.delUserInfo());
          message.warning(data?.message || "账户异常");
          setTimeout(() => window.location.reload(), 1500);
          return Promise.reject();
        default:
          message.error(data.message);
          return Promise.reject(data);
      }
    } catch (e) {
      const error = String(e);
      if (MSG_WHITELIST.includes(error)) return;
      message.error(error);
      return Promise.reject(e);
    }
  },
  {
    global: true,
  },
);

export default request;
