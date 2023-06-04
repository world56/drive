import Item from "./Item";
import Container from "./Container";
import { filesFormat } from "./utils";
import { useRef, useState } from "react";
import { FixedSizeList } from "react-window";
import { useEventListener, useStore } from "@/hooks";

import type { TypeUploadProgress, TypeUploadStatus } from "./utils";

/**
 * @name Upload 上传资源
 */
const Upload = () => {
  const { path } = useStore("resource");

  const ref = useRef<TypeUploadProgress>({});
  const [status, setStatus] = useState<TypeUploadStatus>({});

  useEventListener<FileList>(Upload.name, (e) => {
    const files = e.detail;
    const folderId = path.at(-1);
    const { status, progress } = filesFormat(files, folderId);
    ref.current = { ...ref.current, ...progress };
    setStatus((s) => ({ ...s, ...status }));
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
