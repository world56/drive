import { getSecretKey } from "@/api/auth";
import { ActionsConfig } from "../config";
import * as ActionsMiddleware from "./actions";
import { call, put, takeLatest } from "redux-saga/effects";

function* getEncryptionKey() {
  try {
    const PUBLIC_KEY: Awaited<ReturnType<typeof getSecretKey>> = yield call(
      getSecretKey,
    );
    yield put(ActionsConfig.setConfig({ KEY: PUBLIC_KEY }));
  } catch {}
}

export default function* SagaConfig() {
  yield takeLatest(ActionsMiddleware.getKey.type, getEncryptionKey);
}
