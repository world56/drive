import { useMemo } from "react";
import { useStore } from "@/hooks";
import styles from "./index.module.sass";
import privateRoutes from "@/router/paths/private";
import { Link, useLocation } from "react-router-dom";

import { ENUM_USER } from "@/enum/user";

const Navigation = () => {
  const { role } = useStore("user");
  const { pathname } = useLocation();

  const nav = useMemo(() => {
    switch (role) {
      case ENUM_USER.ROLE.REG:
        return privateRoutes.slice(0, 3);
      default:
        return privateRoutes;
    }
  }, [role]);

  return (
    <nav className={styles.nav}>
      {nav.map((v) => (
        <Link
          to={v.path}
          key={v.title}
          className={pathname === v.path ? styles.select : ""}
        >
          {v.icon}
          <p>{v.title}</p>
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;
