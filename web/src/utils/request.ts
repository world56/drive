import store from "@/store";
import { message } from "antd";
import Cookies from "js-cookie";
import { extend } from "umi-request";
import { ActionsUser } from "@/store/user";

import { ENUM_HTTP } from "@/enum/http";
import { TOKEN_KEY } from "@/config/user";
import { REQUEST_TIMEOUT, API_PROXY_PASS_URL } from "@/config/request";

import type { ResponseError } from "umi-request";
import type { HttpRequestHeader } from "antd/es/upload/interface";

export interface ServiceResponse<T> {
  content: T;
  readonly message?: string;
  readonly code: ENUM_HTTP.HTTP_CODE;
}

async function errorHandler(res: ResponseError) {
  return Promise.reject(res.response);
}

const request = extend({
  prefix: API_PROXY_PASS_URL,
  timeout: REQUEST_TIMEOUT,
  errorHandler,
});

request.interceptors.request.use(
  (url, options) => {
    const token = Cookies.get(TOKEN_KEY);
    const headers: HttpRequestHeader = {};
    if (token) {
      headers.Authorization = token;
    }
    return { url, options: { ...options, headers } };
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
      message.error(String(e));
      return Promise.reject(e);
    }
  },
  {
    global: true,
  },
);

export default request;
