import { toCategory } from "@/utils/format";

import { ENUM_USER } from "@/enum/user";

export namespace CONSTANT_USER {
  export const ROLE = toCategory([
    { id: ENUM_USER.ROLE.SA, name: "管理员" },
    { id: ENUM_USER.ROLE.REG, name: "普通用户" },
  ]);
}
