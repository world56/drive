import Image from "./Image";
// import Music from "./Music";
// import Video from "./Video";

import { useStore } from "@/hooks";

/**
 * @name Preview 资源预览
 */
const Preview = () => {
  const { images } = useStore("preview");

  return (
    <>
      {images.map((v) => (
        <Image key={v.id} data={v} />
      ))}

      {/* <Image /> */}
      {/* <Video /> */}
    </>
  );
};

export default Preview;
