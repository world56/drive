import Item from "./Item";
import Input from "./Input";
import { Empty } from "antd";
import { useState } from "react";
import { useRequest } from "ahooks";
import Container from "./Container";
import styles from "./index.module.sass";
import { FixedSizeList } from "react-window";
import { getGlobalResources } from "@/api/resource";

import { ENUM_COMMON } from "@/enum/common";

import type { TypeInputProps } from "./Input";

const IMAGE = Empty.PRESENTED_IMAGE_SIMPLE;

/**
 * @name Search 资源查询
 */
const Search = () => {
  const [search, setSearch] = useState<TypeInputProps["value"]>({
    name: "",
    type: [],
    sort: ENUM_COMMON.SORT.ASC,
  });

  const { data, loading } = useRequest(() => getGlobalResources(search), {
    refreshDeps: [search],
    debounceWait: 200,
  });

  function onSelect() {
    console.log("@-onSelect");
  }

  function onChange(e: TypeInputProps["value"]) {
    setSearch(e);
  }

  const desc = search.name
    ? data?.length
      ? ""
      : "没有找到相关资源"
    : "请输入关键字进行查询";

  return (
    <Container loading={loading} onSelect={onSelect}>
      <Input value={search} onChange={onChange} />
      {desc ? (
        <Empty image={IMAGE} description={desc} />
      ) : (
        <FixedSizeList
          width={773}
          height={600}
          itemSize={60}
          children={Item}
          itemData={data}
          className={styles.ctx}
          itemCount={data?.length || 0}
        />
      )}
    </Container>
  );
};

export default Search;
