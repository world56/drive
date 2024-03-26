import { SetMetadata } from '@nestjs/common';

import { ENUM_COMMON } from '@/enum/common';

export const RuleWhitelist = (
  params: ENUM_COMMON.ROLE[] | undefined = [
    ENUM_COMMON.ROLE.REG,
    ENUM_COMMON.ROLE.SA,
  ],
) => SetMetadata('rule', params);
