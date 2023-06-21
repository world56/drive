import {
  SyncOutlined,
  CheckOutlined,
  CloseOutlined,
  PauseOutlined,
  DeleteOutlined,
  WarningOutlined,
  CaretRightOutlined,
  PauseCircleOutlined,
  CloudUploadOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { Empty, Popconfirm } from "antd";
import styles from "./index.module.sass";
import { useActions, useStore } from "@/hooks";

import type { TypeQueue } from ".";
import { stopPropagation } from "@/utils";

interface TypeUploadContainerProps<T = ENUM_UPLOAD_EVENT> {
  /** @param total 上传任务总数 */
  total: number;
  /** @param queue 任务列表 */
  queue: TypeQueue;
  /**
   * @param onClick Header点击相关的事件
   * @description Header中公共事件、任务列表Item事件，统一在此触发并出参。
   * （“FixedSizeList”组件本身不提供事件绑定，在children父元素统一拦截并触发）
   */
  onClick(type: T, id?: string): void;
  children?: React.ReactNode;
}

/**
 * @name ENUM_UPLOAD_EVENT Upload组件事件类型
 */
export enum ENUM_UPLOAD_EVENT {
  /** @param START 开始任务 */
  START,
  /** @param PAUSE 暂停任务 */
  PAUSE,
  /** @param EMPTY 清空、删除任务 */
  EMPTY,
  /** @param CD 打开资源文件所在位置 */
  CD,
}

/**
 * @name Container 抽离非核心UI、功能
 * @description 进度
 */
const Container: React.FC<TypeUploadContainerProps> = ({
  total,
  queue,
  onClick,
  children,
}) => {
  const actions = useActions();
  const { UPLOAD } = useStore("config");

  const { RUN, WAIT, PAUSE, ERROR } = queue;

  const [open, setOpen] = useState(false);

  function onExpand() {
    setOpen((b) => !b);
  }

  function onClose(e: React.MouseEvent<HTMLSpanElement>) {
    e.stopPropagation();
    onExpand();
    actions.setConfig({ UPLOAD: false });
    onClick(ENUM_UPLOAD_EVENT.EMPTY);
  }

  function onDispatch(
    type: ENUM_UPLOAD_EVENT,
    e?: React.MouseEvent<HTMLElement>,
  ) {
    e?.nativeEvent.stopImmediatePropagation();
    e?.stopPropagation();
    onClick(type);
  }

  function onItemClick(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    const targetElement = e.target as HTMLElement;
    const ele = targetElement.closest("span");
    if (!ele?.dataset) return;
    const { id, type } = ele.dataset;
    onClick(Number(type), id);
  }

  function getStatusBar() {
    const UPLOADING = RUN.length + WAIT.length;
    if (UPLOADING) {
      return {
        TITLE: "上传中",
        ICON: <SyncOutlined spin />,
        TOOLS: (
          <PauseOutlined
            onClick={(e) => onDispatch(ENUM_UPLOAD_EVENT.PAUSE, e)}
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
            onClick={(e) => onDispatch(ENUM_UPLOAD_EVENT.START, e)}
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
            onClick={(e) => onDispatch(ENUM_UPLOAD_EVENT.START, e)}
          />
        ),
      };
    } else if (!total) {
      return {
        TITLE: "暂无上传任务",
        ICON: <CloudUploadOutlined />,
        TOOLS: <CloseOutlined onClick={onClose} />,
      };
    } else {
      return {
        ICON: <CheckOutlined />,
        ICON_DEL: true,
        TITLE: "上传完成",
        TOOLS: <CloseOutlined onClick={onClose} title="关闭" />,
      };
    }
  }

  const { TITLE, ICON, TOOLS, ICON_DEL } = getStatusBar();

  return (
    <div
      className={`${UPLOAD ? styles.layout : "none"} ${
        open ? styles.open : styles.close
      }`}
    >
      <div onClick={onExpand} className={styles.header}>
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
        <div className={styles.btn}>
          <Popconfirm
            title="确认清空任务列表？"
            onCancel={stopPropagation}
            className={ICON_DEL ? "" : "none"}
            onConfirm={(e) => onDispatch(ENUM_UPLOAD_EVENT.EMPTY, e)}
          >
            <DeleteOutlined onClick={stopPropagation} />
          </Popconfirm>
          {TOOLS}
        </div>
        <div className={styles.hover} />
      </div>
      <div onClick={onItemClick}>
        {open ? (
          total ? (
            children
          ) : (
            <Empty
              description="上传列表为空"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )
        ) : null}
      </div>
    </div>
  );
};

export default Container;
