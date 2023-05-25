import { useState } from "react";
import Edit from "./components/Edit";
import Files from "./components/Files";
import Folder from "./components/Folder";
import styles from "./index.module.sass";

import { ENUM_MENU_TYPE } from "./components/Files";

import type { TypeFilesProps } from "./components/Files";
import type { TypeEditResourceProps } from "./components/Edit";

/**
 * @name Resource 资源管理页面
 */
const Resource = () => {

  const [edit, setEdit] = useState<Omit<TypeEditResourceProps, "onClose">>({
    open: false,
  });

  const onMenu: TypeFilesProps["onMenu"] = (e) => {
    console.log(e);
    const { key } = e;
    switch (key) {
      case ENUM_MENU_TYPE.MKDIR:
        return setEdit({ open: true });
      case ENUM_MENU_TYPE.REFRESH:
        return;
      default:
        return;
    }
  };

  function onClose() {
    setEdit({ open: false });
  }

  return (
    <div className={styles.layout}>
      <Folder />
      <Files onMenu={onMenu} />
      <Edit {...edit} onClose={onClose} />
    </div>
  );
};

export default Resource;
