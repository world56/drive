import { filesize } from "filesize";
import { useCharts } from "@/hooks";
import Container from "../Container";
import styles from "./index.module.sass";
import { useMemo, useEffect } from "react";

import type { getStorageInfo } from "@/api/stats";

export interface TypeDiskProps {
  loading: boolean;
  data?: Awaited<ReturnType<typeof getStorageInfo>>;
}

/**
 * @name Disk 存储占比
 */
const Disk: React.FC<TypeDiskProps> = ({ data, loading }) => {
  const [ref, charts] = useCharts();

  const format = useMemo(
    () =>
      data ? { used: filesize(data.used), free: filesize(data.free) } : {},
    [data],
  );

  useEffect(() => {
    if (!data) return;
    const { total, free, used } = data;
    charts.current?.setOption({
      title: { text: filesize(total) },
      series: {
        data: [
          { name: "已使用", value: used, itemStyle: { color: "#1890FF" } },
          { name: "剩余可用", value: free, itemStyle: { color: "#E8EDF1" } },
        ],
      },
    });
  }, [data]);

  useEffect(() => {
    charts.current?.setOption({
      tooltip: {
        formatter: ({ name, value }: { name: string; value: number }) =>
          `${name}: ${filesize(value)}`,
      },
      title: {
        y: "75px",
        x: "center",
        padding: [25, 35],
        subtext: "磁盘总空间",
        subtextStyle: { color: "black", fontSize: 15 },
      },
      emphasis: { disabled: true },
      series: {
        type: "pie",
        endAngle: 360,
        startAngle: 180,
        label: { show: false },
        center: ["50%", "63%"],
        radius: ["100%", "70%"],
      },
    });
  }, [charts]);

  return (
    <Container height={280} title="存储空间" loading={loading}>
      <div ref={ref} style={{ width: "100%", height: 230 }} />
      <div className={styles.storage}>
        <div>
          <p>{format?.used}</p>
          <p>已使用</p>
        </div>
        <div className={styles.solid} />
        <div>
          <p>{format?.free}</p>
          <p>剩余可用</p>
        </div>
      </div>
    </Container>
  );
};

export default Disk;
