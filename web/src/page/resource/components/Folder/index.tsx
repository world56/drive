import { Spin, Tree } from "antd";
import styles from "./index.module.sass";
import { listToTree } from "@/utils/format";

import { CONFIG_ANTD_COMP_FIELD } from "@/config/antd";

import type { SpinProps } from "antd";
import type { TypeResource } from "@/interface/resource";

interface TypeFolderProps {
  loading: SpinProps["spinning"];
  data?: ReturnType<typeof listToTree<TypeResource.DTO>>["list"];
}

const Folder: React.FC<TypeFolderProps> = ({ data, loading }) => {
  return (
    <div className={styles.folder}>
      <Spin spinning={loading} tip="正在加载文件夹目录">
        <Tree.DirectoryTree
          multiple
          blockNode
          treeData={data as []}
          fieldNames={CONFIG_ANTD_COMP_FIELD}
        />
      </Spin>
    </div>
  );
};

export default Folder;
