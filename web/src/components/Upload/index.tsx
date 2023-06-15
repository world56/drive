import Item from "./Item";
import Container from "./Container";
import { filesFormat } from "./utils";
import { useRef, useState } from "react";
import { uploadChunk } from "@/api/resource";
import { FixedSizeList } from "react-window";
import { useEventListener, useStore } from "@/hooks";

import { ENUM_RESOURCE } from "@/enum/resource";
import { UPLOAD_FILE_MAX_COUNT } from "@/config/file";

import type { TypeUploadProgress, TypeUploadStatus } from "./utils";

export type TypeQueue = Record<
  "RUN" | "WAIT" | "PAUSE" | "ERROR" | "DONE",
  string[]
>;

/**
 * @name Upload 上传资源
 */
const Upload = () => {
  const { path } = useStore("resource");
  const [status, setStatus] = useState<TypeUploadStatus>({});

  const ref = useRef<TypeUploadProgress>({});
  const queue = useRef<TypeQueue>({
    RUN: [],
    WAIT: [],
    PAUSE: [],
    ERROR: [],
    DONE: [],
  });

  function scheduler() {
    const { RUN, WAIT } = queue.current;
    const index = UPLOAD_FILE_MAX_COUNT - RUN.length;
    const insert = WAIT.splice(0, index);
    RUN.push(...insert);
    insert.forEach(task);
  }

  async function task(id: string) {
    const file = ref.current[id];
    const { RUN, DONE, ERROR } = queue.current;
    try {
      let i = file.index;
      const length = file?.chunks?.length!;
      while (i < length) {
        file.control = new AbortController();
        const res = await uploadChunk(file.chunks![i], file.control);
        file.index = ++i;
        setStatus((s) => {
          const target = s[id];
          target.progress = Math.floor((i / length) * 100);
          if (res) {
            file.chunks = null;
            target.paths = res.paths;
            target.status = ENUM_RESOURCE.STATUS.DONE;
          }
          return { ...s };
        });
      }
      DONE.unshift(id);
    } catch (e) {
      if (!file.run) return;
      ERROR.unshift(id);
      setStatus((s) => {
        s[id].status = ENUM_RESOURCE.STATUS.ERROR;
        return { ...s };
      });
    } finally {
      RUN.splice(RUN.indexOf(id), 1);
      scheduler();
    }
  }

  useEventListener<FileList>(Upload.name, (e) => {
    const files = e.detail;
    const folderId = path.at(-1);
    const { status, progress } = filesFormat(files, folderId);
    queue.current.WAIT.push(...Object.keys(progress));
    ref.current = { ...ref.current, ...progress };
    setStatus((s) => ({ ...s, ...status }));
    scheduler();
  });

  const list = Object.values(queue.current)
    .flat()
    .map((id) => status[id]);

  return (
    <Container total={list.length} queue={queue.current}>
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
