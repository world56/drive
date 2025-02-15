import {
  CloseOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
} from "@ant-design/icons";
import { useRef, useState } from "react";
import styles from "./index.module.sass";
import { useElementMove } from "@/hooks";

interface TypeContainerProps {
  title: string;
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
      ? "top:20%;left:25%;width:50%;height:40%"
      : `top:0px;left:0px;width:100%;height:100%`;
  }

  function onDoubleClick() {
    if (
      ref.current?.style.cssText ===
      "top: 0px; left: 0px; width: 100%; height: 100%;"
    ) {
      ref.current!.style.cssText = `top:20%; left:20%; width: 40%; height: 40%`;
    } else {
      ref.current!.style.cssText = "top:0px;left:0px;width:100%;height:100%;";
    }
  }

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
