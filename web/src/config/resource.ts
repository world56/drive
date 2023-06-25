/**
 * @name UPLOAD_SLICE_SIZE 文件分割大小
 * @description Nginx、Service 最大支持10MB
 */
export const UPLOAD_SLICE_SIZE = 2 * 1024 * 1024;

/**
 * @name PICTURE_PREVIEW_SIZE 图片预览限制
 * @description 图片太大会影响加载速度
 */
export const PICTURE_PREVIEW_SIZE = 5 * 1024 * 1024;

/**
 * @name UPLOAD_FILE_MAX_COUNT 上传最大宏任务数
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
export const RESOURCE_PREVIEW_PREFIX = '/static';
