import * as ECharts from "echarts";
import { useEffect, useRef } from "react";

type TypeUseChartsReturns = [
  React.MutableRefObject<HTMLDivElement>,
  React.MutableRefObject<ReturnType<typeof ECharts.init> | null>,
];

/**
 * @name useCharts 基于 “echarts”
 * @see https://echarts.apache.org
 */
export default function useCharts(): TypeUseChartsReturns {
  const ref = useRef<HTMLDivElement>(null!);

  const charts = useRef<ReturnType<typeof ECharts.init> | null>(null!);

  useEffect(() => {
    if (ref?.current) {
      charts.current = ECharts.init(ref.current);
    }
    return () => {
      charts.current?.dispose();
      charts.current = null;
    };
  }, [ref]);

  return [ref, charts];
}
