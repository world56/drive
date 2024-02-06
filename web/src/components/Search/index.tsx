import Item from "./Item";
import Input from "./Input";
import { useRequest } from "ahooks";
import Container from "./Container";
import styles from "./index.module.sass";
import { FixedSizeList } from "react-window";
import { getGlobalResources } from "@/api/resource";

/**
 * @name Search 资源查询
 */
const Search = () => {
  const { data } = useRequest(getGlobalResources, {});

  function onSelect() {
    console.log("@-onSelect");
  }

  return (
    <Container onSelect={onSelect}>
      <Input />
      <FixedSizeList
        width={773}
        height={600}
        itemSize={60}
        children={Item}
        itemData={data}
        className={styles.ctx}
        itemCount={data?.length || 0}
      />
    </Container>
  );
};

export default Search;
