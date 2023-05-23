import { Breadcrumb, Button } from "antd";
import styles from '../index.module.sass';
import { HomeOutlined, CloudUploadOutlined } from "@ant-design/icons";

const Navigation = () => {
  return (
    <div className={styles.nav}>
      <Breadcrumb
        items={[
          { title: <HomeOutlined /> },
          { title: '视频资源' },
          { title: '国产电影' },
          { title: '流浪地球' },
        ]}
      />
      <Button icon={<CloudUploadOutlined />} size='small'>
        上传
      </Button>
    </div>
  );
};

export default Navigation;
