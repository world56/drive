import { useNavigate } from "react-router-dom";
import { useActions, useStore } from "@/hooks";

import type { TypeResource } from "@/interface/resource";

/**
 * @name useToFolder 预览文件夹
 * @description 该功能涉及 URL、FolderTree相关状态变更 这里统一处理了
 */
export function useToFolder<
  T extends TypeResource.DTO["id"] = TypeResource.DTO["id"],
>() {
  const actions = useActions();
  const navigate = useNavigate();
  const resource = useStore('resource');

  function getPath(id: React.Key) {
    const ids: React.Key[] = [id];
    while (true) {
      const target = resource.foldersObj[id];
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
    if (id) {
      const path = getPath(id);
      actions.setPath(path);
      navigate(`/resource/${path.join("/")}`);
    } else {
      actions.setPath([]);
      navigate("/resource");
    }
  }

  return toFolder;
}
