import {
  CloseOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
} from "@ant-design/icons";
import { useElementMove } from "@/hooks";
import styles from "./index.module.sass";
import { useEffect, useRef, useState } from "react";

interface TypeContainerProps {
  title?: string;
  hover?: boolean;
  className?: string;
  backgroundColor?: string;
  children?: React.ReactNode;
}

/**
 * @name Container 预览容器
 */
const Container: React.FC<TypeContainerProps> = ({
  title,
  children,
  className,
  hover = true,
  backgroundColor = "rgba(0, 0, 0, 0.3)",
}) => {
  const [full, setFull] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  const { onPosition, onDragSize } = useElementMove(ref);

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
        <p>{title}</p>
        {full ? (
          <FullscreenExitOutlined onClick={onWindowSize} />
        ) : (
          <FullscreenOutlined onClick={onWindowSize} />
        )}
        <CloseOutlined />
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
