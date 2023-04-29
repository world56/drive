import './index.sass';
import router from './router';
import { ConfigProvider } from 'antd';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from "react-router-dom";

import { CONFIG_ANTD } from '@/config/antd';

const Root = (
  <ConfigProvider {...CONFIG_ANTD}>
    <RouterProvider router={router} />
  </ConfigProvider>
);

createRoot(document.getElementById('root')!).render(Root);
