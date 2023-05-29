import UserSaga from "./user";
import ResourceSaga from "./resource";
import { all, fork } from "redux-saga/effects";

const FORK_ROOT = [UserSaga, ResourceSaga];

function* SagaMiddleware() {
  yield all(FORK_ROOT.map(fork));
}

export default SagaMiddleware;
