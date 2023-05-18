import privateRoutes from '@/router/paths/private';
import styles from './index.module.sass';



const Navigation = () => {
  return (
    <nav className={styles.nav}>
    {privateRoutes.map(v=><a key={v.path}>
      {v.icon}
      <p>{v.title}</p>
    </a>)}
    </nav>
  );
};

export default Navigation;