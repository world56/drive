import { Dropdown } from "antd";
import styles from "./index.module.sass";
import { stopPropagation } from "@/utils";
import { TypeResource } from "@/interface/resource";

const items = [{ label: "上传资源", key: 1 }];

/**
 * @name File 资源、文件图标
 */
const File: React.FC<TypeResource.DTO> = (props) => {
  return (
    <Dropdown menu={{ items }} destroyPopupOnHide trigger={["contextMenu"]}>
      <div className={styles.file} onContextMenu={stopPropagation}>
        <div>
          <img
            src="https://img.pconline.com.cn/images/upload/upc/tx/photoblog/1411/24/c6/41272187_41272187_1416843675065.jpg"
            alt="#"
          />
        </div>
        <p>{props.name}</p>
        <p>
          <span>3MB</span>
          <span>文档</span>
        </p>
      </div>
    </Dropdown>
  );
};

export default File;
