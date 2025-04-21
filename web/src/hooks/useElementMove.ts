import { useRef } from "react";

/**
 * @name useElementMove 移动元素
 */
export default function useElementMove(ref: React.RefObject<HTMLDivElement>) {
  const direction = useRef<
    "T" | "L" | "B" | "R" | "T_L" | "T_R" | "B_L" | "B_R"
  >();
  const ele = useRef({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    offsetX: 0,
    offsetY: 0,
    clientX: 0,
    clientY: 0,
  });

  function getElementZIndex() {
    return ref.current?.style.zIndex;
  }

  function getElementStyle(e: React.MouseEvent<HTMLDivElement>) {
    const { offsetX, offsetY } = e.nativeEvent;
    const { top, left } = ref.current!.getBoundingClientRect();
    ele.current = {
      top,
      left,
      offsetX,
      offsetY,
      clientX: e.clientX,
      clientY: e.clientY,
      width: ref.current!.clientWidth,
      height: ref.current!.clientHeight,
    };
  }

  function onPosition(e: React.MouseEvent<HTMLDivElement>) {
    if ((e.target as HTMLElement).closest("svg")?.tagName === "svg") return;
    getElementStyle(e);
    document.addEventListener("mouseup", onPositionMoveEnd);
    document.addEventListener("mousemove", onPositionMove);
  }

  function onPositionMove(e: MouseEvent) {
    const { width, height } = ele.current;
    document.body.style.userSelect = "none";
    let top = e.clientY - ele.current.offsetY;
    let left = e.clientX - ele.current.offsetX;
    const eleWidth = ele.current.width;
    const MAX_X = eleWidth - 20;
    if (left + MAX_X <= 0) {
      left = -MAX_X;
      ele.current.offsetX = MAX_X;
    }
    if (left + eleWidth >= window.innerWidth + MAX_X) {
      left = window.innerWidth - 20;
      ele.current.offsetX = 20;
    }
    if (top <= 0) {
      top = 0;
      ele.current.offsetY = 20;
    }
    if (top + 20 >= window.innerHeight) {
      top = window.innerHeight - 20;
    }
    const zIndex = getElementZIndex();
    ref.current!.style.cssText = `width:${width}px;height:${height}px;top:${top}px;left:${left}px;z-index:${zIndex};`;
  }

  function onDragSize(
    e: React.MouseEvent<HTMLDivElement>,
    type: (typeof direction)["current"],
  ) {
    direction.current = type;
    getElementStyle(e);
    document.addEventListener("mouseup", onDragSizeEnd);
    document.addEventListener("mousemove", onDragSizeChange);
  }

  function onDragSizeChange(e: MouseEvent) {
    document.body.style.userSelect = "none";
    let { top, left, clientX, clientY, width, height } = ele.current;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const minWidth = 200;
    const minHeight = 200;
    let coordinates: DOMRect;

    const deltaX = e.clientX - clientX;
    const deltaY = e.clientY - clientY;

    switch (direction.current) {
      case "B_R":
        width = Math.max(minWidth, width + deltaX);
        height = Math.max(minHeight, height + deltaY);
        if (left + width > windowWidth) {
          width = windowWidth - left;
        }
        if (top + height > windowHeight) {
          height = windowHeight - top;
        }
        break;

      case "T_L":
        coordinates = ref.current!.getBoundingClientRect();
        const newWidth = Math.max(minWidth, width - deltaX);
        const newHeight = Math.max(minHeight, height - deltaY);
        if (e.clientX <= 0) {
          left = 0;
          width = coordinates.right;
        } else {
          left = Math.max(0, left + (width - newWidth));
          width = newWidth;
        }
        if (e.clientY <= 0) {
          top = 0;
          height = coordinates.bottom;
        } else {
          top = Math.max(0, top + (height - newHeight));
          height = newHeight;
        }
        break;

      case "T_R":
        coordinates = ref.current!.getBoundingClientRect();
        width = Math.max(minWidth, width + deltaX);
        height = Math.max(minHeight, height - deltaY);
        if (top + deltaY < 0) {
          height = height + (top + deltaY);
          top = 0;
        } else {
          if (height === minHeight) {
            top = coordinates.top;
          } else {
            top += deltaY;
          }
        }
        if (left + width > windowWidth) {
          width = windowWidth - left;
        }
        break;

      case "B_L":
        coordinates = ref.current!.getBoundingClientRect();
        const newWidthBL = Math.max(minWidth, width - deltaX);
        const newHeightBL = Math.max(minHeight, height + deltaY);
        if (e.clientX <= 0) {
          left = 0;
          width = coordinates.right;
        } else {
          left = Math.max(0, left + (width - newWidthBL));
          width = newWidthBL;
        }
        height = newHeightBL;
        if (top + height > windowHeight) {
          height = windowHeight - top;
        }
        break;

      case "T":
        coordinates = ref.current!.getBoundingClientRect();
        const newHeightT = Math.max(minHeight, height - deltaY);
        if (e.clientY <= 0) {
          top = 0;
          height = coordinates.bottom;
        } else {
          top = Math.max(0, top + (height - newHeightT));
          height = newHeightT;
        }
        break;

      case "R":
        width = Math.max(minWidth, width + deltaX);
        if (left + width > windowWidth) {
          width = windowWidth - left;
        }
        break;

      case "B":
        height = Math.max(minHeight, height + deltaY);
        if (top + height > windowHeight) {
          height = windowHeight - top;
        }
        break;

      case "L":
        const newWidthL = Math.max(minWidth, width - deltaX);
        if (e.clientX <= 0) {
          left = 0;
          width = ref.current!.getBoundingClientRect().right;
        } else {
          left = Math.max(0, left + (width - newWidthL));
          width = newWidthL;
        }
        break;
    }
    const zIndex = getElementZIndex();
    ref.current!.style.cssText = `top:${top}px;left:${left}px;width:${width}px;height:${height}px;z-index:${zIndex};`;
  }

  function onDragSizeEnd() {
    document.removeEventListener("mouseup", onDragSizeEnd);
    document.removeEventListener("mousemove", onDragSizeChange);
    document.body.style.userSelect = "";
  }

  function onPositionMoveEnd() {
    document.removeEventListener("mouseup", onPositionMoveEnd);
    document.removeEventListener("mousemove", onPositionMove);
    document.body.style.userSelect = "";
  }

  return { onPosition, onDragSize };
}
