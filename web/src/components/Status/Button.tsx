import { Button } from "antd";

import { ENUM_COMMON } from "@/enum/common";
import { CONSTANT_COMMON } from "@/constant/common";

import type { BaseButtonProps } from "antd/es/button/button";

export interface TypeStatusButtonProps
  extends Omit<BaseButtonProps, "type" | "small" | "children"> {
  type: ENUM_COMMON.STATUS;
  onClick?(): void;
}

/**
 * @name Btn 可反向操作激活、冻结操作
 */
const Btn: React.FC<TypeStatusButtonProps> = ({ type, ...props }) => {
  const reverse =
    type === ENUM_COMMON.STATUS.ACTIVATE
      ? CONSTANT_COMMON.STATUS.OBJ[ENUM_COMMON.STATUS.FREEZE]
      : CONSTANT_COMMON.STATUS.OBJ[ENUM_COMMON.STATUS.ACTIVATE];
  return (
    <Button
      {...props}
      size="small"
      type="link"
      style={{ color: reverse.color }}
    >
      {reverse.name}
    </Button>
  );
};

export default Btn;
