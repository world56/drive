import {
  SyncOutlined,
  CheckOutlined,
  CloseOutlined,
  PauseOutlined,
  ClearOutlined,
  WarningOutlined,
  CaretRightOutlined,
  PauseCircleOutlined,
  CloudUploadOutlined,
} from "@ant-design/icons";
import { Popconfirm } from "antd";
import styles from "../index.module.sass";
import { stopPropagation } from "@/utils";

import { ENUM_UPLOAD_EVENT } from "..";

import type { TypeQueue } from "../";
import type { TypeUploadContainerProps } from ".";

interface TypeUploadHeaderProps
  extends Pick<TypeUploadContainerProps, "onEvent"> {
  /** @param 任务总数 */
  total: number;
  /** @param queue 任务队列 */
  queue: TypeQueue;
  /** @name onExpand 展开、关闭任务列表 */
  onExpand(): void;
  /** @name onClose 关闭上传组件界面 */
  onClose(): void;
  children?: React.ReactNode;
}

/**
 * @name Header 顶部状态显示
 * @description 主要包括进度状态、以及全部开始、全部暂停、全部清空事件
 */
const Header: React.FC<TypeUploadHeaderProps> = ({
  queue,
  total,
  onClose,
  onEvent,
  onExpand,
  children,
}) => {
  const { RUN, WAIT, PAUSE, ERROR } = queue;

  function onDispatchEvent(
    e: React.MouseEvent<HTMLElement>,
    type: ENUM_UPLOAD_EVENT,
  ) {
    stopPropagation(e);
    onEvent(type);
  }

  function onCloseUploadComponent(e: React.MouseEvent<HTMLSpanElement>) {
    stopPropagation(e);
    onExpand();
    onEvent(ENUM_UPLOAD_EVENT.DELETE);
    onClose();
  }

  function getStatusBar() {
    const UPLOADING = RUN.length + WAIT.length;
    if (UPLOADING) {
      return {
        TITLE: "上传中",
        ICON: <SyncOutlined spin />,
        TOOLS: (
          <PauseOutlined
            onClick={(e) => onDispatchEvent(e, ENUM_UPLOAD_EVENT.PAUSE)}
          />
        ),
      };
    } else if (PAUSE.length && !UPLOADING) {
      return {
        TITLE: "已暂停",
        ICON_DEL: true,
        ICON: <PauseCircleOutlined />,
        TOOLS: (
          <CaretRightOutlined
            onClick={(e) => onDispatchEvent(e, ENUM_UPLOAD_EVENT.START)}
          />
        ),
      };
    } else if (ERROR.length && !UPLOADING) {
      return {
        ICON: <WarningOutlined />,
        ICON_DEL: true,
        TITLE: "上传异常",
        TOOLS: (
          <CaretRightOutlined
            onClick={(e) => onDispatchEvent(e, ENUM_UPLOAD_EVENT.START)}
          />
        ),
      };
    } else if (!total) {
      return {
        TITLE: "暂无上传任务",
        ICON: <CloudUploadOutlined />,
        TOOLS: <CloseOutlined onClick={onCloseUploadComponent} />,
      };
    } else {
      return {
        ICON: <CheckOutlined />,
        ICON_DEL: true,
        TITLE: "上传完成",
        TOOLS: <CloseOutlined onClick={onCloseUploadComponent} title="关闭" />,
      };
    }
  }

  const { TITLE, ICON, TOOLS, ICON_DEL } = getStatusBar();

  return (
    <div onClick={onExpand} className={styles.header}>
      <div className={styles.status}>
        {ICON}
        <span>{TITLE}</span>
        {children}
      </div>
      <div className={styles.btn}>
        <Popconfirm
          title="确定清空任务列表？"
          onCancel={stopPropagation}
          className={ICON_DEL ? "" : "none"}
          onConfirm={(e) => onDispatchEvent(e!, ENUM_UPLOAD_EVENT.DELETE)}
        >
          <ClearOutlined onClick={stopPropagation} />
        </Popconfirm>
        {TOOLS}
      </div>
      <div className={styles.hover} />
    </div>
  );
};

export default Header;
