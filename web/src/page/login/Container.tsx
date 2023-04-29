import React from 'react';
import styles from './index.module.sass';
import ICON_LOGO from '@/assets/logo.svg';
import { GithubOutlined } from '@ant-design/icons';

interface TypeContainerProps {
  children?: React.ReactNode;
};

const Container: React.FC<TypeContainerProps> = ({ children }) => (
  <main className={styles.layout}>
    <div className={styles.login}>
      <div>
        <img src={ICON_LOGO} alt="#" />
        {children}
      </div>
    </div>
    <footer>
      <a href='https://github.com/world56/drive' >
        <GithubOutlined /> 仅供个人开发学习使用
      </a>
    </footer>
  </main>
);

export default Container;
