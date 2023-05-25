import { toCategory } from "@/utils/format";

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
}
