import store from "@/store";
import { message } from "antd";
import Cookies from "js-cookie";
import { extend } from "umi-request";
import { ActionsUser } from "@/store/user";

import { ENUM_HTTP } from "@/enum/http";
import {
  TOKEN_KEY,
  REQUEST_TIMEOUT,
  API_PROXY_AUTH_URL,
  API_PROXY_EXPLORER_URL,
} from "@/config/request";

import type { ResponseError } from "umi-request";

export interface ServiceResponse<T> {
  content: T;
  readonly message?: string;
  readonly code: ENUM_HTTP.HTTP_CODE;
}

async function errorHandler(res: ResponseError) {
  return Promise.reject(res.response);
}

const request = extend({
  timeout: REQUEST_TIMEOUT,
  errorHandler,
});

request.interceptors.request.use(
  (url, options) => {
    const Authorization = Cookies.get(TOKEN_KEY);
    const config = {
      url,
      options: {
        ...options,
        headers: Authorization ? { Authorization } : undefined,
      },
    };
    switch (options.proxy) {
      case ENUM_HTTP.PROXY.AUTH:
        config.url = API_PROXY_AUTH_URL + url;
        config.url = `http://127.0.0.1:2000${config.url}`
        break;
      case ENUM_HTTP.PROXY.EXPLORER:
        config.url = API_PROXY_EXPLORER_URL + url;
        config.url = `http://127.0.0.1:2000${config.url}`
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
  async (res) => {
    try {
      const data = await res.clone().json();
      switch (data.code) {
        case ENUM_HTTP.HTTP_CODE.OK:
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
      if (e === "DOMException: The user aborted a request.") return;
      console.log(e);
      message.error(String(e));
      return Promise.reject(e);
    }
  },
  {
    global: true,
  },
);

export default request;
