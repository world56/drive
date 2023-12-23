import { toCategory } from "@/utils/format";

import { ENUM_COMMON } from "@/enum/common";

export namespace CONSTANT_COMMON {
  export const SORT = toCategory([
    { id: ENUM_COMMON.SORT.DESC, name: "降序" },
    { id: ENUM_COMMON.SORT.ASC, name: "升序" },
  ]);
}
