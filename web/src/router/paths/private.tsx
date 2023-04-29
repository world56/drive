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
    title: '资源管理',
    icon: <FolderOutlined />,
    path: '/',
    element: lazy(() => import("@/page/home"))
  },
  {
    title: '收藏夹',
    icon: <HeartOutlined />,
    path: '/',
    element: lazy(() => import("@/page/home"))
  },
  {
    title: '下载排行榜',
    icon: <TrophyOutlined />,
    path: '/',
    element: lazy(() => import("@/page/home"))
  },
  {
    title: '最近上传',
    icon: <HistoryOutlined />,
    path: '/',
    element: lazy(() => import("@/page/home"))
  },
  {
    title: '用户与权限',
    icon: <UserOutlined />,
    path: '/',
    element: lazy(() => import("@/page/home"))
  },
  {
    title: '操作日志',
    icon: <EyeOutlined />,
    path: '/',
    element: lazy(() => import("@/page/home"))
  },
  {
    title: '系统配置',
    icon: <ToolOutlined />,
    path: '/',
    element: lazy(() => import("@/page/home"))
  },
];

export default privateRoutes;
