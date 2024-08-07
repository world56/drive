import { useActions, useStore } from "@/hooks";
import { useLocation, useNavigate } from "react-router-dom";

import type { TypeResource } from "@/interface/resource";

/**
 * @name useToFolder 预览文件夹
 * @description 该功能涉及 URL、FolderTree相关状态变更 这里统一处理了
 */
export default function useToFolder<
  T extends TypeResource.DTO["id"] = TypeResource.DTO["id"],
>() {
  const actions = useActions();
  const resource = useStore("resource");

  const navigate = useNavigate();
  const { pathname } = useLocation();

  function getPath(id: React.Key) {
    const ids: React.Key[] = [id];
    while (true) {
      const target = resource.foldersObj[id as string];
      if (target.parentId) {
        id = target.parentId;
        ids.unshift(target.parentId);
      } else {
        return ids as T[];
      }
    }
  }

  /**
   * @name toFolder 打开文件夹
   * @param id 目标文件夹ID 为空则查看主目录
   */
  function toFolder(id?: TypeResource.DTO["id"]) {
    actions.setSelect({});
    if (id) {
      const path = getPath(id);
      actions.setPath(path);
      pathname !== "/resource" && navigate("/resource");
    } else {
      actions.setPath([]);
    }
  }

  return toFolder;
}
