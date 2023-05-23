import Files from "./components/Files";
import Folder from "./components/Folder";
import styles from "./index.module.sass";

const Explorer = () => {
  return (
    <div className={styles.layout}>
      <Folder />
      <Files />
    </div>
  );
};

export default Explorer;
