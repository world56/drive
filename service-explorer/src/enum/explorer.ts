export namespace ENUM_RESOURCE {
  export enum TYPE {
    OTHER = -1,
    FOLDER,
    IMAGE,
    VIDEO,
    AUDIO,
    DOCUMENT,
    COMPRESSED,
  }

  /**
   * @name SORT 排序类型
   */
  export enum SORT {
    /** @param SORT_NAME 文件名称 */
    SORT_NAME = 'SORT_NAME',
    /** @param SORT_NAME 文件大小 */
    SORT_SIZE = 'SORT_SIZE',
    /** @param SORT_SUFFIX 文件格式 */
    SORT_SUFFIX = 'SORT_SUFFIX',
    /** @param SORT_TYPE 文件类型 */
    SORT_TYPE = 'SORT_TYPE',
    /** @param SORT_CREATOR 创建、上传人 */
    SORT_CREATOR = 'SORT_CREATOR_ID',
    /** @param SORT_CREATE_TIME 上传时间 */
    SORT_CREATE_TIME = 'SORT_CREATE_TIME',
  }

  /**
   * @name ORDER 排序方式
   */
  export enum ORDER {
    /** @param SORT_ASC 排序方式-升序 */
    SORT_ASC = 'SORT_ASC',
    /** @param SORT_ASC 排序方式-降序 */
    SORT_DESC = 'SORT_DESC',
  }
}
