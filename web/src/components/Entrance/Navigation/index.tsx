import { useMemo } from "react";
import { useStore } from "@/hooks";
import styles from "./index.module.sass";
import privateRoutes from "@/router/paths/private";
import { Link, matchPath, generatePath, useLocation, useParams } from "react-router-dom";

import { ENUM_USER } from "@/enum/user";

const Navigation = () => {
  const { role } = useStore("user");
  const { foldersObj } = useStore("resource");

  const { folderId } = useParams()
  const { pathname } = useLocation();

  const currentId = foldersObj[folderId!]?.paths?.at(-1)?.id || folderId || null;

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
      {nav.map((v) => {
        const pattern = v.path!;
        const active = matchPath({ path: pattern, end: pattern === "/" }, pathname);
        const to = pattern.includes(":")
          ? generatePath(pattern, { folderId: currentId })
          : pattern;

        return (
          <Link to={to} key={v.title} className={active ? styles.select : ""}>
            <v.icon />
            <p>{v.title}</p>
          </Link>
        );
      })}
    </nav>
  );
};

export default Navigation;
