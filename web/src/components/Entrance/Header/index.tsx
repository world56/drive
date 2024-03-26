import router from "@/router";
import { Dropdown } from "antd";
import { logout } from "@/api/auth";
import { memo, useState } from "react";
import Avatar from "react-nice-avatar";
import styles from "./index.module.sass";
import Search from "@/components/Search";
import Password from "@/components/Password";
import { useActions, useStore } from "@/hooks";
import { PoweroffOutlined, LockOutlined } from "@ant-design/icons";

import ICON_LOGO from "@/assets/logo.svg";

import type { TypeUser } from "@/interface/user";
import type { MenuInfo } from "rc-menu/lib/interface";
import type { ItemType } from "antd/es/menu/hooks/useItems";

const Header = () => {
  const actions = useActions();
  const user = useStore("user");

  const [editPwdUserId, setPwdUserId] = useState<TypeUser.ChangePWD["id"]>();

  async function onClick(e: MenuInfo) {
    switch (e.key) {
      case "0":
        await logout();
        actions.delUserInfo();
        router.navigate("/login");
        return;
      case "2":
        setPwdUserId(user?.id);
        return;
      default:
        return;
    }
  }

  function onClosePwd() {
    setPwdUserId(undefined);
  }

  const items: ItemType[] = [
    {
      key: "2",
      icon: <LockOutlined />,
      label: "修改密码",
    },
    {
      key: "0",
      icon: <PoweroffOutlined />,
      danger: true,
      label: "退出登陆",
    },
  ];

  return (
    <header className={styles.header}>
      <h1>
        <img src={ICON_LOGO} />
        <span>Drive</span>
        <span>Cloud</span>
      </h1>

      <Search />
      <Dropdown arrow menu={{ items, onClick }}>
        <div className={styles.user}>
          <Avatar  />
          <span>{user.name}</span>
        </div>
      </Dropdown>
      <Password id={editPwdUserId} onClose={onClosePwd} />
    </header>
  );
};

export default memo(Header);
