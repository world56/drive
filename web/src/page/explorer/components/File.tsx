import styles from "./index.module.sass";

const File = () => {
  return (
    <div className={styles.file}>
      <div>
        <img
          src="https://img.pconline.com.cn/images/upload/upc/tx/photoblog/1411/24/c6/41272187_41272187_1416843675065.jpg"
          alt="#"
        />
      </div>
      <p>资料处理文件夹</p>
      <p>
        <span>3MB</span>
        <span>文档</span>
      </p>
    </div>
  );
};

export default File;
