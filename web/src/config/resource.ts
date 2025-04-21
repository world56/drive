/**
 * @name UPLOAD_SLICE_SIZE 文件分割大小
 * @description Nginx、Service 最大支持10MB
 */
export const UPLOAD_SLICE_SIZE = 2 * 1024 * 1024;

/**
 * @name UPLOAD_FILE_MAX_COUNT 上传队列最大宏任务数
 */
export const UPLOAD_FILE_MAX_COUNT = 2;

/**
 * @name ICON_THRESHOLD 图标最大阈值
 * @description 图片作为图标时，太大影响加载速度、同时解析可能会存在解析的问题
 */
export const ICON_THRESHOLD = 5 * 1024 * 1024;

/**
 * @name RESOURCE_PREVIEW_PREFIX 资源预览前缀
 */
export const RESOURCE_PREVIEW_PREFIX = "/static";

/**
 * @name PREVIEW_Z_INDEX 预览层级
 */
export const PREVIEW_Z_INDEX = "Z_INDEX";

/**
 * @name PREVIEW_RESOURCE 预览资源类型
 */
export const PREVIEW_RESOURCE = {
  IMAGE: ["jpg", "png", "gif", "svg", "bmp", "jpeg", "webp"],
  AUDIO: ["mp3", "ogg", "flac"],
  VIDEO: ["mp4", "avi"],
};
