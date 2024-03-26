import { TypeStatusButtonProps } from "./Button";

import { CONSTANT_COMMON } from "@/constant/common";

interface TypeStatusTextProps extends Pick<TypeStatusButtonProps, "type"> {}

/**
 * @name StatusText 状态文本
 * @description 带颜色
 */
const StatusText: React.FC<TypeStatusTextProps> = ({ type }) => {
  const status = CONSTANT_COMMON.STATUS.OBJ[type];
  return <span style={{ color: status?.color }}>{status.name}</span>;
};

export default StatusText;
