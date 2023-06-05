import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const DEFAULT_CONFIG = {
  UPLOAD: true,
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
