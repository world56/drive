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
 * @name API_PROXY_AUTH_URL API 授权中心
 */
export const API_PROXY_AUTH_URL = `/api/auth/`;

/**
 * @name API_PROXY_ASSET_URL API 资源服务
 */
export const API_PROXY_ASSET_URL = `/api/asset/`;

/**
 * @name API_PROXY_STATS_URL API 统计
 */
export const API_PROXY_STATS_URL = `/api/stats/`;

/**
 * @name API_PROXY_STORAGE_URL 存储服务
 */
export const API_PROXY_STORAGE_URL = `/api/storage/`;
