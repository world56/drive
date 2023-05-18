import { userSlice } from "../user";
import { createAction } from "@reduxjs/toolkit";

import type { TypeUser } from "@/interface/user";

export const userLogin = createAction<TypeUser.Login>(
  `${userSlice.name}/LOGIN`,
);

export const getUserInfo = createAction(`${userSlice.name}/GET_INFO`);
