import Visit from "./component/Hot";
import Trend from "./component/Trend";
import styles from "./index.module.sass";
import Storage from "./component/Storage";
import Recently from "./component/Recently";
import ResourceRatio from "./component/ResourceRatio";
import History from "./component/History";

/**
 * @name Kanban 网盘综合统计
 */
const Kanban = () => {
  return (
    <div className={styles.layout}>
      <div className={styles.top}>
        <div className={styles.system}>
          <Storage />
          <ResourceRatio />
        </div>
        <div className={styles.other}>
          <Trend />
          <Recently />
        </div>
      </div>
      <div className={styles.bottom}>
        <Visit />
        <History />
      </div>
    </div>
  );
};

export default Kanban;
