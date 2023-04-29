import { all, fork } from "redux-saga/effects";

const FORK_ROOT: [] = [];

function* SagaMiddleware() {
  yield all(FORK_ROOT.map(fork));
}

export default SagaMiddleware;
