import { useEffect } from "react";
import { useCharts } from "@/hooks";
import Container from "./Container";

/**
 * @name Visit 周访问量统计
 */
const Visit = () => {
  const [ref, charts] = useCharts();

  useEffect(() => {
    charts.current?.setOption({
      legend: { show: false },
      tooltip: { trigger: "item" },
      radar: {
        indicator: [
          { name: "周一", min: 0 },
          { name: "周二", min: 0 },
          { name: "周三", min: 0 },
          { name: "周四", min: 0 },
          { name: "周五", min: 0 },
          { name: "周六", min: 0 },
          { name: "周天", min: 0 },
        ],
      },
      series: [
        {
          type: "radar",
          data: [
            {
              value: [0, 2, 3, 4, 5, 6, 10],
              lineStyle: { color: "#1890FF", width: 2 },
              areaStyle: { color: "rgba(24,144,255, 0.5)" },
            },
          ],
        },
      ],
    });
  }, [charts]);

  return (
    <Container title="周访问量" width="100%">
      <div ref={ref} style={{ width: "100%", height: 300 }} />
    </Container>
  );
};

export default Visit;
