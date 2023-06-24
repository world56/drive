import { ENUM_USER } from "@/enum/user";

import type { TypeCommon } from "./common";

export namespace TypeUser {
  export interface DTO {
    id: TypeCommon.PrimaryKey;
    name: string;
    account: string;
    password: string;
    role: ENUM_USER.ROLE;
    status: ENUM_USER.STATUS;
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
