import { useDebounceFn } from "ahooks";
import { useEffect, useState } from "react";

/**
 * @name useWindowSize 浏览器窗口大小变化
 */
export default function useWindowSize(callBack?: Function) {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const { run } = useDebounceFn(
    () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setSize({ width, height });
      callBack?.();
    },
    { wait: 500 },
  );

  useEffect(() => {
    window.addEventListener("resize", run);
    return () => {
      window.removeEventListener("resize", run);
    };
  }, []);

  return size;
}
