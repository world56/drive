import { toCategory } from "@/utils/format";

import { ENUM_LOG } from "@/enum/log";

export namespace CONSTANT_LOG {
  export const EVENT = toCategory([
    { id: ENUM_LOG.EVENT.LOGIN, name: "用户登录" },
    { id: ENUM_LOG.EVENT.LOG_OUT, name: "用户登出" },
    { id: ENUM_LOG.EVENT.USER_INSERT, name: "创建用户" },
    { id: ENUM_LOG.EVENT.USER_UPDATE, name: "编辑用户信息" },
    { id: ENUM_LOG.EVENT.USER_STATUS, name: "账号状态变更" },
    { id: ENUM_LOG.EVENT.USER_PWD_UPDATE, name: "修改登录密码" },
    { id: ENUM_LOG.EVENT.RESOURCE_UPLOAD, name: "上传资源" },
    { id: ENUM_LOG.EVENT.RESOURCE_DOWNLOAD, name: "下载资源" },
    { id: ENUM_LOG.EVENT.RESOURCE_UPDATE, name: "编辑资源信息" },
    { id: ENUM_LOG.EVENT.RESOURCE_MKDIR_FOLDER, name: "创建文件夹" },
    { id: ENUM_LOG.EVENT.RESOURCE_TO_RECYCLE, name: "资源放入回收站" },
    { id: ENUM_LOG.EVENT.RECYCLE_BIN_RECOVERY, name: "恢复回收站资源" },
    { id: ENUM_LOG.EVENT.RECYCLE_BIN_DELETE, name: "删除回收站资源" },
  ]);
}
