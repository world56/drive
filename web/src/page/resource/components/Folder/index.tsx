import { Spin, Tree } from "antd";
import styles from "./index.module.sass";
import { useActions, useStore } from "@/hooks";
import { useSearchParams } from "react-router-dom";

import { CONFIG_ANTD_COMP_FIELD } from "@/config/antd";

/**
 * @name Folder 文件夹目录树
 */
const Folder: React.FC = () => {
  const actions = useActions();
  const { resource } = useStore();

  const [, setSearch] = useSearchParams();

  function onSelect(ids: React.Key[]) {
    const [id] = ids;
    const path = getPath(id as string);
    actions.setPath(path);
    setSearch({ path }, { replace: true });
  }

  function getPath(id: string) {
    const ids: string[] = [id];
    while (true) {
      const target = resource.foldersObj[id];
      if (target.parentId) {
        id = target.parentId;
        ids.unshift(target.parentId);
      } else {
        return ids;
      }
    }
  }

  return (
    <div className={styles.folder}>
      {null ? <Spin spinning={false} tip="正在加载文件夹目录" /> : null}
      {resource.folderTree.length ? (
        <Tree.DirectoryTree
          multiple
          blockNode
          onSelect={onSelect}
          defaultExpandedKeys={resource.path}
          fieldNames={CONFIG_ANTD_COMP_FIELD}
          treeData={resource.folderTree as []}
          defaultSelectedKeys={[resource.path.at(-1)!]}
        />
      ) : null}
    </div>
  );
};

export default Folder;
