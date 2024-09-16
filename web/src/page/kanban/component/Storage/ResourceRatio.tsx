import { useCharts } from "@/hooks";
import Container from "../Container";
import styles from "./index.module.sass";
import { useRef, useEffect } from "react";

import { CONSTANT_RESOURCE } from "@/constant/resource";

import type { TypeDiskProps } from "./Disk";

interface TypeResourceRatioProps extends TypeDiskProps {}

/**
 * @name ResourceRatio 各类资源占比
 */
const ResourceRatio: React.FC<TypeResourceRatioProps> = ({ loading, data }) => {
  const count = useRef(0);
  const [ref, charts] = useCharts();

  useEffect(() => {
    charts.current?.setOption({
      title: {
        z: 0,
        text: 0,
        y: "42%",
        zlevel: 0,
        x: "center",
        subtext: "资源总数",
        subtextStyle: { color: "black", fontSize: 16 },
      },
      series: {
        type: "pie",
        width: "80%",
        padAngle: 1,
        radius: ["90%", "70%"],
        center: ["62.5%", "50%"],
        itemStyle: { borderRadius: 10 },
        label: {
          width: 170,
          height: 170,
          show: false,
          borderRadius: 70,
          position: "center",
          backgroundColor: "#fff",
        },
        emphasis: {
          scaleSize: 0,
          label: {
            show: true,
            fontSize: 18,
            fontWeight: "bold",
            formatter: (params: { name: string; value: number }) => {
              const size = (params.value / count.current) * 100;
              return `${params.name}：${Number(size.toFixed(2))}%`;
            },
          },
          
        },
      },
    });
  }, [charts]);

  useEffect(() => {
    if (!data?.storage) return;
    let text = 0;
    const list = CONSTANT_RESOURCE.TYPE.LIST.map((v) => {
      const value = Number(data.storage[v.id]) || 0;
      text += value;
      return { value, name: v.name, itemStyle: { color: v.color } };
    });
    count.current = text;
    charts.current?.setOption({ title: { text }, series: { data: list } });
  }, [data, charts]);

  return (
    <Container title="资源占比" loading={loading}>
      <div ref={ref} style={{ width: "100%", height: 300 }} />
      <ul className={styles.ratio}>
        {CONSTANT_RESOURCE.TYPE.LIST.map((v) => (
          <li key={v.id}>
            <i style={{ background: v.color }} />
            <span>{v.name}</span>
            <span>{data?.storage?.[v.id] || 0}</span>
          </li>
        ))}
      </ul>
    </Container>
  );
};

export default ResourceRatio;
