import Item from "./Item";
import Container from "./Container";
// import styles from './index.module.sass';
import { FixedSizeList } from "react-window";

/**
 * @name Upload 上传资源
 */
const Upload = () => {
  return (
    <Container>
      <FixedSizeList
        width={352}
        height={447}
        itemSize={56}
        itemCount={11}
        children={Item}
        itemData={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]}
      />
    </Container>
  );
};

export default Upload;
