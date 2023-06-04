import Item from "./Item";
import Container from "./Container";
import { filesFormat } from "./utils";
import { useRef, useState } from "react";
import { FixedSizeList } from "react-window";
import { useEventListener, useStore } from "@/hooks";

import { UPLOAD_FILE_MAX_COUNT } from "@/config/file";

import type { TypeUploadProgress, TypeUploadStatus } from "./utils";

type TypeQueue = Record<"RUN" | "WAIT" | "PAUSE" | "ERROR" | "DONE", string[]>;

/**
 * @name Upload 上传资源
 */
const Upload = () => {
  const { path } = useStore("resource");

  const queue = useRef<TypeQueue>({
    RUN: [],
    WAIT: [],
    PAUSE: [],
    ERROR: [],
    DONE: [],
  });
  const ref = useRef<TypeUploadProgress>({});

  const [status, setStatus] = useState<TypeUploadStatus>({});

  function checkTasks() {
    const { RUN, WAIT } = queue.current;
    const index = UPLOAD_FILE_MAX_COUNT - RUN.length;
    const insert = WAIT.splice(0, index);
  }

  useEventListener<FileList>(Upload.name, (e) => {
    const files = e.detail;
    const folderId = path.at(-1);
    const { status, progress } = filesFormat(files, folderId);
    ref.current = { ...ref.current, ...progress };
    setStatus((s) => ({ ...s, ...status }));
    checkTasks();
  });

  const list = Object.values(status);

  return (
    <Container>
      <FixedSizeList
        width={352}
        height={447}
        itemSize={56}
        children={Item}
        itemData={list}
        itemCount={list.length}
      />
    </Container>
  );
};

export default Upload;
