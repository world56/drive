import { Drawer, Spin } from "antd";

import type { SpinProps, DrawerProps } from "antd";

interface TypeAntdDrawerProps
  extends DrawerProps,
    Pick<SpinProps, "tip" | "spinning"> {}

/**
 * @name AntdDrawer 抽屉弹窗
 * @description 增加了Spin 的 tip、spinning属性
 */
const AntdDrawer: React.FC<TypeAntdDrawerProps> = ({
  tip,
  spinning,
  children,
  ...otherProps
}) => (
  <Drawer {...otherProps}>
    <Spin tip={tip} spinning={spinning}>
      {children}
    </Spin>
  </Drawer>
);

export default AntdDrawer;
