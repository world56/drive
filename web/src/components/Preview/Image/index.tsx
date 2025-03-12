import Tools from "./Tools";
import { useRef } from "react";
import Container from "../Container";
import styles from "./index.module.sass";
import { TypeResource } from "@/interface/resource";

import { API_PROXY_EXPLORER_URL } from "@/config/request";

/**
 * @name Image 图片预览
 */
const Image: React.FC<{ data: TypeResource.DTO }> = ({ data }) => {
  const offset = useRef({ top: 0, left: 0, offsetX: 0, offsetY: 0 });

  const ref = useRef<HTMLImageElement>(null!);
  const container = useRef<HTMLDivElement>(null!);

  function onSize(increase: number) {
    const { offsetWidth, offsetHeight, offsetTop, offsetLeft, style } =
      ref.current;
    const width = offsetWidth * increase;
    const height = offsetHeight * increase;
    const left = (width - offsetWidth) / 2;
    const top = (height - offsetHeight) / 2;
    ref.current.style.cssText = `width:${width}px;height:${height}px;top:${
      offsetTop - top
    }px;left:${offsetLeft - left}px;transform:${style.transform}`;
  }

  function onReset() {
    onLoad();
  }

  function onLoad() {
    ref.current.style.height = "auto";
    ref.current.style.width = `${container.current.clientWidth / 2}px`;
    ref.current.style.transform = ``;
    ref.current.style.top = `calc(50% - ${ref.current.offsetHeight / 2}px)`;
    ref.current.style.left = `calc(50% - ${ref.current.offsetWidth / 2}px)`;
  }

  function onRotate() {
    const { transform } = ref.current.style;
    let rotate = "";
    switch (transform) {
      case "rotate(90deg)":
        rotate = "";
        break;
      case "rotate(180deg)":
        rotate = "rotate(90deg)";
        break;
      case "rotate(270deg)":
        rotate = "rotate(180deg)";
        break;
      default:
        rotate = "rotate(270deg)";
        break;
    }
    ref.current.style.transform = rotate;
  }

  function onMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    const layout = container.current!.getBoundingClientRect();
    const { offsetX, offsetY } = e.nativeEvent;
    offset.current = { offsetX, offsetY, top: layout.top, left: layout.left };
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mousemove", onMouseMove);
  }

  function onMouseMove(e: MouseEvent) {
    const { top, left, offsetX, offsetY } = offset.current;
    let t = e.clientY - offsetY - top;
    let l = e.clientX - offsetX - left;
    ref.current.style.top = `${t}px`;
    ref.current.style.left = `${l}px`;
  }

  function onMouseUp() {
    document.removeEventListener("mouseup", onMouseUp);
    document.removeEventListener("mousemove", onMouseMove);
  }

  return (
    <Container type="images" data={data}>
      <div
        ref={container}
        className={styles.layout}
        onWheel={(e) => onSize(e.deltaY > 0 ? 1.05 : 0.95)}
      >
        <img
          ref={ref}
          onLoad={onLoad}
          onMouseDown={onMouseDown}
          src={`${API_PROXY_EXPLORER_URL}resource/${data.path}`}
        />
        <Tools onRotate={onRotate} onSize={onSize} onReset={onReset} />
      </div>
    </Container>
  );
};

export default Image;
