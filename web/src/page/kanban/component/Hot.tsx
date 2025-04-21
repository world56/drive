import "echarts-wordcloud";
import { useEffect } from "react";
import { useCharts } from "@/hooks";
import Container from "./Container";
import { useRequest } from "ahooks";
import { getHotSearch } from "@/api/stats";

function getRandom() {
  return Math.round(Math.random() * 160);
}

/**
 * @name Hot 热门查询
 */
const Hot = () => {
  const [ref, charts] = useCharts();

  const { loading } = useRequest(async () => {
    const res = await getHotSearch();
    const data = res.map((v) => {
      return {
        name: v.name.length > 10 ? `${v.name.slice(0, 9)}...` : v.name,
        value: v.value,
        fullName: v.name,
      };
    });
    charts?.current?.setOption({ series: { data } });
  });

  useEffect(() => {
    charts.current?.setOption({
      series: {
        type: "wordCloud",
        gridSize: 20,
        sizeRange: [10, 40],
        rotationRange: [0, 0],
        data: [],
        width: "100%",
        height: "100%",
        textStyle: {
          color: () => `rgb(${getRandom()},${getRandom()},${getRandom()})`,
        },
      },
    });
  }, [charts]);

  return (
    <Container
      width={328}
      height={300}
      title="热门搜索"
      loading={loading}
      margin="0 10px 0 0"
    >
      <div ref={ref} style={{ width: "100%", height: 270 }} />
    </Container>
  );
};

export default Hot;
