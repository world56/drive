import {
  EyeOutlined,
  ToolOutlined,
  UserOutlined,
  HeartOutlined,
  FolderOutlined,
  TrophyOutlined,
  HistoryOutlined,
} from '@ant-design/icons';
import { lazy } from "react";

const privateRoutes = [
  {
    title: '资源',
    icon: <FolderOutlined />,
    path: '/',
    element: lazy(() => import("@/page/home"))
  },
  {
    title: '收藏',
    icon: <HeartOutlined />,
    path: '/',
    element: lazy(() => import("@/page/home"))
  },
  {
    title: '排行',
    icon: <TrophyOutlined />,
    path: '/',
    element: lazy(() => import("@/page/home"))
  },
  {
    title: '最近',
    icon: <HistoryOutlined />,
    path: '/',
    element: lazy(() => import("@/page/home"))
  },
  {
    title: '用户',
    icon: <UserOutlined />,
    path: '/',
    element: lazy(() => import("@/page/home"))
  },
  {
    title: '日志',
    icon: <EyeOutlined />,
    path: '/',
    element: lazy(() => import("@/page/home"))
  },
  {
    title: '设置',
    icon: <ToolOutlined />,
    path: '/',
    element: lazy(() => import("@/page/home"))
  },
];

export default privateRoutes;
