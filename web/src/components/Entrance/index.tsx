import Navigation from './Navigation';
import styles from './index.module.sass';
import { Outlet } from "react-router-dom";
import Header from './Header';

const Entrance = () => {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <Navigation />
        <Outlet />
      </main>
    </>
  );
};

export default Entrance;
