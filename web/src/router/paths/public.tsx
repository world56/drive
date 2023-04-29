import { lazy } from "react";
import privateRoutes from './private';

import type { TypeRoute } from "../../interface/route";

const publicRoutes: TypeRoute.Route[] = [
  {
    title: '登陆',
    path: '/login',
    element: lazy(() => import("@/page/login"))
  },
  {
    path: '/',
    element: lazy(() => import("@/components/Entrance")),
    children: privateRoutes
  },
];

export default publicRoutes;
