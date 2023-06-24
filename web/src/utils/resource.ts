import store from "@/store";
import { message } from "antd";
import Upload from "@/components/Upload";
import { ActionsConfig } from "@/store/config";

import { ENUM_RESOURCE } from "@/enum/resource";
import { API_DOWNLOAD_FILE_URL } from "@/api/resource";
import { ICON_THRESHOLD, RESOURCE_PREVIEW_PREFIX } from "@/config/resource";

import ICON_DOC from "@/assets/file_doc.svg";
import ICON_IMG from "@/assets/file_img.svg";
import ICON_PDF from "@/assets/file_pdf.svg";
import ICON_PPT from "@/assets/file_ppt.svg";
import ICON_TXT from "@/assets/file_txt.svg";
import ICON_XLS from "@/assets/file_xls.svg";
import ICON_ZIP from "@/assets/file_zip.svg";
import ICON_FOLDER from "@/assets/folder.svg";
import ICON_MUSIC from "@/assets/file_music.svg";
import ICON_OTHER from "@/assets/file_other.svg";
import ICON_VIDEO from "@/assets/file_video.svg";
import ICON_PACKAGE from "@/assets/file_package.svg";

import type { TypeResource } from "@/interface/resource";

type TypeGetFileIcon = Pick<
  TypeResource.DTO,
  "size" | "type" | "suffix" | "path"
>;

function convertMatch(key: string[], value: string) {
  return Object.fromEntries(key.map((k) => [k, value]));
}

const ICON = {
  // 安装包
  ...convertMatch(
    [
      "ext",
      "msi",
      "deb",
      "rpm",
      "pkg",
      "dmg",
      "exe",
      "ipa",
      "pxl",
      "sis",
      "sisx",
      "jar",
      "xap",
      "apk",
      "bin",
      "dpkg",
    ],
    ICON_PACKAGE,
  ),
  // PDF
  ...convertMatch(["pdf"], ICON_PDF),
  // 文本
  ...convertMatch(["txt", "md", "markdown"], ICON_TXT),
  // 压缩文件
  ...convertMatch(["7z", "rar", "zip", "tar", "gzip", "iso"], ICON_ZIP),
  // 视频
  ...convertMatch(
    ["mp4", "rmvb", "avi", "mkv", "mpg", "mpeg", "3gp"],
    ICON_VIDEO,
  ),
  // 图片
  ...convertMatch(
    ["jpg", "png", "gif", "svg", "bmp", "jpeg", "tiff", "webp"],
    ICON_IMG,
  ),
  // 音频
  ...convertMatch(
    [
      "cd",
      "mp3",
      "ogg",
      "wmv",
      "asf",
      "rm",
      "ape",
      "wav",
      "flac",
      "ape",
      "cue",
      "pcm",
    ],
    ICON_MUSIC,
  ),
  // 表格
  ...convertMatch(
    ["xlsx", "xls", "xlsm", "xlsb", "xltx", "xltm", "xlt"],
    ICON_XLS,
  ),
  // PPT
  ...convertMatch(
    [
      "ppt",
      "pptx",
      "pot",
      "pps",
      "ppa",
      "ppam",
      "ppsx",
      "ppsm",
      "pptm",
      "potx",
    ],
    ICON_PPT,
  ),
  // 文档
  ...convertMatch(
    [
      "doc",
      "docx",
      "md",
      "dox",
      "htm",
      "html",
      "wps",
      "xml",
      "csv",
      "xps",
      "bmp",
      "mobi",
      "epub",
      "azw3",
    ],
    ICON_DOC,
  ),
};

/**
 * @name getFileSuffixIcon 获取文件类型图标
 */
export function getFileSuffixIcon(type?: string) {
  if (type) {
    const suffix = ICON[type.toLocaleLowerCase()];
    return suffix ? suffix : ICON_OTHER;
  } else {
    return ICON_OTHER;
  }
}

/**
 * @name getResourceIcon 获取文件图标
 */
export function getResourceIcon<T extends TypeGetFileIcon = TypeGetFileIcon>({
  path,
  type,
  size,
  suffix,
}: T) {
  if (type === ENUM_RESOURCE.TYPE.FOLDER) {
    return ICON_FOLDER;
  } else if (type === ENUM_RESOURCE.TYPE.IMAGE && size! < ICON_THRESHOLD) {
    return `${RESOURCE_PREVIEW_PREFIX}${path}`;
  } else {
    return getFileSuffixIcon(suffix);
  }
}

/**
 * @name createUpload 创建上传任务
 */
export function createUpload() {
  return new Promise<boolean>((resolve, reject) => {
    const ele = document.createElement("input");
    ele.setAttribute("type", "file");
    ele.setAttribute("multiple", "true");
    ele.setAttribute("class", "none");
    document.body.append(ele);
    ele.click();
    ele.onchange = (e) => {
      try {
        const { files: detail } = e.target as HTMLInputElement;
        if (detail?.length) {
          const signal = new CustomEvent(Upload.name, { detail });
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
    let ele = document.createElement("iframe");
    ele.setAttribute("class", "none");
    ele.src = `${API_DOWNLOAD_FILE_URL}?id=${id}`;
    document.body.appendChild(ele);
    setTimeout(() => document.body.removeChild(ele), 2000);
  } catch (e) {
    message.error(`下载失败${e}`);
  }
}
