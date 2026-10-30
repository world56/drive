import { listToTree } from "@/utils/format";
import { matchPath } from "react-router-dom";
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
  /** @param loading 文件夹列表请求状态 */
  loading: boolean;
  /** @param path 当前目录面包屑 ID */
  path: Array<TypeResource.DTO["id"]>;
  /**
   * @name sort 排序类型
   * @param type 排序类型
   * @param order 排序方式
   */
  sort: Pick<TypeResource.ReqResources, "order" | "type">;
  /** @param selects 多选选择的key */
  selects: Record<TypeResource.DTO["id"], boolean>;
}

const folderId = matchPath("/resource/:folderId", location.pathname)?.params.folderId;

const DEFAULT_RESOURCE: TypeResourceReducersProps = {
  folders: [],
  folderTree: [],
  foldersObj: {},
  loading: false,
  selects: {},
  path: folderId ? [folderId] : [],
  sort: {
    order: ENUM_RESOURCE.MENU.SORT_DESC,
    type: ENUM_RESOURCE.MENU.SORT_CREATE_TIME,
  },
};

const resourceSlice = createSlice({
  name: "RESOURCE",
  initialState: DEFAULT_RESOURCE,
  reducers: {
    setFolder(
      state,
      action: PayloadAction<
        Omit<TypeResourceReducersProps, "path" | "sort" | "loading" | "selects">,
        string
      >,
    ) {
      const next = { ...state, ...action.payload };
      const id = next.path.at(-1);
      const paths = id ? next.foldersObj[id]?.paths : undefined;
      if (paths?.length) {
        next.path = paths.map((v) => v.id);
      }
      return next;
    },
    setFolderLoading(
      state,
      action: PayloadAction<TypeResourceReducersProps["loading"], string>,
    ) {
      return { ...state, loading: action.payload };
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
    setSelect(
      state,
      action: PayloadAction<TypeResourceReducersProps["selects"], string>,
    ) {
      return { ...state, selects: action.payload };
    },
  },
});

const ActionsResource = resourceSlice.actions;

export { resourceSlice, ActionsResource };

export default resourceSlice.reducer;
