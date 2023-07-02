import { isEmpty } from "@/utils";
import { useState, useEffect, useCallback } from "react";

import type { DependencyList } from 'react';

type TypeAsyncFn<T = unknown> = (...rgas: unknown[]) => Promise<T>;

interface TypeuseReqDetailsData<T extends TypeAsyncFn> {
  loading: boolean;
  value?: Awaited<ReturnType<T>> | undefined;
};

/**
 * @name useReqDetails 通过主键获取详情
 * @param fn 异步回调
 * @param dep 依赖，第一个参数一般是ID
 */
export default function useReqDetails<T extends TypeAsyncFn<any>>(fn: T, dep: DependencyList = []) {

  const [state, setState] = useState<TypeuseReqDetailsData<T>>({ loading: false });

  const initialize = useCallback(async () => {
    const [bol] = dep;
    if (!isEmpty(bol)) {
      try {
        setState({ loading: true });
        const value = await fn();
        setState({ loading: false, value });
      } catch {
        setState({ loading: false, value: undefined });
      }
    }
    // eslint-disable-next-line
  }, dep);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return {
    ...state,
    run: initialize
  };
};
