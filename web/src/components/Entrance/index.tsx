import Header from "./Header";
import Upload from "../Upload";
import Navigation from "./Navigation";
import styles from "./index.module.sass";
import { Outlet } from "react-router-dom";

const Entrance = () => (
  <>
    <Header />
    <main className={styles.main}>
      <Navigation />
      <div className={styles.children}>
        <Outlet />
      </div>
    </main>
    <Upload />
  </>
);

export default Entrance;
