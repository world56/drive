import { useActions } from "@/hooks";
import { useRef, useState } from "react";
import { useThrottleEffect } from "ahooks";

import type { TypeUploadContainerProps } from ".";
import { ENUM_COMMON } from "@/enum/common";

interface TypeUploadProgressProps
  extends Pick<TypeUploadContainerProps, "list"> {}

/**
 * @name Progress 上传上传进度
 * @description 根据上传任务的index、length联合计算
 */
const Progress: React.FC<TypeUploadProgressProps> = ({ list }) => {
  const actions = useActions();

  const [progress, setProgress] = useState(0);
  const mark = useRef<Record<string, boolean>>({});

  useThrottleEffect(() => {
    let size = 0;
    let total = 0;
    let progress = 0;
    const length = list.length;
    for (let i = 0; i < length; i++) {
      const item = list[i];
      if (mark.current[item.id]) continue;
      progress += item.index;
      total += item.length;
    }
    size = Math.round((progress / total) * 100) || 0;
    if (size === 100) {
      mark.current = Object.fromEntries(list.map((v) => [v.id, true]));
      actions.getFolders();
      document.dispatchEvent(
        new CustomEvent(ENUM_COMMON.CUSTOM_EVENTS.REFRESH_RESOURCES),
      );
    }
    setProgress(size);
  }, [list, mark]);

  return (
    <>
      <span />
      <span>{progress}%</span>
    </>
  );
};

export default Progress;
