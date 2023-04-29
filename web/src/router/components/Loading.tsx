import { Spin } from 'antd';
import styles from './index.module.sass';

const PageLoading = () => (
  <div className={styles.loadingView}>
    <Spin size="large" className={styles.sping} />
  </div>
);

export default PageLoading;
