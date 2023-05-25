import { message } from "antd";
import Cookies from "js-cookie";
import { encryption } from "@/utils";
import { ActionsUser } from "../user";
import { TOKEN_KEY } from "@/config/request";
import * as ActionsMiddleware from "./actions";
import { login, getUserInfo } from "@/api/auth";
import { put, call, throttle, takeLatest } from "redux-saga/effects";

import { SAGA_DEBOUNCE } from "@/config/request";

import type { TypeUser } from "@/interface/user";

function* taskInUserLogin(
  data: ReturnType<typeof ActionsMiddleware.userLogin>,
) {
  try {
    const param: string = yield encryption(data.payload);
    const token: string = yield call(login, param);
    Cookies.set(TOKEN_KEY, token, { sameSite: "strict" });
    yield put(ActionsMiddleware.getUserInfo());
  } catch {}
}

function* taskInGetUserInfo() {
  try {
    const user: TypeUser.DTO = yield getUserInfo();
    yield put(ActionsUser.setUserInfo(user));
    document.title = "DriveCloud";
  } catch {
    message.error("获取用户信息失败");
    Cookies.remove(TOKEN_KEY);
    yield put(ActionsUser.delUserInfo());
    setTimeout(() => {
      window.location.href = "/login";
    }, 1500);
  }
}

export default function* SagaUser() {
  yield takeLatest(ActionsMiddleware.userLogin.type, taskInUserLogin);
  yield throttle(
    SAGA_DEBOUNCE,
    ActionsMiddleware.getUserInfo.type,
    taskInGetUserInfo,
  );
}
