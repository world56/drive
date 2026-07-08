import { message } from "antd";
import { encryption } from "@/utils";
import { ActionsUser } from "../user";
import * as ActionsMiddleware from "./actions";
import { login, getUserInfo } from "@/api/auth";
import { put, call, throttle, takeLatest } from "redux-saga/effects";

import { SAGA_DEBOUNCE } from "@/config/request";

import type { TypeUser } from "@/interface/user";

function* taskInUserLogin(
  data: ReturnType<typeof ActionsMiddleware.login>,
) {
  try {
    const param: string = yield encryption(data.payload);
    yield call(login, param);
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
    yield put(ActionsUser.delUserInfo());
    // setTimeout(() => {
    //   window.location.href = "/login";
    // }, 1500);
  }
}

export default function* SagaUser() {
  yield takeLatest(ActionsMiddleware.login.type, taskInUserLogin);
  yield throttle(
    SAGA_DEBOUNCE,
    ActionsMiddleware.getUserInfo.type,
    taskInGetUserInfo,
  );
}
