import styles from "./index.module.sass";
import { Modal as AntdModal, Spin } from "antd";

import type { ModalProps, SpinProps } from "antd";

interface TypeModal extends ModalProps, Pick<SpinProps, "spinning" | "tip"> {
  /**
   * @param spacing 间距
   * @description 增加 antd5.x Modal-Header间距
   */
  spacing?: boolean;
}

/**
 * @name Modal 弹窗
 * @description antd Modal组件 添加了loading属性
 */
const Modal: React.FC<TypeModal> = ({
  children,
  className,
  spacing = true,
  spinning = false,
  ...modalProps
}) => (
  <AntdModal
    confirmLoading={spinning}
    className={`${spacing ? styles.modal : ""} ${className}`}
    {...modalProps}
  >
    <Spin spinning={spinning}>{children}</Spin>
  </AntdModal>
);

export default Modal;
