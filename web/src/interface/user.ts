import { ENUM_USER } from "@/enum/user";
import { ENUM_COMMON } from "@/enum/common";

import type { TypeCommon } from "./common";

export namespace TypeUser {
  /**
   * @name DTO 用户DTO
   */
  export interface DTO extends Pick<TypeCommon.DTO, "id" | "name"> {
    /** @param account 登陆账号 */
    account: string;
    /** @param password 登陆密码 */
    password: string;
    /** @param role 角色 */
    role: ENUM_USER.ROLE;
    /** @param status 用户状态 */
    status: ENUM_COMMON.STATUS;
    /** @param remark 账号备注 */
    remark?: string;
    /** @param contact 联系方式 */
    contact?: string;
  }

  /**
   * @name Login 用户登陆
   */
  export interface Login extends Pick<DTO, "account" | "password"> {
    /** @param expire 登陆有效期 三天 */
    expire?: boolean;
  }

  /**
   * @name ChangePWD 修改密码
   */
  export interface ChangePWD extends Pick<DTO, "id" | "password"> {
    /** @param newPWD 新密码  */
    pwd: string;
  }

  /**
   * @name ReqUsers 查询用户列表
   */
  export interface ReqUsers
    extends Partial<Pick<DTO, "name" | "account" | "status">>,
      TypeCommon.PageTurning {}
}
