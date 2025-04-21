import { toCategory } from "@/utils/format";

import { ENUM_COMMON } from "@/enum/common";

export namespace CONSTANT_COMMON {
  export const SORT = toCategory([
    { id: ENUM_COMMON.SORT.DESC, name: "降序" },
    { id: ENUM_COMMON.SORT.ASC, name: "升序" },
  ]);

  export const STATUS = toCategory([
    {
      id: ENUM_COMMON.STATUS.ACTIVATE,
      name: "激活",
      color: ENUM_COMMON.COLOR.GREEN,
    },
    {
      id: ENUM_COMMON.STATUS.FREEZE,
      name: "冻结",
      color: ENUM_COMMON.COLOR.RED,
    },
  ]);
}
