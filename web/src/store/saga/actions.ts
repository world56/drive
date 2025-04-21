import { userSlice } from "../user";
import { configSlice } from "../config";
import { resourceSlice } from "../resource";
import { createAction } from "@reduxjs/toolkit";

import type { TypeUser } from "@/interface/user";

/**
 * @name login 用户登陆
 */
export const login = createAction<TypeUser.Login>(`${userSlice.name}/LOGIN`);

/**
 * @name getUserInfo 获取登陆用户信息
 */
export const getUserInfo = createAction(`${userSlice.name}/GET_INFO`);

/**
 * @name getFolders 获取文件夹列表
 */
export const getFolders = createAction(`${resourceSlice.name}/GET_FOLDERS`);

/**
 * @name getKey 获取客户端密钥
 */
export const getKey = createAction(`${configSlice.name}/GET_KEY`);
