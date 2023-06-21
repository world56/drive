import store from "@/store";
import { message } from "antd";
import Upload from "@/components/Upload";
import { ActionsConfig } from "@/store/config";

import ICON_DOC from "@/assets/file_doc.svg";
import ICON_IMG from "@/assets/file_img.svg";
import ICON_PDF from "@/assets/file_pdf.svg";
import ICON_PPT from "@/assets/file_ppt.svg";
import ICON_TXT from "@/assets/file_txt.svg";
import ICON_XLS from "@/assets/file_xls.svg";
import ICON_ZIP from "@/assets/file_zip.svg";
import ICON_MUSIC from "@/assets/file_music.svg";
import ICON_OTHER from "@/assets/file_other.svg";
import ICON_VIDEO from "@/assets/file_video.svg";
import ICON_PACKAGE from "@/assets/file_package.svg";

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
 * @name getFileIcon 获取文件图标
 */
export function getFileIcon(type?: string) {
  if (type) {
    const suffix = ICON[type.toLocaleLowerCase()];
    return suffix ? suffix : ICON_OTHER;
  } else {
    return ICON_OTHER;
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
