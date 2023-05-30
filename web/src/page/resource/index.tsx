import { useRequest } from "ahooks";
import Edit from "./components/Edit";
import Files from "./components/Files";
import Folder from "./components/Folder";
import styles from "./index.module.sass";
import { useEffect, useState } from "react";
import { getResources } from "@/api/resource";
import { useStore, useActions } from "@/hooks";

import { ENUM_MENU_TYPE } from "./components/Files";

import type { TypeFilesProps } from "./components/Files";
import type { TypeEditResourceProps } from "./components/Edit";

/**
 * @name Resource 资源管理页面
 */
const Resource = () => {
  const actions = useActions();
  const resource = useStore('resource');

  const [edit, setEdit] = useState<Omit<TypeEditResourceProps, "onClose">>({
    open: false,
  });

  // 资源列表
  const { data, loading, run } = useRequest(
    () => getResources({ id: resource.path?.at(-1) }),
    { refreshDeps: [resource.path] },
  );

  const onMenu: TypeFilesProps["onMenu"] = (e) => {
    const { key } = e;
    switch (key) {
      case ENUM_MENU_TYPE.MKDIR:
        const parentId = resource.path?.at(-1);
        return setEdit({ open: true, parentId });
      case ENUM_MENU_TYPE.REFRESH:
        return run();
      default:
        return;
    }
  };

  function onClose() {
    setEdit({ open: false });
    run();
  }

  useEffect(() => {
    actions.getFolders();
  }, [actions]);

  return (
    <div className={styles.layout}>
      <Folder />
      <Files onMenu={onMenu} list={data} loading={loading} />
      <Edit {...edit} onClose={onClose} />
    </div>
  );
};

export default Resource;
