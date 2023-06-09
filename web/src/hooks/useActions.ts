import store from "@/store";
import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { ActionsUser } from "@/store/user";
import * as ActionsSagas from "@/store/saga/actions";

const ACTIONS = {
  ...ActionsUser,
  ...ActionsSagas,
};

export default function useActions() {
  const dispatch = useDispatch<typeof store.dispatch>();
  return useMemo(() => bindActionCreators(ACTIONS, dispatch), [dispatch]);
}
