import {
  CloseOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
} from "@ant-design/icons";
import styles from "./index.module.sass";
import { useEffect, useRef, useState } from "react";
import { useActions, useElementMove } from "@/hooks";

import type { TypeResource } from "@/interface/resource";

interface TypeContainerProps {
  hover?: boolean;
  className?: string;
  data?: TypeResource.DTO;
  backgroundColor?: string;
  children?: React.ReactNode;
}

/**
 * @name Container 预览容器
 */
const Container: React.FC<TypeContainerProps> = ({
  data,
  hover,
  children,
  className,
  backgroundColor = "rgba(0, 0, 0, 0.3)",
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const actions = useActions();
  const { onPosition, onDragSize } = useElementMove(ref);

  const [full, setFull] = useState(false);

  function onWindowSize() {
    setFull((b) => !b);
    ref.current!.style.cssText = full
      ? defaultLayout()
      : `top:0px;left:0px;width:100%;height:100%`;
  }

  function onDoubleClick() {
    setFull((b) => !b);
    if (full) {
      ref.current!.style.cssText = defaultLayout();
    } else {
      ref.current!.style.cssText = "top:0px;left:0px;width:100%;height:100%;";
    }
  }

  function defaultLayout() {
    const width = window.innerWidth / 2;
    const height = window.innerHeight / 2;
    return `
      position: absolute;
      width: ${width}px;
      height: ${height}px;
      top: ${window.innerHeight / 2 - height / 2}px;
      left: ${window.innerWidth / 2 - width / 2}px;
    `;
  }

  function onClose() {
    if (!data?.id) return;
    actions.delPreview({ key: "images", value: data.id });
  }

  useEffect(() => {
    ref.current!.style.cssText = defaultLayout();
  }, [ref]);

  return (
    <div ref={ref} className={`${styles.layout} ${hover ? styles.hover : ""}`}>
      <div
        className={styles.title}
        onMouseDown={onPosition}
        style={{ backgroundColor }}
        onDoubleClick={onDoubleClick}
      >
        <p>{data?.fullName}</p>
        {full ? (
          <FullscreenExitOutlined onClick={onWindowSize} />
        ) : (
          <FullscreenOutlined onClick={onWindowSize} />
        )}
        <CloseOutlined onClick={onClose} />
      </div>
      <div className={className}>{children}</div>
      <>
        <div className={styles.t} onMouseDown={(e) => onDragSize(e, "T")} />
        <div className={styles.b} onMouseDown={(e) => onDragSize(e, "B")} />
        <div className={styles.l} onMouseDown={(e) => onDragSize(e, "L")} />
        <div className={styles.r} onMouseDown={(e) => onDragSize(e, "R")} />
        <div className={styles.bl} onMouseDown={(e) => onDragSize(e, "B_L")} />
        <div className={styles.br} onMouseDown={(e) => onDragSize(e, "B_R")} />
        <div className={styles.tl} onMouseDown={(e) => onDragSize(e, "T_L")} />
        <div className={styles.tr} onMouseDown={(e) => onDragSize(e, "T_R")} />
      </>
    </div>
  );
};

export default Container;
