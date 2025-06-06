import { Spin, Tree } from "antd";
import styles from "./index.module.sass";
import { useSearchParams } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { useStore, useToFolder, useActions } from "@/hooks";

import { FOLDER_WIDTH_KEY } from "@/config/system";
import { CONFIG_ANTD_COMP_FIELD } from "@/config/antd";

import type { TypeResource } from "@/interface/resource";

/**
 * @name Folder 文件夹目录树
 */
const Folder: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null!);

  const toFolder = useToFolder();
  const [, setSearchParams] = useSearchParams();

  const actions = useActions();
  const resource = useStore("resource");
  const { FOLDER_TREE_WIDTH } = useStore("config");

  const [expandedKeys, setExpandedKeys] = useState<
    Array<TypeResource.DTO["id"]>
  >([]);

  function onSelect([id]: React.Key[]) {
    toFolder(id as string);
  }

  function onDrag(e: MouseEvent) {
    if (e.clientX > 300 && e.clientX < 700) {
      const width = e.clientX - 80;
      actions.setConfig({ FOLDER_TREE_WIDTH: width });
      sessionStorage.setItem(FOLDER_WIDTH_KEY, width.toString());
    }
  }

  function onMouseDown() {
    document.onmousemove = onDrag;
    document.onmouseup = onMouseUp;
  }

  function onMouseUp() {
    document.onmouseup = null;
    document.onmousemove = null;
  }

  useEffect(() => {
    setExpandedKeys((ids) => {
      const target = resource.path.at(-1);
      const index = ids.findIndex((v) => target === v);
      const newIds = Array.from(new Set([...ids, ...resource.path]));
      return ~index ? newIds.filter((v) => v !== target) : newIds;
    });
  }, [resource.path]);

  useEffect(() => {
    const path = resource.path.join("/");
    setSearchParams(path ? { path } : {}, { replace: true });
  }, [resource.path]);

  return (
    <div style={{ minWidth: FOLDER_TREE_WIDTH }} className={styles.folder}>
      <div className={styles.darg} ref={ref} onMouseDown={onMouseDown} />
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
