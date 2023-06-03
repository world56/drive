export namespace ENUM_RESOURCE {
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

  export enum SORT {
    NAME,
    SIZE,
    TYPE,
    SUFFIX,
    CREATOR,
    CREATION_TIME,
  }
}
