import {
  SyncOutlined,
  DownloadOutlined,
  FolderOpenOutlined,
  RotateLeftOutlined,
} from "@ant-design/icons";
import { Tooltip } from "antd";
import styles from "./index.module.sass";

import ICON_REDUCE from "@/assets/reduce.svg";
import ICON_ENLARGE from "@/assets/enlarge.svg";

interface TypeToolsProps {
  onReset(): void;
  onRotate(): void;
  onSize(multiplier: number): void;
}

/**
 * @name Tools 图标工具栏
 */
const Tools: React.FC<TypeToolsProps> = ({ onSize, onReset, onRotate }) => (
  <div className={styles.tools}>
    <Tooltip placement="top" title="放大">
      <img onClick={() => onSize(1.1)} src={ICON_ENLARGE} alt="#" />
    </Tooltip>

    <Tooltip placement="top" title="缩小">
      <img onClick={() => onSize(0.9)} src={ICON_REDUCE} alt="#" />
    </Tooltip>

    <Tooltip placement="top" title="旋转">
      <RotateLeftOutlined onClick={onRotate} />
    </Tooltip>

    <Tooltip placement="top" title="下载">
      <DownloadOutlined />
    </Tooltip>

    <Tooltip placement="top" title="跳转位置">
      <FolderOpenOutlined />
    </Tooltip>

    <Tooltip placement="top" title="复原">
      <SyncOutlined onClick={onReset} />
    </Tooltip>
  </div>
);

export default Tools;
