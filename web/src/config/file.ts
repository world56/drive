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
