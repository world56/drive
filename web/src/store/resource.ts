import { listToTree } from "@/utils/format";
import { createSlice } from "@reduxjs/toolkit";

import { ENUM_RESOURCE } from "@/enum/resource";

import type { PayloadAction } from "@reduxjs/toolkit";
import type { TypeResource } from "@/interface/resource";

type TypeFolder = ReturnType<typeof listToTree<TypeResource.DTO>>;

interface TypeResourceReducersProps {
  /** @param folders 文件夹列表 */
  folders: TypeResource.DTO[];
  /** @param folderTree 文件夹树 */
  folderTree: TypeFolder["list"];
  /** @param foldersObj 文件夹字典 */
  foldersObj: TypeFolder["obj"];
  /** @param path 文件夹目录路径  */
  path: Array<TypeResource.DTO["id"]>;
  /**
   * @name sort 排序类型
   * @param type 排序类型
   * @param order 排序方式
   */
  sort: Pick<TypeResource.ReqResources, "order" | "type">;
}

const DEFAULT_RESOURCE: TypeResourceReducersProps = {
  folders: [],
  folderTree: [],
  foldersObj: {},
  sort: {
    order: ENUM_RESOURCE.MENU.SORT_DESC,
    type: ENUM_RESOURCE.MENU.SORT_CREATE_TIME,
  },
  path:
    new URLSearchParams(window.location.search).get("path")?.split("/") || [],
};

const resourceSlice = createSlice({
  name: "RESOURCE",
  initialState: DEFAULT_RESOURCE,
  reducers: {
    setFolder(
      state,
      action: PayloadAction<Omit<TypeResourceReducersProps, "path">, string>,
    ) {
      return { ...state, ...action.payload };
    },
    setPath(
      state,
      action: PayloadAction<TypeResourceReducersProps["path"], string>,
    ) {
      return { ...state, path: action.payload };
    },
    setSort(
      state,
      action: PayloadAction<TypeResourceReducersProps["sort"], string>,
    ) {
      return { ...state, sort: action.payload };
    },
  },
});

const ActionsResource = resourceSlice.actions;

export { resourceSlice, ActionsResource };

export default resourceSlice.reducer;
