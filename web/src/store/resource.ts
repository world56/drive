import { listToTree } from "@/utils/format";
import { TypeResource } from "@/interface/resource";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

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
}

const DEFAULT_RESOURCE: TypeResourceReducersProps = {
  folders: [],
  folderTree: [],
  foldersObj: {},
  path: new URLSearchParams(window.location.search).getAll("path"),
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
  },
});

const ActionsResource = resourceSlice.actions;

export { resourceSlice, ActionsResource };

export default resourceSlice.reducer;
