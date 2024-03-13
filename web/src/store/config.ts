import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { FOLDER_WIDTH_KEY } from "@/config/system";

const DEFAULT_CONFIG = {
  /** @param UPLOAD 上传组件显示状态 */
  UPLOAD: false,
  /** @param SEARCH 文件查询显示状态 */
  SEARCH: false,
  /** @param FOLDER_TREE_WIDTH 文件夹目录树宽度 */
  FOLDER_TREE_WIDTH: Number(sessionStorage.getItem(FOLDER_WIDTH_KEY)) || 300,
};

const configSlice = createSlice({
  name: "SYSTEM",
  initialState: DEFAULT_CONFIG,
  reducers: {
    setConfig(
      state,
      action: PayloadAction<Partial<typeof DEFAULT_CONFIG>, string>,
    ) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

const ActionsConfig = configSlice.actions;

export { configSlice, ActionsConfig };

export default configSlice.reducer;
