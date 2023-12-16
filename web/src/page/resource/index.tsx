import { useRequest } from "ahooks";
import Edit from "./components/Edit";
import Move from "./components/Move";
import Files from "./components/Files";
import Folder from "./components/Folder";
import styles from "./index.module.sass";
import { useEffect, useState } from "react";
import { updateFavorite } from "@/api/favorite";
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

  const onMenu: TypeFilesProps["onMenu"] = async (type, id) => {
    switch (type) {
      case ENUM_RESOURCE.MENU.MKDIR:
        return setEdit({ open: true, parentId: id });
      case ENUM_RESOURCE.MENU.REFRESH:
        return run();
      case ENUM_RESOURCE.MENU.UPLOAD_FILE:
        return createUpload();
      case ENUM_RESOURCE.MENU.UPLOAD_FOLDER:
        return createUpload(true);
      case ENUM_RESOURCE.MENU.SORT_NAME:
      case ENUM_RESOURCE.MENU.SORT_SIZE:
      case ENUM_RESOURCE.MENU.SORT_TYPE:
      case ENUM_RESOURCE.MENU.SORT_SUFFIX:
      case ENUM_RESOURCE.MENU.SORT_CREATOR_ID:
      case ENUM_RESOURCE.MENU.SORT_CREATE_TIME:
        return actions.setSort({ ...resource.sort, type });
      case ENUM_RESOURCE.MENU.SORT_ASC:
      case ENUM_RESOURCE.MENU.SORT_DESC:
        return actions.setSort({ ...resource.sort, order: type });
      case ENUM_RESOURCE.MENU.OPEN:
        return resource.foldersObj[id!] && toFolder(id);
      case ENUM_RESOURCE.MENU.DELETE:
        await deleteResources({ ids: [id!] });
        return run();
      case ENUM_RESOURCE.MENU.EDIT:
        return setEdit({ open: true, id });
      case ENUM_RESOURCE.MENU.MOVE:
        return setMove([id!]);
      case ENUM_RESOURCE.MENU.DOWNLOAD:
        return downloadFile(id);
      case ENUM_RESOURCE.MENU.ATTRIBUTES:
        return setDetailsID(id);
      case ENUM_RESOURCE.MENU.FAVORITE:
        await updateFavorite({ resourceId: id! });
        return run();
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
      <Files data={data} onMenu={onMenu} loading={loading} />
      <Attributes id={detailsID} onClose={onCloseDetails} />
      <Move ids={move} onClose={onCloseMove} />
      <Edit {...edit} onClose={onCloseEdit} />
    </div>
  );
};

export default Resource;
