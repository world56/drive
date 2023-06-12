import { toCategory } from "@/utils/format";

import { ENUM_COMMON } from "@/enum/common";
import { ENUM_RESOURCE } from "@/enum/resource";

export namespace CONSTANT_RESOURCE {
  export const TYPE = toCategory([
    { id: ENUM_RESOURCE.TYPE.DOCUMENT, name: "文档" },
    { id: ENUM_RESOURCE.TYPE.AUDIO, name: "音频" },
    { id: ENUM_RESOURCE.TYPE.VIDEO, name: "视频" },
    { id: ENUM_RESOURCE.TYPE.IMAGE, name: "图片" },
    { id: ENUM_RESOURCE.TYPE.FOLDER, name: "文件夹" },
    { id: ENUM_RESOURCE.TYPE.COMPRESSED, name: "压缩文件" },
    { id: ENUM_RESOURCE.TYPE.OTHER, name: "其他" },
  ]);

  export const STATUS = toCategory([
    {
      id: ENUM_RESOURCE.STATUS.DONE,
      name: "完成",
      color: ENUM_COMMON.COLOR.GREEN,
    },
    {
      id: ENUM_RESOURCE.STATUS.PAUSE,
      name: "暂停",
      color: ENUM_COMMON.COLOR.ORANGE,
    },
    {
      id: ENUM_RESOURCE.STATUS.ERROR,
      name: "错误",
      color: ENUM_COMMON.COLOR.RED,
    },
    {
      id: ENUM_RESOURCE.STATUS.UPLOADING,
      name: "上传中",
      color: ENUM_COMMON.COLOR.GREEN,
    },
  ]);
}
