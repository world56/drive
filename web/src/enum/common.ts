export namespace ENUM_COMMON {
  /**
   * @name COLOR 常用的颜色
   */
  export enum COLOR {
    /** @param BLACK 黑 */
    BLACK = "#000000d9",
    /** @param GREY 灰 */
    GREY = "#696969",
    /** @param BLUE 蓝 */
    BLUE = "#1890ff",
    /** @param GREEN 绿 */
    GREEN = "#67c23a",
    /** @param RED 红 */
    RED = "#f56c6c",
    /** @param YELLOW 黄 */
    YELLOW = "#e6a23c",
    /** @param ORANGE 橙 */
    ORANGE = "#ff8c00",
    /** @param PURPLE 紫 */
    PURPLE = "#800080",
  }

  /**
   * @name CUSTOM_EVENTS 自定义事件
   * @description 本系统中会用到的自定义事件的eventName
   */
  export enum CUSTOM_EVENTS {
    /** @param UPLOAD 初始化上传任务 */
    UPLOAD = "UPLOAD",
    /**
     * @param REFRESH_RESOURCES 刷新资源列表页面
     * @description URL: /resource
     */
    REFRESH_RESOURCES = "REFRESH_RESOURCES",
  }

  /**
   * @name SORT 排序方式
   */
  export enum SORT {
    /** @param DESC 降序 */
    DESC = "DESC",
    /** @param ASC 升序 */
    ASC = "ASC",
  }
}
