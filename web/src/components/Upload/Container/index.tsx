import { Empty } from "antd";
import Header from "./Header";
import { useState } from "react";
import Progress from "./Progress";
import styles from "../index.module.sass";
import { useActions, useStore } from "@/hooks";

import { ENUM_UPLOAD_EVENT } from "..";

import type { TypeQueue } from "../";
import type { TypeUploadStatus } from "../utils";

export interface TypeUploadContainerProps<T = ENUM_UPLOAD_EVENT> {
  /** @param list 任务列表 */
  list: Array<TypeUploadStatus[keyof TypeUploadStatus]>;
  /** @param queue 任务队列 */
  queue: TypeQueue;
  /**
   * @name onEvent 上传组件的事件派发中心
   * @param {ENUM_UPLOAD_EVENT} type 事件类型
   * @param {string} id 传递ID是单个任务 ，未传递ID是Header组件可触发的“全部”类型（例：全部开始、全部暂停...）
   * @description 所有的 开始、暂停、删除、打开目录 事件的唯一出口
   */
  onEvent(type: T, id?: string): void;
  children?: React.ReactNode;
}

/**
 * @name Container 抽离非核心UI、功能
 * @description 进度、状态
 */
const Container: React.FC<TypeUploadContainerProps> = ({
  list,
  queue,
  onEvent,
  children,
}) => {
  const actions = useActions();
  const { UPLOAD } = useStore("config");

  const [open, setOpen] = useState(false);

  const total = list.length;

  function onExpand() {
    setOpen((b) => !b);
  }

  function onClose() {
    actions.setConfig({ UPLOAD: false });
  }

  function onItemClick(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    const targetElement = e.target as HTMLElement;
    const ele = targetElement.closest("span");
    if (!ele?.dataset) return;
    const { id, type } = ele.dataset;
    onEvent(Number(type), id);
  }

  return (
    <div
      className={`${UPLOAD ? styles.layout : "none"} 
      ${open ? styles.open : styles.close}`}
    >
      <Header
        queue={queue}
        total={total}
        onEvent={onEvent}
        onClose={onClose}
        onExpand={onExpand}
      >
        {total ? <Progress list={list} /> : null}
      </Header>
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
