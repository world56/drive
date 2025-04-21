export namespace ENUM_LOG {
  /**
   * @name EVENT 日志类型
   */
  export enum EVENT {
    /**
     * @param LOGIN 登录
     */
    LOGIN = 'LOGIN',
    /**
     * @param LOG_OUT 登出
     */
    LOG_OUT = 'LOG_OUT',
    /**
     * @param USER_INSERT 创建用户
     */
    USER_INSERT = 'USER_INSERT',
    /**
     * @param USER_UPDATE 编辑用户
     */
    USER_UPDATE = 'USER_UPDATE',
    /**
     * @param USER_STATUS 冻结用户
     */
    USER_STATUS = 'USER_STATUS',
    /**
     * @param USER_ACTIVATE 用户修改自己密码
     */
    USER_PWD_UPDATE = 'USER_PWD_UPDATE',
    /**
     * @param RESOURCE_UPLOAD 上传资源
     */
    RESOURCE_UPLOAD = 'RESOURCE_UPLOAD',
    /**
     * @param RESOURCE_DOWNLOAD 下载资源
     */
    RESOURCE_DOWNLOAD = 'RESOURCE_DOWNLOAD',
    /**
     * @param RESOURCE_MKDIR_FOLDER 创建文件夹
     */
    RESOURCE_MKDIR_FOLDER = 'RESOURCE_MKDIR_FOLDER',
    /**
     * @param RESOURCE_DELETE 将资源移动至“回收站”
     * @description 文件、文件夹
     */
    RESOURCE_TO_RECYCLE = 'RESOURCE_TO_RECYCLE',
    /**
     * @param RESOURCE_UPDATE 编辑资源
     */
    RESOURCE_UPDATE = 'RESOURCE_UPDATE',
    /**
     * @param RESOURCE_MOVE 移动资源路径
     */
    RESOURCE_MOVE = 'RESOURCE_MOVE',
    /**
     * @param RECYCLE_BIN_DELETE 删除回收站资源
     */
    RECYCLE_BIN_DELETE = 'RECYCLE_BIN_DELETE',
    /**
     * @param RECYCLE_BIN_RECOVERY 恢复回收站资源
     */
    RECYCLE_BIN_RECOVERY = 'RECYCLE_BIN_RECOVERY',
  }
}
