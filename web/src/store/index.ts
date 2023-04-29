import middleware from './saga';
import userReducer from "./user";
import createSagaMiddleware from "redux-saga";
import { configureStore, MiddlewareArray } from "@reduxjs/toolkit";

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    user: userReducer,
  },
  middleware: new MiddlewareArray().concat(sagaMiddleware),
});

sagaMiddleware.run(middleware);

export default store;
