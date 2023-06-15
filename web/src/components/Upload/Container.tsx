import { useState } from "react";
import { useStore } from "@/hooks";
import styles from "./index.module.sass";
import {
  SyncOutlined,
  CheckOutlined,
  CloseOutlined,
  PauseOutlined,
  WarningOutlined,
  CaretRightOutlined,
  PauseCircleOutlined,
  CloudUploadOutlined,
} from "@ant-design/icons";

import type { TypeQueue } from ".";

interface TypeUploadContainerProps {
  total: number;
  queue: TypeQueue;
  children?: React.ReactNode;
}

/**
 * @name Container 抽离非核心UI、功能
 * @description 进度
 */
const Container: React.FC<TypeUploadContainerProps> = ({
  total,
  queue,
  children,
}) => {
  const { UPLOAD } = useStore("config");
  const { RUN, WAIT, PAUSE, ERROR } = queue;

  const [open, setOpen] = useState(false);

  function onClick() {
    setOpen((b) => !b);
  }

  function getStatusBar() {
    const UPLOADING = RUN.length + WAIT.length;
    if (UPLOADING) {
      return {
        TITLE: "上传中",
        ICON: <SyncOutlined spin />,
        TOOLS: <PauseOutlined />,
      };
    } else if (PAUSE.length && !UPLOADING) {
      return {
        TITLE: "已暂停",
        ICON: <PauseCircleOutlined />,
        TOOLS: <CaretRightOutlined />,
      };
    } else if (ERROR.length && !UPLOADING) {
      return {
        ICON: <WarningOutlined />,
        TITLE: "上传异常",
      };
    } else if (!total) {
      return {
        ICON: <CloudUploadOutlined />,
        TITLE: "暂无上传任务",
        TOOLS: <CloseOutlined />,
      };
    } else {
      return {
        ICON: <CheckOutlined />,
        TITLE: "上传完成",
        TOOLS: <CloseOutlined title="关闭" />,
      };
    }
  }

  const { TITLE, ICON, TOOLS } = getStatusBar();

  return (
    <div
      className={`${UPLOAD ? styles.layout : "none"} ${
        open ? styles.open : styles.close
      }`}
    >
      <div onClick={onClick} className={styles.header} title="点击打开、收起">
        <div className={styles.status}>
          {ICON}
          <span>{TITLE}</span>
          {total ? (
            <>
              <span />
              <span>100%</span>
            </>
          ) : null}
        </div>
        <div className={styles.btn}>{TOOLS}</div>
      </div>
      {open ? children : null}
    </div>
  );
};

export default Container;
