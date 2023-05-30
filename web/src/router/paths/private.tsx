import {
  EyeOutlined,
  ToolOutlined,
  UserOutlined,
  HeartOutlined,
  FolderOutlined,
  DashboardOutlined,
} from '@ant-design/icons';
import { lazy } from "react";

const privateRoutes = [
  {
    title: '看板',
    icon: <DashboardOutlined />,
    path: '/',
    element: lazy(() => import("@/page/kanban"))
  },
  {
    title: '资源',
    icon: <FolderOutlined />,
    path: '/resource/:id?/*',
    element: lazy(() => import("@/page/resource"))
  },
  {
    title: '收藏',
    icon: <HeartOutlined />,
    path: '/favorite',
    element: lazy(() => import("@/page/favorite"))
  },
  {
    title: '用户',
    icon: <UserOutlined />,
    path: '/user',
    element: lazy(() => import("@/page/user"))
  },
  {
    title: '日志',
    icon: <EyeOutlined />,
    path: '/log',
    element: lazy(() => import("@/page/log"))
  },
  {
    title: '设置',
    icon: <ToolOutlined />,
    path: '/system',
    element: lazy(() => import("@/page/system"))
  },
];

export default privateRoutes;
