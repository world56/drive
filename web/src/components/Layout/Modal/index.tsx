import styles from './index.module.sass';
import { Modal as AntdModal, Spin } from 'antd';

import type { ModalProps } from 'antd/lib/modal/Modal';

interface TypeModal extends ModalProps {
  /** 
   * @param loading 加载动画 
   */
  loading?: boolean;
  /** 
   * @param spacing 间距 
   * @description 增加 antd5.x Modal-Header间距
   */
  spacing?: boolean;
};

/**
 * @name Modal 弹窗
 * @description antd Modal组件 添加了loading属性
 */
const Modal: React.FC<TypeModal> = ({
  children,
  className,
  spacing = true,
  loading = false,
  ...modalProps
}) => (
  <AntdModal
    confirmLoading={loading}
    className={`${spacing ? styles.modal : ''} ${className}`}
    {...modalProps}>
    <Spin spinning={loading}>
      {children}
    </Spin>
  </AntdModal>
);

export default Modal;
