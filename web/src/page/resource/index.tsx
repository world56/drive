import { message } from "antd";
import { useRequest } from "ahooks";
import Edit from "./components/Edit";
import Move from "./components/Move";
import Files from "./components/Files";
import Folder from "./components/Folder";
import styles from "./index.module.sass";
import { useEffect, useState } from "react";
import Attributes from "./components/Attributes";
import { createUpload, downloadFile } from "@/utils/resource";
import { getResources, deleteResources } from "@/api/resource";
import { useStore, useActions, useToFolder, useEventListener } from "@/hooks";

import {
  ENUM_RESOURCE_MENU_TYPE,
  ENUM_CONTAINER_MENU_TYPE,
} from "./components/Files";
import { ENUM_COMMON } from "@/enum/common";

import type { TypeMoveProps } from "./components/Move";
import type { TypeFilesProps } from "./components/Files";
import type { TypeEditResourceProps } from "./components/Edit";
import type { TypeAttributesProps } from "./components/Attributes";

/**
 * @name Resource 资源管理页面
 */
const Resource = () => {
  const toFolder = useToFolder();

  const actions = useActions();
  const resource = useStore("resource");

  const [move, setMove] = useState<TypeMoveProps["ids"]>([]);
  const [detailsID, setDetailsID] = useState<TypeAttributesProps["id"]>();
  const [edit, setEdit] = useState<Omit<TypeEditResourceProps, "onClose">>({
    open: false,
  });

  const { data, loading, run } = useRequest(
    () => getResources({ id: resource.path?.at(-1) }),
    { refreshDeps: [resource.path] },
  );

  const onMenu: TypeFilesProps["onMenu"] = (type, id) => {
    switch (type) {
      case ENUM_CONTAINER_MENU_TYPE.MKDIR:
        return setEdit({ open: true, parentId: id });
      case ENUM_CONTAINER_MENU_TYPE.REFRESH:
        return run();
      case ENUM_CONTAINER_MENU_TYPE.UPLOAD_FILE:
        return createUpload();
      case ENUM_CONTAINER_MENU_TYPE.UPLOAD_FOLDER:
        return createUpload(true);
      default:
        return;
    }
  };

  const onItemMenu: TypeFilesProps["onItemMenu"] = async (type, id) => {
    switch (type) {
      case ENUM_RESOURCE_MENU_TYPE.OPEN:
        return resource.foldersObj[id] && toFolder(id);
      case ENUM_RESOURCE_MENU_TYPE.DELETE:
        await deleteResources({ ids: [id] });
        run();
        return message.success("删除成功");
      case ENUM_RESOURCE_MENU_TYPE.EDIT:
        return setEdit({ open: true, id });
      case ENUM_RESOURCE_MENU_TYPE.MOVE:
        return setMove([id]);
      case ENUM_RESOURCE_MENU_TYPE.DOWNLOAD:
        return downloadFile(id);
      case ENUM_RESOURCE_MENU_TYPE.ATTRIBUTES:
        return setDetailsID(id);
      default:
        return;
    }
  };

  function onCloseEdit() {
    run();
    actions.getFolders();
    setEdit({ open: false });
  }

  function onCloseMove() {
    run();
    actions.getFolders();
    setMove([]);
  }

  function onCloseDetails() {
    setDetailsID(undefined);
  }

  useEventListener(ENUM_COMMON.CUSTOM_EVENTS.REFRESH_RESOURCES, run);

  useEffect(() => {
    actions.getFolders();
  }, [actions]);

  return (
    <div className={styles.layout}>
      <Folder />
      <Files
        data={data}
        onMenu={onMenu}
        loading={loading}
        onItemMenu={onItemMenu}
      />
      <Attributes id={detailsID} onClose={onCloseDetails} />
      <Move ids={move} onClose={onCloseMove} />
      <Edit {...edit} onClose={onCloseEdit} />
    </div>
  );
};

export default Resource;
