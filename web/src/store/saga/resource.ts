import { getFolders } from "@/api/resource";
import { listToTree } from "@/utils/format";
import { ActionsResource } from "../resource";
import * as ActionsMiddleware from "./actions";
import { call, put, takeLatest } from "redux-saga/effects";

function* getGlobalFolders() {
  try {
    const res: Awaited<ReturnType<typeof getFolders>> = yield call(getFolders);
    const { list, obj } = listToTree(res);
    yield put(
      ActionsResource.setFolder({
        folders: res,
        foldersObj: obj,
        folderTree: list,
      }),
    );
  } catch {}
}

export default function* ResourceSagaRoot() {
  yield takeLatest(ActionsMiddleware.getFolders.type, getGlobalFolders);
}
