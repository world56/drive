import cookie from "js-cookie";
import { createSlice } from "@reduxjs/toolkit";

import { TOKEN_KEY } from "@/config/request";

import type { TypeUser } from "@/interface/user";
import type { PayloadAction } from "@reduxjs/toolkit";

export const DEFAULT_USER: Partial<TypeUser.DTO> = {};

const userSlice = createSlice({
  name: "USER",
  initialState: DEFAULT_USER,
  reducers: {
    setUserInfo: (_state, action: PayloadAction<TypeUser.DTO, string>) => {
      return action.payload;
    },
    delUserInfo() {
      document.title = "Welcome";
      cookie.remove(TOKEN_KEY);
      return {};
    },
  },
});

const ActionsUser = userSlice.actions;

export { userSlice, ActionsUser };

export default userSlice.reducer;
