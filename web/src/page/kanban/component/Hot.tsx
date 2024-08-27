import "echarts-wordcloud";
import { useEffect } from "react";
import { useCharts } from "@/hooks";
import Container from "./Container";

function getRandom() {
  return Math.round(Math.random() * 160);
}

/**
 * @name Hot 热门查询
 */
const Hot = () => {
  const [ref, charts] = useCharts();

  useEffect(() => {
    charts.current?.setOption({
      series: [
        {
          type: "wordCloud",
          gridSize: 14,
          sizeRange: [16, 50],
          rotationRange: [0, 0],
          textStyle: {
            color: () => `rgb(${getRandom()},${getRandom()},${getRandom()})`,
          },
          width: "100%",
          height: "100%",
          data: [
            { name: "随便的视频随", value: 5 },
            { name: "文档", value: 2 },
            { name: "flac", value: 3 },
            { name: "一份文档", value: 8 },
            { name: "超级文件", value: 6 },
          ],
        },
      ],
    });
  }, [charts]);

  return (
    <Container title="热门搜索" width={328} height={300} margin='0 10px 0 0'>
      <div ref={ref} style={{ width: "100%", height: 270 }} />
    </Container>
  );
};

export default Hot;
