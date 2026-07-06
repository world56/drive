import request from "@/utils/request";

import { ENUM_HTTP } from "@/enum/http";
import { API_PROXY_EXPLORER_URL } from "@/config/request";

import { TypeResource } from "@/interface/resource";

/**
 * @name uploadChunk 上传资源
 */
export function uploadChunk(data: FormData, control: AbortController) {
  return request<TypeResource.DTO | false>("upload", {
    data,
    signal: control.signal,
    proxy: ENUM_HTTP.PROXY.STORAGE,
    method: ENUM_HTTP.REQUEST_MODE.POST,
    headers: { contentType: ENUM_HTTP.CONTENT_TYPE.MULTIPART },
  });
}


/**
 * @name API_DOWNLOAD_FILE_URL 下载文件URL
 */
export const API_DOWNLOAD_FILE_URL = `${API_PROXY_EXPLORER_URL}resource/download`;
