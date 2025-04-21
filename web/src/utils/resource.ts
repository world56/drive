import store from "@/store";
import { message } from "antd";
import { ActionsConfig } from "@/store/config";

import { ENUM_COMMON } from "@/enum/common";
import { PREVIEW_Z_INDEX } from "@/config/resource";
import { API_DOWNLOAD_FILE_URL } from "@/api/resource";

/**
 * @name createUpload 创建上传任务
 */
export function createUpload(isFolder?: boolean) {
  return new Promise<boolean>((resolve, reject) => {
    const ele = document.createElement("input");
    ele.setAttribute("type", "file");
    ele.setAttribute("multiple", "true");
    ele.setAttribute("class", "none");
    isFolder && ele.setAttribute("directory", "true");
    isFolder && ele.setAttribute("webkitdirectory", "true");
    document.body.append(ele);
    ele.click();
    ele.onchange = (e) => {
      try {
        const { files } = e.target as HTMLInputElement;
        if (files?.length) {
          const detail: File[] = Array.prototype.filter.call(
            files!,
            (v: File) => v.name !== ".DS_Store",
          );
          const signal = new CustomEvent(ENUM_COMMON.CUSTOM_EVENTS.UPLOAD, {
            detail,
          });
          document.dispatchEvent(signal);
          store.dispatch(ActionsConfig.setConfig({ UPLOAD: true }));
          resolve(true);
        } else {
          message.warning("没有选择正确的文件，请重试");
          reject();
        }
      } catch (error) {
        reject(error);
      } finally {
        ele.onchange = null;
        document.body.removeChild(ele);
      }
    };
  });
}

/**
 * @name downloadFile 下载文件
 */
export function downloadFile(id?: string) {
  try {
    const ele = document.createElement("iframe");
    ele.setAttribute("class", "none");
    ele.src = `${API_DOWNLOAD_FILE_URL}?id=${id}&timestamp=${new Date().valueOf()}`;
    document.body.appendChild(ele);
    setTimeout(() => document.body.removeChild(ele), 2000);
  } catch (e) {
    message.error(`下载失败${e}`);
  }
}

/**
 * @name getPreviewZIndex 预览层级
 */
export function getPreviewZIndex() {
  let i = Number(sessionStorage.getItem(PREVIEW_Z_INDEX)) || 10;
  sessionStorage.setItem(PREVIEW_Z_INDEX, String(++i));
  return i.toString();
}
