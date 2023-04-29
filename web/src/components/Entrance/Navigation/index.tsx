import Query from './QUery';
import styles from './index.module.sass';
import privateRoutes from '@/router/paths/private';

/**
 * @name Navigation 导航
 */

const Navigation = () => {
  return (
    <div className={styles.nav}>
      <ul>
        <Query />
        {privateRoutes.map(v => <li key={v.title}>
          <div>
            <span>
              {v.icon}
              <span>{v.title}</span>
            </span>
          </div>
        </li>)}
      </ul>
    </div>
  );
};

export default Navigation;
