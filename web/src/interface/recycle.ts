import type { TypeUser } from "./user";
import type { TypeCommon } from "./common";
import type { TypeResource } from "./resource";

/**
 * @name TypeRecycle 回收站
 */
export namespace TypeRecycle {
  export interface DTO extends Pick<TypeCommon.DTO<number>, "id"> {
    /** @param operatorId 操作人*/
    operatorId: TypeUser.DTO["id"];
    /** @param operator 操作人*/
    operator: TypeUser.DTO;
    /** @param createTime 操作时间*/
    createTime: Date;
    /** @param resourceId 资源ID*/
    resourceId: TypeResource.DTO["id"];
    resource: TypeResource.DTO;
  }

  /**
   * @name Delete 删除资源
   */
  export interface ReqDelete {
    ids: DTO["id"][];
  }

  /**
   * @name Recover 恢复资源
   */
  export interface ReqRecover extends ReqDelete {}

  /**
   * @name Check 检查资源上级目录是否存在
   */
  export interface ReqCheck extends ReqRecover {}

  /**
   * @name Check 相关资源上级目录状态
   */
  export interface ResCheck extends Record<DTO["id"], boolean> {}
}
