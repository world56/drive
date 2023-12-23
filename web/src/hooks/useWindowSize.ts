import { useDebounceFn } from "ahooks";
import { useEffect, useState } from "react";

/**
 * @name useWindowSize 浏览器窗口大小变化
 */
export default function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const { run: callBack } = useDebounceFn(
    () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setSize({ width, height });
    },
    { wait: 500 },
  );

  useEffect(() => {
    window.addEventListener("resize", callBack);
    return () => {
      window.removeEventListener("resize", callBack);
    };
  }, []);

  return size;
}
