import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const DEFAULT_CONFIG = {
  /** @param UPLOAD 上传组件显示状态 */
  UPLOAD: false,
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
