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

import { ENUM_COMMON } from "@/enum/common";
import { ENUM_RESOURCE } from "@/enum/resource";

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
    () => getResources({ id: resource.path?.at(-1), ...resource.sort }),
    { refreshDeps: [resource.path, resource.sort] },
  );

  const onMenu: TypeFilesProps["onMenu"] = (param, id) => {
    switch (param) {
      case ENUM_RESOURCE.MENU_CONTAINER.MKDIR:
        return setEdit({ open: true, parentId: id });
      case ENUM_RESOURCE.MENU_CONTAINER.REFRESH:
        return run();
      case ENUM_RESOURCE.MENU_CONTAINER.UPLOAD_FILE:
        return createUpload();
      case ENUM_RESOURCE.MENU_CONTAINER.UPLOAD_FOLDER:
        return createUpload(true);
      case ENUM_RESOURCE.MENU_CONTAINER.SORT_NAME:
      case ENUM_RESOURCE.MENU_CONTAINER.SORT_SIZE:
      case ENUM_RESOURCE.MENU_CONTAINER.SORT_TYPE:
      case ENUM_RESOURCE.MENU_CONTAINER.SORT_SUFFIX:
      case ENUM_RESOURCE.MENU_CONTAINER.SORT_CREATOR_ID:
      case ENUM_RESOURCE.MENU_CONTAINER.SORT_CREATE_TIME:
        return actions.setSort({ ...resource.sort, type: param });
      case ENUM_RESOURCE.MENU_CONTAINER.SORT_ASC:
      case ENUM_RESOURCE.MENU_CONTAINER.SORT_DESC:
        return actions.setSort({ ...resource.sort, order: param });
      default:
        return;
    }
  };

  const onItemMenu: TypeFilesProps["onItemMenu"] = async (type, param) => {
    switch (type) {
      case ENUM_RESOURCE.MENU_RESOURCE.OPEN:
        return resource.foldersObj[param.id] && toFolder(param.id);
      case ENUM_RESOURCE.MENU_RESOURCE.COPY_NAME:
        await navigator.clipboard.writeText(param.fullName);
        return message.success("复制成功");
      case ENUM_RESOURCE.MENU_RESOURCE.DELETE:
        await deleteResources({ ids: [param.id] });
        run();
        return message.success("删除成功");
      case ENUM_RESOURCE.MENU_RESOURCE.EDIT:
        return setEdit({ open: true, id: param.id });
      case ENUM_RESOURCE.MENU_RESOURCE.MOVE:
        return setMove([param.id]);
      case ENUM_RESOURCE.MENU_RESOURCE.DOWNLOAD:
        return downloadFile(param.id);
      case ENUM_RESOURCE.MENU_RESOURCE.ATTRIBUTES:
        return setDetailsID(param.id);
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

  useEffect(() => {
    actions.getFolders();
  }, [actions]);

  useEventListener(ENUM_COMMON.CUSTOM_EVENTS.REFRESH_RESOURCES, run);

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
