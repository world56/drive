import { useEffect } from "react";
import Container from "./Container";
import { useCharts } from "@/hooks";

function getRecentDate() {
  const today = new Date();
  const timestamps: string[] = [];
  for (let i = 13; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    timestamps.push(`${date.getMonth() + 1}/${date.getDate()}`);
  }
  return timestamps;
}

/**
 * @name Trend 访问趋势
 */
const Trend = () => {
  const [ref, charts] = useCharts();

  useEffect(() => {
    charts.current?.setOption({
      grid: {
        top: "10%",
        left: "2%%",
        right: "2%",
        bottom: "5%",
        containLabel: true,
      },
      xAxis: { type: "category", data: getRecentDate() },
      yAxis: { type: "value" },
      series: [
        {
          type: "bar",
          data: [120, 200, 150, 80, 70, 0, 10, 130, 120, 30, 150, 80, 70, 10],
        },
      ],
    });
  }, []);

  return (
    <Container title="访问趋势" height={280}>
      <div ref={ref} style={{ width: "100%", height: 250 }} />
    </Container>
  );
};

export default Trend;
