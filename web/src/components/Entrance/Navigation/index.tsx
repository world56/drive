import styles from './index.module.sass';
import privateRoutes from '@/router/paths/private';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {

  const { pathname } = useLocation();

  return (
    <nav className={styles.nav}>
      {privateRoutes.map(v => <Link
        key={v.title}
        to={v.path}
        className={pathname === v.path ? styles.select : ''}
      >
        {v.icon}
        <p>{v.title}</p>
      </Link>)}
    </nav>
  );
};

export default Navigation;
