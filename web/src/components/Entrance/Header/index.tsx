import { Dropdown } from 'antd';
import Avatar from 'react-nice-avatar';
import styles from './index.module.sass';
import { LockOutlined, PoweroffOutlined } from '@ant-design/icons';

import ICON_LOGO from '@/assets/logo.svg';

const Header = () => {
  return (
    <header className={styles.header}>
      <h1>
        <img src={ICON_LOGO} alt="#" />云端硬碟
      </h1>

      <Dropdown
        arrow
        trigger={['click']}
        placement="bottom"
        overlayStyle={{
          maxWidth: 120,
          width: 120
        }}
        menu={{
          items: [
            {
              key: '0',
              icon: <LockOutlined />,
              label: '修改密码'
            },
            {
              key: '1',
              icon: <PoweroffOutlined />,
              label: '退出登陆'
            },
          ]
        }}>
        <div className={styles.user}>
          <Avatar />
          <span>管理员</span>
        </div>
      </Dropdown>

    </header>
  );
};

export default Header;
