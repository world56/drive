import store from "@/store";
import { useSelector, shallowEqual } from "react-redux";

export default function useStore() {
  return useSelector(
    (state: ReturnType<typeof store.getState>) => state,
    shallowEqual,
  );
};
