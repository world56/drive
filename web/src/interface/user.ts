import { ENUM_COMMON } from "@/enum/common";

import type { TypeCommon } from "./common";

export namespace TypeUser {
  export interface DTO {
    id: TypeCommon.PrimaryKey;
    name: string;
    account: string;
    password: string;
    status: ENUM_COMMON.STATUS;
    isSuper: ENUM_COMMON.SUPER_ADMIN;
  }

  export interface Login extends Pick<DTO, "account" | "password"> {
    expire?: boolean;
  }

  export interface ChangePWD extends Pick<DTO, "id" | "password"> {
    newPassword: string;
  }

  export interface Query
    extends Pick<DTO, "name" | "account">,
      TypeCommon.PageTurning {}
}
