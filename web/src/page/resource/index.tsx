import { useState } from "react";
import { useRequest } from "ahooks";
import Edit from "./components/Edit";
import Files from "./components/Files";
import Folder from "./components/Folder";
import styles from "./index.module.sass";
import { listToTree } from "@/utils/format";
import { getFolders, getResources } from "@/api/resource";

import { ENUM_MENU_TYPE } from "./components/Files";

import type { TypeFilesProps } from "./components/Files";
import type { TypeEditResourceProps } from "./components/Edit";

/**
 * @name Resource 资源管理页面
 */
const Resource = () => {
  const files = useRequest(() => getResources({}));
  const folders = useRequest(getFolders, {
    onSuccess: (res) => listToTree(res).list,
  });

  const [edit, setEdit] = useState<Omit<TypeEditResourceProps, "onClose">>({
    open: false,
  });

  const onMenu: TypeFilesProps["onMenu"] = (e) => {
    const { key } = e;
    switch (key) {
      case ENUM_MENU_TYPE.MKDIR:
        return setEdit({ open: true });
      case ENUM_MENU_TYPE.REFRESH:
        return files.run();
      default:
        return;
    }
  };

  function onClose() {
    setEdit({ open: false });
    files.run();
  }

  return (
    <div className={styles.layout}>
      <Folder data={folders.data} loading={folders.loading} />
      <Files onMenu={onMenu} list={files.data} loading={files.loading} />
      <Edit {...edit} onClose={onClose} />
    </div>
  );
};

export default Resource;
