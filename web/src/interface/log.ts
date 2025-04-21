import { ENUM_LOG } from "@/enum/log";

import type { TypeUser } from "./user";
import type { TypeCommon } from "./common";

/**
 * @name TypeLog 日志
 */
export namespace TypeLog {
  /**
   * @name DTO “日志” DTO
   */
  export interface DTO extends Pick<TypeCommon.DTO, "id"> {
    /** @param desc 日志描述 */
    desc: string;
    /** @param createTime 操作时间 */
    createTime: Date;
    /** @param event 事件类型 */
    event: ENUM_LOG.EVENT;
    /** @param event 操作人 */
    operator: TypeUser.DTO;
    /** @param event 操作人ID */
    operatorId: TypeUser.DTO["id"];
  }

  /**
   * @name ReqLogs 查询“日志”列表
   */
  export interface ReqLogs
    extends TypeCommon.PageTurning,
      Partial<Pick<DTO, "event" | "createTime">> {}
}
