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

import { ENUM_RESOURCE } from "@/enum/resource";
import { RESOURCE_PREVIEW_PREFIX } from "@/config/resource";

import type { TypeResource } from "@/interface/resource";

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
  // 压缩包
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

interface TypeResourceIconProps
  extends Pick<TypeResource.DTO, "type" | "suffix" | "path">,
    Partial<Record<"width" | "height", number | string>> {
  style?: React.CSSProperties;
  className?: string;
}

/**
 * @name getResourceIcon 获取文件图标
 */
function getResourceIcon<
  T extends TypeResourceIconProps = TypeResourceIconProps,
>({ path, type, suffix }: T) {
  if (type === ENUM_RESOURCE.TYPE.FOLDER) {
    return ICON_FOLDER;
  } else if (type === ENUM_RESOURCE.TYPE.IMAGE) {
    return `${RESOURCE_PREVIEW_PREFIX}${path}`;
  } else {
    return getFileSuffixIcon(suffix);
  }
}

/**
 * @name ResourceIcon 资源图标
 */
const ResourceIcon: React.FC<TypeResourceIconProps> = ({
  height,
  className,
  style = {},
  width = "100%",
  ...props
}) => (
  <img
    alt="#"
    className={className}
    src={getResourceIcon(props)}
    style={{ width, height, ...style }}
  />
);

export default ResourceIcon;
