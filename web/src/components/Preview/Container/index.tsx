import {
  // MinusOutlined,
  CloseOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
} from "@ant-design/icons";
import styles from "./index.module.sass";
import { getPreviewZIndex } from "@/utils/resource";
import { useActions, useElementMove } from "@/hooks";
import { useEffect, useMemo, useRef, useState } from "react";

import { DEFAULT_PREVIEW } from "@/store/preview";

import type { TypeResource } from "@/interface/resource";

interface TypeContainerProps {
  /**
   * @param size 可脱拽改变尺寸
   */
  size?: boolean;
  /**
   * @param none 隐藏、关闭
   */
  none?: boolean;
  /**
   * @param hover 鼠标移入显示title、tools
   */
  hover?: boolean;
  /**
   * @param defaultWidth 宽度
   */
  defaultWidth?: number;
  /**
   * @param defaultHeight 高度
   */
  defaultHeight?: number;
  /**
   * @name onClose 关闭按钮
   */
  onClose?(): void;
  /**
   * @param noFullScreen 隐藏全屏图标
   */
  noFullScreen?: boolean;
  className?: string;
  data?: TypeResource.DTO;
  backgroundColor?: string;
  children?: React.ReactNode;
  type: NonNullable<keyof typeof DEFAULT_PREVIEW>;
}

/**
 * @name Container 预览容器
 */
const Container: React.FC<TypeContainerProps> = ({
  none,
  type,
  data,
  hover,
  onClose,
  children,
  className,
  size = true,
  noFullScreen = true,
  defaultWidth = window.innerWidth / 2,
  defaultHeight = window.innerHeight / 2,
  backgroundColor = "rgba(0, 0, 0, 0.3)",
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const actions = useActions();
  const { onPosition, onDragSize } = useElementMove(ref);

  const [full, setFull] = useState(false);

  function onWindowSize() {
    setFull((b) => !b);
    if (full) {
      ref.current!.style.cssText = defaultLayout();
    } else {
      const zIndex = getElementZIndex();
      ref.current!.style.cssText = `top:0px;left:0px;width:100%;height:100%;z-index:${zIndex};`;
    }
  }

  function onDoubleClick() {
    setFull((b) => !b);
    if (full) {
      ref.current!.style.cssText = defaultLayout();
    } else {
      const zIndex = getElementZIndex();
      ref.current!.style.cssText = `top:0px;left:0px;width:100%;height:100%;z-index:${zIndex};`;
    }
  }

  function defaultLayout() {
    const zIndex = getElementZIndex();
    return `
      position: absolute;
      width: ${defaultWidth}px;
      height: ${defaultHeight}px;
      left: ${window.innerWidth / 2 - defaultWidth / 2}px;
      top: ${window.innerHeight / 2 - defaultHeight / 2}px;
      z-index: ${zIndex};
    `;
  }

  function getElementZIndex() {
    return ref.current?.style.zIndex;
  }

  function onClick() {
    ref.current!.style.zIndex = getPreviewZIndex();
  }

  function onCancel() {
    if (data?.id) {
      actions.delPreview({ key: type, value: data.id });
    } else {
      onClose?.();
    }
  }

  useEffect(() => {
    ref.current!.style.cssText = defaultLayout();
  }, [ref]);

  const defaultZIndex = useMemo(getPreviewZIndex, []);

  return (
    <div
      ref={ref}
      onMouseDown={onClick}
      className={`${styles.layout} ${hover ? styles.hover : ""}`}
      style={{ zIndex: defaultZIndex!, display: none ? "none" : "block" }}
    >
      <div
        className={styles.title}
        onMouseDown={onPosition}
        style={{ backgroundColor }}
        onDoubleClick={onDoubleClick}
      >
        <p>{data?.fullName}</p>
        <div className={styles.tools}>
          {/* <MinusOutlined /> */}
          {noFullScreen ? (
            full ? (
              <FullscreenExitOutlined onClick={onWindowSize} />
            ) : (
              <FullscreenOutlined onClick={onWindowSize} />
            )
          ) : null}
          <CloseOutlined onClick={onCancel} />
        </div>
      </div>
      <div className={className}>{children}</div>
      {size ? (
        <>
          <div className={styles.t} onMouseDown={(e) => onDragSize(e, "T")} />
          <div className={styles.b} onMouseDown={(e) => onDragSize(e, "B")} />
          <div className={styles.l} onMouseDown={(e) => onDragSize(e, "L")} />
          <div className={styles.r} onMouseDown={(e) => onDragSize(e, "R")} />
          <div
            className={styles.bl}
            onMouseDown={(e) => onDragSize(e, "B_L")}
          />
          <div
            className={styles.br}
            onMouseDown={(e) => onDragSize(e, "B_R")}
          />
          <div
            className={styles.tl}
            onMouseDown={(e) => onDragSize(e, "T_L")}
          />
          <div
            className={styles.tr}
            onMouseDown={(e) => onDragSize(e, "T_R")}
          />
        </>
      ) : null}
    </div>
  );
};

export default Container;
