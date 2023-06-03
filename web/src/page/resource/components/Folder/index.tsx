import { Spin, Tree } from "antd";
import styles from "./index.module.sass";
import { useEffect, useState } from "react";
import { useStore, useToFolder } from "@/hooks";

import { CONFIG_ANTD_COMP_FIELD } from "@/config/antd";

import type { TypeResource } from "@/interface/resource";

/**
 * @name Folder 文件夹目录树
 */
const Folder: React.FC = () => {
  const toFolder = useToFolder();
  const resource = useStore("resource");

  const [expandedKeys, setExpandedKeys] = useState<
    Array<TypeResource.DTO["id"]>
  >([]);

  function onSelect([id]: React.Key[]) {
    toFolder(id as string);
  }

  useEffect(() => {
    setExpandedKeys((ids) => {
      const target = resource.path.at(-1);
      const index = ids.findIndex((v) => target === v);
      const newIds = Array.from(new Set([...ids, ...resource.path]));
      if (~index) return newIds.filter((v) => v !== target);
      else return newIds;
    });
  }, [resource.path]);

  return (
    <div className={styles.folder}>
      {null ? <Spin spinning={false} tip="正在加载文件夹目录" /> : null}
      {resource.folderTree.length ? (
        <Tree.DirectoryTree
          multiple
          blockNode
          onSelect={onSelect}
          expandedKeys={expandedKeys}
          fieldNames={CONFIG_ANTD_COMP_FIELD}
          treeData={resource.folderTree as []}
          selectedKeys={[resource.path.at(-1)!]}
        />
      ) : null}
    </div>
  );
};

export default Folder;
