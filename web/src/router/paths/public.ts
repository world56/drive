import { lazy } from "react";
import privateRoutes from './private';
import WhiteList from "../loader/Whitelist";
import Authentication from "../loader/Authentication";

import type { TypeRoute } from "../../interface/route";

const publicRoutes: TypeRoute.Route[] = [
  {
    title: '登陆',
    path: '/login',
    loader: WhiteList,
    element: lazy(() => import("@/page/login"))
  },
  {
    path: '/',
    loader: Authentication,
    element: lazy(() => import("@/components/Entrance")),
    children: privateRoutes
  },
];

export default publicRoutes;
