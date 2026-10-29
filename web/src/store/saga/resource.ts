import { getFolders } from "@/api/resource";
import { fillFolderPaths, listToTree } from "@/utils/format";
import { ActionsResource } from "../resource";
import * as ActionsMiddleware from "./actions";
import { call, put, takeLatest } from "redux-saga/effects";

function* getGlobalFolders() {
  try {
    yield put(ActionsResource.setFolderLoading(true));
    const res: Awaited<ReturnType<typeof getFolders>> = yield call(getFolders);
    const { list, obj } = listToTree(res);
    fillFolderPaths(obj);
    yield put(
      ActionsResource.setFolder({
        folders: res,
        foldersObj: obj,
        folderTree: list,
      }),
    );
  } catch {
  } finally {
    yield put(ActionsResource.setFolderLoading(false));
  }
}

export default function* ResourceSagaRoot() {
  yield takeLatest(ActionsMiddleware.getFolders.type, getGlobalFolders);
}
