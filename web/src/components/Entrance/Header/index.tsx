import { useStore } from '@/hooks';
import Avatar from 'react-nice-avatar';
import styles from './index.module.sass';
import ICON_LOGO from '@/assets/logo.svg';

const Header = () => {

  const { user } = useStore();

  return (
    <header className={styles.header}>
      <h1>
        <img src={ICON_LOGO} />
        <span>Drive</span>
        <span>Cloud</span>
      </h1>

      <div className={styles.user}>
        <Avatar />
        <span>{user.name}</span>
      </div>

    </header>
  );
};

export default Header;
