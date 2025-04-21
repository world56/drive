import { useEffect } from "react";
import Container from "./Container";
import { useRequest } from "ahooks";
import { getAccessTrend } from "@/api/stats";
import { useCharts, useWindowSize } from "@/hooks";

/**
 * @name Trend 访问趋势
 */
const Trend = () => {
  const [ref, charts] = useCharts();

  const { loading } = useRequest(async () => {
    const res = await getAccessTrend();
    let date: string[] = [];
    let data: number[] = [];
    res.reverse().forEach((v) => {
      date.push(v.date);
      data.push(v.value);
    });
    charts.current?.setOption({ series: { data }, xAxis: { data: date } });
  });

  useEffect(() => {
    charts.current?.setOption({
      grid: {
        top: "10%",
        left: "2%%",
        right: "2%",
        bottom: "5%",
        containLabel: true,
      },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        formatter(param: { name: string; value: number }[]) {
          return `访问数：${param[0].value}`;
        },
      },
      xAxis: { type: "category", data: [] },
      yAxis: { type: "value", minInterval: 1 },
      series: { type: "bar", itemStyle: { color: "#1890FF" }, data: [] },
    });
  }, []);

  useWindowSize(() => {
    charts.current?.resize();
  });

  return (
    <Container title="访问趋势" height={280} loading={loading}>
      <div ref={ref} style={{ width: "100%", height: 250 }} />
    </Container>
  );
};

export default Trend;
