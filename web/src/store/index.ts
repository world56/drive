import middleware from "./saga";
import userReducer from "./user";
import configReducer from "./config";
import resourceReducer from "./resource";
import createSagaMiddleware from "redux-saga";
import { configureStore, Tuple } from "@reduxjs/toolkit";

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    user: userReducer,
    config: configReducer,
    resource: resourceReducer,
  },
  middleware: () => new Tuple(sagaMiddleware),
});

sagaMiddleware.run(middleware);

export default store;
