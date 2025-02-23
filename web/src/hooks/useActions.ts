import store from "@/store";
import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { ActionsUser } from "@/store/user";
import { ActionsConfig } from "@/store/config";
import { ActionsPreview } from "@/store/preview";
import { ActionsResource } from "@/store/resource";
import * as ActionsSagas from "@/store/saga/actions";

const ACTIONS = {
  ...ActionsUser,
  ...ActionsSagas,
  ...ActionsConfig,
  ...ActionsPreview,
  ...ActionsResource,
};

/**
 * @name useActions Redux发起一个Action
 * @description 统一处理了，省的麻烦
 */
export default function useActions() {
  const dispatch = useDispatch<typeof store.dispatch>();
  return useMemo(() => bindActionCreators(ACTIONS, dispatch), [dispatch]);
}
