import styles from "./index.module.sass";
import Storage from "./component/Storage";
import ResourceRatio from "./component/ResourceRatio";
import Visit from "./component/Visit";

const Kanban = () => {
  return (
    <div className={styles.layout}>
      <div className={styles.system}>
        <Storage />
        <ResourceRatio />
        <Visit />
      </div>
    </div>
  );
};

export default Kanban;
