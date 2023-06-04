import { useRef } from "react";
import { useCallback, useEffect } from "react";

/**
 * @name useEventListener 监听自定义事件
 * @param type 自定义事件的name
 * @param callBack 监听回调
 * @description 支持事件自动卸载
 */
export default function useEventListener<T = undefined>(
  type: string,
  callBack: (e: CustomEvent<T>) => void,
) {
  const ref = useRef<typeof callBack>();

  ref.current = callBack;

  const bindCallBack = useCallback(
    (e: CustomEvent<T>) => {
      ref.current?.(e);
    },
    [ref],
  );

  useEffect(() => {
    document.addEventListener(type, bindCallBack as EventListener);
    return () => {
      document.removeEventListener(type, bindCallBack as EventListener);
    };
  }, [bindCallBack]);
}
