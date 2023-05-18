import './index.sass';
import store from '@/store';
import router from './router';
import { ConfigProvider } from 'antd';
import { Provider } from 'react-redux';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from "react-router-dom";

import { CONFIG_ANTD } from '@/config/antd';

const Root = (
  <ConfigProvider {...CONFIG_ANTD}>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </ConfigProvider>
);

createRoot(document.getElementById('root')!).render(Root);
