import Item from "./Item";
import { filesFormat } from "./utils";
import Container from "./Container/index";
import { uploadChunk } from "@/api/resource";
import { FixedSizeList } from "react-window";
import { useMemo, useRef, useState } from "react";
import { useEventListener, useStore, useToFolder } from "@/hooks";

import { ENUM_COMMON } from "@/enum/common";
import { ENUM_RESOURCE } from "@/enum/resource";
import { UPLOAD_FILE_MAX_COUNT } from "@/config/resource";

import type { TypeUploadProgress, TypeUploadStatus } from "./utils";

export type TypeQueue = Record<
  "RUN" | "WAIT" | "PAUSE" | "ERROR" | "DONE",
  string[]
>;

/**
 * @name ENUM_UPLOAD_EVENT Upload组件 全部事件类型
 */
export enum ENUM_UPLOAD_EVENT {
  /** @param START 开始任务 */
  START,
  /** @param PAUSE 暂停任务 */
  PAUSE,
  /** @param DELETE 删除任务 */
  DELETE,
  /** @param CD 跳转至文件所在目录 */
  CD,
}

/**
 * @name Upload 上传资源
 */
const Upload = () => {
  const toFolder = useToFolder();

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
    if (!RUN.length && !WAIT.length) return;
    const index = UPLOAD_FILE_MAX_COUNT - RUN.length;
    const insert = WAIT.splice(0, index);
    RUN.push(...insert);
    insert.forEach(task);
  }

  async function task(id: string) {
    const file = ref.current[id];
    if (!file) return;
    const { RUN, DONE, ERROR } = queue.current;
    try {
      let i = file.index;
      const length = file?.chunks?.length!;
      while (i < length) {
        if (!file?.run) return;
        file.control = new AbortController();
        const res = await uploadChunk(file.chunks![i], file.control);
        file.index = ++i;
        setStatus((s) => {
          const target = s[id];
          target.index = file.index;
          target.progress = Math.floor((i / length) * 100);
          if (res) {
            file.chunks = null;
            target.paths = res.paths;
            target.parentId = res.parentId;
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

  function onStart(id?: string) {
    const { WAIT, ERROR, PAUSE } = queue.current;
    const ids = id ? [id] : [...PAUSE, ...ERROR];
    if (id) {
      const isPause = status[id].status === ENUM_RESOURCE.STATUS.PAUSE;
      const ids = isPause ? PAUSE : ERROR;
      ids.splice(ids.indexOf(id), 1);
    } else {
      if (!ids.length) return;
      PAUSE.length = 0;
      ERROR.length = 0;
    }
    ids.forEach((id) => (ref.current[id]!.run = true));
    WAIT.push(...ids);
    setStatus((s) => {
      ids.forEach((id) => (s[id].status = ENUM_RESOURCE.STATUS.UPLOADING));
      return { ...s };
    });
    scheduler();
  }

  function onPause(id?: string) {
    const { RUN, WAIT, PAUSE } = queue.current;
    const ids = id ? [id] : [...RUN, ...WAIT];
    if (id) {
      RUN.splice(RUN.indexOf(id), 1);
    } else {
      if (!ids.length) return;
      RUN.length = 0;
      WAIT.length = 0;
    }
    PAUSE.push(...ids);
    ids.forEach((id) => {
      ref.current[id]!.run = false;
      ref.current[id]!.control?.abort();
    });
    setStatus((s) => {
      ids.forEach((id) => (s[id].status = ENUM_RESOURCE.STATUS.PAUSE));
      return { ...s };
    });
  }

  function onDelete(id?: string) {
    if (id) {
      const { PAUSE, ERROR, DONE } = queue.current;
      [PAUSE, ERROR, DONE].forEach((arr) => {
        const i = arr.indexOf(id);
        ~i && arr.splice(arr.indexOf(id), 1);
      });
      setStatus((s) => {
        ref.current[id] = null;
        return Object.fromEntries(
          Object.entries(s).filter(([id]) => ref.current[id]),
        );
      });
    } else {
      queue.current = { RUN: [], WAIT: [], PAUSE: [], ERROR: [], DONE: [] };
      ref.current = {};
      setStatus({});
    }
  }

  function onEvent(type: ENUM_UPLOAD_EVENT, id?: string) {
    switch (type) {
      case ENUM_UPLOAD_EVENT.START:
        return onStart(id);
      case ENUM_UPLOAD_EVENT.PAUSE:
        return onPause(id);
      case ENUM_UPLOAD_EVENT.DELETE:
        return onDelete(id);
      case ENUM_UPLOAD_EVENT.CD:
        return toFolder(id);
      default:
        return;
    }
  }

  useEventListener<FileList>(ENUM_COMMON.CUSTOM_EVENTS.UPLOAD, (e) => {
    const files = e.detail;
    const folderId = path.at(-1);
    const { status, progress } = filesFormat(files, folderId);
    queue.current.WAIT.push(...Object.keys(progress));
    ref.current = { ...ref.current, ...progress };
    setStatus((s) => ({ ...s, ...status }));
    scheduler();
  });

  const list = useMemo(
    () =>
      Object.values(queue.current)
        .flat()
        .map((id) => status[id]),
    [status],
  );

  return (
    <Container onEvent={onEvent} list={list} queue={queue.current}>
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
