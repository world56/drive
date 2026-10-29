import { useActions, useStore } from "@/hooks";
import { useMatch, useNavigate } from "react-router-dom";

import type { TypeResource } from "@/interface/resource";

/**
 * @name useToFolder 预览文件夹
 * @description 该功能涉及 URL、FolderTree相关状态变更 这里统一处理了
 */
export default function useToFolder() {
  const actions = useActions();
  const resource = useStore("resource");
  const navigate = useNavigate();
  const matched = useMatch("/resource/:folderId?");

  /**
   * @name toFolder 打开文件夹
   * @param id 目标文件夹ID 为空则查看主目录
   */
  function toFolder(id?: TypeResource.DTO["id"]) {
    actions.setSelect({});

    if (id) {
      const path = resource.foldersObj[id]?.paths?.map((v) => v.id) || [id];
      actions.setPath(path);
    } else {
      actions.setPath([]);
    }

    !matched && navigate("/resource");
  }

  return toFolder;
}
