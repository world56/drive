import Image from "./Image";
import Video from "./Video";
import Music from "./Music";
import { useMemo } from "react";

import { useStore } from "@/hooks";

/**
 * @name Preview 资源预览
 */
const Preview = () => {
  const { images, videos, audios } = useStore("preview");

  const imgs = useMemo(() => Object.values(images), [images]);
  const vids = useMemo(() => Object.values(videos), [videos]);
  const musics = useMemo(() => Object.values(audios), [audios]);

  return (
    <>
      {imgs.map((v) => (v?.id ? <Image key={v.id} data={v} /> : null))}
      {vids.map((v) => (v?.id ? <Video key={v.id} data={v} /> : null))}
      {musics.map((v) => (v?.id ? <Music key={v.id} data={v} /> : null))}
    </>
  );
};

export default Preview;
