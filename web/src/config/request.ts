/**
 * @name TOKEN_KEY 用户token key
 * @description 存储在cookie 请求接口需要在header携带
 */
export const TOKEN_KEY = "Authorization";

/**
 * @name SAGA_DEBOUNCE redux-saga 防抖时间限制
 * @description 仅在saga中使用
 */
export const SAGA_DEBOUNCE = 1000 * 1;

/**
 * @name REQUEST_TIMEOUT 请求超时时间限制
 */
export const REQUEST_TIMEOUT = 1000 * 30;

/**
 * @name PICTURE_PREVIEW_SIZE 分段上传文件分割大小
 */
export const PICTURE_PREVIEW_SIZE = 2 * 1024 * 1024;

/**
 * @name API_PROXY_AUTH_URL API 授权中心
 */
export const API_PROXY_AUTH_URL = `/api/auth/`;

/**
 * @name API_PROXY_EXPLORER_URL API 资源管理
 */
export const API_PROXY_EXPLORER_URL = `/api/explorer/`;
