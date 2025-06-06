import { Empty } from "antd";
import { useStore } from "@/hooks";
import styles from "./index.module.sass";

import { ENUM_RESOURCE } from "@/enum/resource";

import type { TypeThumbnailProps } from "../Thumbnail";

interface TypeEmptyPromptProps extends Pick<TypeThumbnailProps, "onMenu"> {}

/**
 * @name EmptyPrompt 为空提示
 */
const EmptyPrompt: React.FC<TypeEmptyPromptProps> = ({ onMenu }) => {
  const resource = useStore("resource");

  function onOperate(type: Parameters<typeof onMenu>[0]) {
    const id = resource.path.at(-1);
    const ids = id ? [id] : [];
    onMenu(type, ids);
  }

  return (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={
        <div className={styles.empty}>
          <p>没有相关资源，请点击</p>
          <span
            className={styles.btn}
            onClick={() => onOperate(ENUM_RESOURCE.MENU.UPLOAD_FILE)}
          >
            上传文件
          </span>
          <span>、</span>
          <span
            className={styles.btn}
            onClick={() => onOperate(ENUM_RESOURCE.MENU.UPLOAD_FOLDER)}
          >
            上传文件夹
          </span>
          <span>、</span>
          <span
            className={styles.btn}
            onClick={() => onOperate(ENUM_RESOURCE.MENU.MKDIR)}
          >
            创建文件夹
          </span>
        </div>
      }
    />
  );
};

export default EmptyPrompt;
