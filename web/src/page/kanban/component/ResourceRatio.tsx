import { useEffect } from "react";
import { useCharts } from "@/hooks";
import Container from "./Container";
import styles from "./index.module.sass";

import { CONSTANT_RESOURCE } from "@/constant/resource";

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * @name ResourceRatio 各类资源占比
 */
const ResourceRatio = () => {
  const [ref, charts] = useCharts();

  useEffect(() => {
    charts.current?.setOption({
      tooltip: { show: false, trigger: "item" },
      legend: { show: false, left: "center" },
      title: {
        text: "3290",
        subtext: "资源总数",
        x: "center",
        y: "42%",
        z: 0,
        zlevel: 0,
        subtextStyle: { color: "black", fontSize: 16 },
      },
      series: [
        {
          type: "pie",
          width: "80%",
          padAngle: 1,
          radius: ["90%", "70%"],
          center: ["62.5%", "50%"],
          avoidLabelOverlap: false,
          itemStyle: { borderRadius: 10 },
          label: {
            show: false,
            position: "center",
            backgroundColor: "#fff",
            width: 125,
            height: 125,
            formatter: (params: Record<"name" | "value", string>) =>
              `${params.name} : ${20}%`,
          },
          labelLine: { show: false },
          emphasis: {
            scaleSize: 0,
            label: { show: true, fontSize: 18, fontWeight: "bold" },
          },
          data: CONSTANT_RESOURCE.TYPE.LIST.map((v) => ({
            name: v.name,
            value: getRandomInt(1, 10000),
            itemStyle: { color: v.color },
          })),
        },
      ],
    });
  }, [charts]);

  return (
    <Container width="100%" title="资源占比">
      <div ref={ref} style={{ width: "100%", height: 300 }} />
      <ul className={styles.ratio}>
        {CONSTANT_RESOURCE.TYPE.LIST.map((v) => (
          <li key={v.id}>
            <i style={{ background: v.color }} />
            <span>{v.name}</span>
            <span>{getRandomInt(1, 10000)}</span>
          </li>
        ))}
      </ul>
    </Container>
  );
};

export default ResourceRatio;
