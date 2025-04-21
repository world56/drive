import store from "@/store";
import { useSelector, shallowEqual } from "react-redux";

type TypeRootStore = ReturnType<typeof store.getState>;

/**
 * @name useStore Redux状态机
 * @param key redux里面对应的键，取对应的值
 * @description 加了个shallowEqual，免得每次加麻烦
 */
export default function useStore<T extends keyof TypeRootStore>(key: T) {
  return useSelector((state: TypeRootStore) => state[key], shallowEqual);
}
