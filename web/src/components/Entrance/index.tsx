import Header from './Header';
import Navigation from './Navigation';
import styles from './index.module.sass';
// import { Outlet } from "react-router-dom";

const Entrance = () => {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <Navigation />
        {/* <Outlet /> */}
      </main>
    </>
  );
};

export default Entrance;
