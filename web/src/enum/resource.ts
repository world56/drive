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
   * @name SORT 排序方式
   */
  export enum SORT {
    /** @param  NAME 名称 */
    NAME,
    /** @param SIZE 大小 */
    SIZE,
    /**
     * @param 类型
     * @description 例如：音频、视频、图片
     */
    TYPE,
    /**
     * @param SUFFIX 后缀
     * @description 例如：txt、mp3、mp4
     */
    SUFFIX,
    /** @param CREATOR 创建人 */
    CREATOR,
    /** @param CREATION_TIME 创建时间 */
    CREATION_TIME,
  }
}
