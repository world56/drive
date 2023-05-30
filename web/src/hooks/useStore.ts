import store from "@/store";
import { useSelector, shallowEqual } from "react-redux";

type TypeRootStore = ReturnType<typeof store.getState>;

export default function useStore<T extends keyof TypeRootStore>(key: T) {
  return useSelector((state: TypeRootStore) => state[key], shallowEqual);
}
