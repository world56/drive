import Disk from "./Disk";
import { useRequest } from "ahooks";
import styles from "./index.module.sass";
import ResourceRatio from "./ResourceRatio";
import { getStorageInfo } from "@/api/stats";

/**
 * @name Storage 存储空间
 */
const Storage = () => {
  const { loading, data } = useRequest(getStorageInfo);

  return (
    <div className={styles.system}>
      <Disk loading={loading} data={data} />
      <ResourceRatio loading={loading} data={data}  />
    </div>
  );
};

export default Storage;
