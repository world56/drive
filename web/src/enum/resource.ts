export namespace ENUM_RESOURCE {
  /**
   * @name STATUS 上传状态
   */
  export enum STATUS {
    /** @param UPLOADING 上传中 */
    UPLOADING,
    /** @param PAUSE 暂停 */
    PAUSE,
    /** @param ERROR 错误 */
    ERROR,
    /** @param DONE 完成 */
    DONE,
  }

  /**
   * @name TYPE 资源类型
   */
  export enum TYPE {
    /**
     * @param OTHER 其他资源类型
     * @description 服务器不能解析识别的资源文件
     */
    OTHER = -1,
    /** @param FOLDER 文件夹 */
    FOLDER,
    /** @param IMAGE 图片 */
    IMAGE,
    /** @ @param VIDEO 视频 */
    VIDEO,
    /** @param AUDIO 音频 */
    AUDIO,
    /** @param DOCUMENT 文档 */
    DOCUMENT,
    /** @param COMPRESSED 压缩文件 */
    COMPRESSED,
  }

  /**
   * @name MENU 鼠标右键-菜单选项
   */
  export enum MENU {
    /** @param UPLOAD_FILE 上传文件 */
    UPLOAD_FILE = "UPLOAD_FILE",
    /** @param UPLOAD_FOLDER 上传文件夹 */
    UPLOAD_FOLDER = "UPLOAD_FOLDER",
    /** @param MKDIR 创建文件夹 */
    MKDIR = "MKDIR",
    /** @param REFRESH 刷新当前资源列表 */
    REFRESH = "REFRESH",
    /** @param SEARCH 搜索 */
    SEARCH = "SEARCH",
    // /** @param LAYOUT_LIST 布局-列表 */
    // LAYOUT_LIST = "LAYOUT_LIST",
    // /** @param LAYOUT_THUMBNAIL 布局-缩略图 */
    // LAYOUT_THUMBNAIL = "LAYOUT_THUMBNAIL",
    /** @param SORT_NAME 排序-文件名称 */
    SORT_NAME = "SORT_NAME",
    /** @param SORT_NAME 排序-文件大小 */
    SORT_SIZE = "SORT_SIZE",
    /** @param SORT_SUFFIX 排序-文件格式 */
    SORT_SUFFIX = "SORT_SUFFIX",
    /** @param SORT_TYPE 排序-文件类型 */
    SORT_TYPE = "SORT_TYPE",
    /** @param SORT_CREATOR_ID 排序-创建、上传人 */
    SORT_CREATOR_ID = "SORT_CREATOR_ID",
    /** @param SORT_CREATE_TIME 排序-上传时间 */
    SORT_CREATE_TIME = 'SORT_CREATE_TIME',
    /** @param SORT_ASC 排序方式-升序 */
    SORT_ASC = "SORT_ASC",
    /** @param SORT_ASC 排序方式-降序 */
    SORT_DESC = "SORT_DESC",
    /** @param OPEN 打开、预览 文件、文件夹 */
    OPEN = "OPEN",
    /** @param COPY_NAME 复制名称 */
    COPY_NAME = "COPY_NAME",
    /** @param EDIT 编辑 */
    EDIT = "EDIT",
    /** @param MOVE 移动 */
    MOVE = "MOVE",
    /** @param DOWNLOAD 下载 */
    DOWNLOAD = "DOWNLOAD",
    /** @param DELETE 删除 */
    DELETE = "DELETE",
    /** @param FAVORITE 收藏 */
    FAVORITE = "FAVORITE",
    /**
     * @param ATTRIBUTES 属性
     * @description 逻辑跟Mac、Windows查看逻辑差不多
     */
    ATTRIBUTES = "ATTRIBUTES",
  }
}
