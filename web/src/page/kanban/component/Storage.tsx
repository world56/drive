import { useEffect } from "react";
import { useCharts } from "@/hooks";
import Container from "./Container";
import styles from "./index.module.sass";

/**
 * @name Storage 存储占比
 */
const Storage = () => {
  const [ref, charts] = useCharts();

  useEffect(() => {
    charts.current?.setOption({
      tooltip: {
        trigger: "item",
        formatter: (params: Record<"name" | "value", string>) =>
          `${params.name}:  ${params.value} GB`,
      },
      title: {
        text: "80GB",
        subtext: "磁盘总空间",
        x: "center",
        y: "75px",
        padding: [25, 35],
        subtextStyle: { color: "black", fontSize: 15 },
      },
      emphasis: { disabled: true },
      series: [
        {
          type: "pie",
          padAngle: 1,
          label: { show: false },
          center: ["50%", "63%"],
          radius: ["100%", "70%"],
          endAngle: 360,
          startAngle: 180,
          data: [
            { value: 2, name: "已使用", itemStyle: { color: "#1890FF" } },
            { value: 10, name: "剩余可用", itemStyle: { color: "#E8EDF1" } },
          ],
        },
      ],
    });
  }, [charts]);

  return (
    <Container height={280} title="存储空间">
      <div ref={ref} style={{ width: "100%", height: 230 }} />
      <div className={styles.storage}>
        <div>
          <p>238GB</p>
          <p>已使用</p>
        </div>
        <div className={styles.solid} />
        <div>
          <p>18GB</p>
          <p>剩余可用</p>
        </div>
      </div>
    </Container>
  );
};

export default Storage;
