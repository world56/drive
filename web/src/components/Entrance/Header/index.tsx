import { memo } from 'react';
import router from '@/router';
import { Dropdown } from 'antd';
import { logout } from '@/api/auth';
import Avatar from 'react-nice-avatar';
import styles from './index.module.sass';
import ICON_LOGO from '@/assets/logo.svg';
import { useActions, useStore } from '@/hooks';
import { PoweroffOutlined, LockOutlined } from '@ant-design/icons';

import type { MenuInfo } from 'rc-menu/lib/interface';
import type { ItemType } from 'antd/es/menu/hooks/useItems';

const Header = () => {

  const { user } = useStore();
  const actions = useActions();

  async function onClick(e: MenuInfo) {
    switch (e.key) {
      case '0':
        await logout();
        actions.delUserInfo();
        router.navigate('/login');
        return;
      default: return;
    }
  };

  const items: ItemType[] = [
    {
      key: '2',
      icon: <LockOutlined />,
      label: '修改密码'
    },
    {
      key: '0',
      icon: <PoweroffOutlined />,
      danger: true,
      label: '退出登陆'
    },
  ];

  return (
    <header className={styles.header}>
      <h1>
        <img src={ICON_LOGO} />
        <span>Drive</span>
        <span>Cloud</span>
      </h1>

      <Dropdown arrow menu={{ items, onClick }}>
        <div className={styles.user}>
          <Avatar isGradient />
          <span>{user.name}</span>
        </div>
      </Dropdown>
    </header>
  );
};

export default memo(Header);
