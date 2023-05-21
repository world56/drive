import styles from './index.module.sass';
import privateRoutes from '@/router/paths/private';

const Navigation = () => {
  return (
    <nav className={styles.nav}>
      {privateRoutes.map(v => <a key={v.title}>
        {v.icon}
        <p>{v.title}</p>
      </a>)}
    </nav>
  );
};

export default Navigation;