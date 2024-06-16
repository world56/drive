export namespace ENUM_LOG {
  /**
   * @name EVENT 日志类型
   */
  export enum EVENT {
    /**
     * @param LOGIN 登录
     */
    LOGIN = "LOGIN",
    /**
     * @param LOG_OUT 登出
     */
    LOG_OUT = "LOG_OUT",
    /**
     * @param USER_INSERT 创建用户
     */
    USER_INSERT = "USER_INSERT",
    /**
     * @param USER_UPDATE 编辑用户
     */
    USER_UPDATE = "USER_UPDATE",
    /**
     * @param USER_STATUS 冻结用户
     */
    USER_STATUS = "USER_STATUS",
    /**
     * @param USER_ACTIVATE 用户修改自己密码
     */
    USER_PWD_UPDATE = "USER_PWD_UPDATE",
    /**
     * @param RESOURCE_UPLOAD 上传资源
     */
    RESOURCE_UPLOAD = "RESOURCE_UPLOAD",
    /**
     * @param RESOURCE_DOWNLOAD 下载资源
     */
    RESOURCE_DOWNLOAD = "RESOURCE_DOWNLOAD",
    /**
     * @param RESOURCE_MKDIR_FOLDER 创建文件夹
     */
    RESOURCE_MKDIR_FOLDER = "RESOURCE_MKDIR_FOLDER",
    /**
     * @param RESOURCE_DELETE 删除资源
     * @description 文件、文件夹
     */
    RESOURCE_DELETE = "RESOURCE_DELETE",
    /**
     * @param RESOURCE_UPDATE 编辑资源
     */
    RESOURCE_UPDATE = "RESOURCE_UPDATE",
  }
}
