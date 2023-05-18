import React from 'react';
import styles from './index.module.sass';
import ICON_LOGO from '@/assets/logo.svg';

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
  </main>
);

export default Container;
