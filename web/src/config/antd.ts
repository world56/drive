import zhCN from "antd/locale/zh_CN";

import type { ConfigProviderProps } from "antd/es/config-provider";

/**
 * @name CONFIG_ANTD antd 默认配置
 * @see https://ant.design/components/config-provider-cn
 */
export const CONFIG_ANTD: ConfigProviderProps = {
  locale: zhCN,
  theme: {
    token: {
      // borderRadius: 8,
      // // 品牌主色
      // colorPrimary: "#121726",
      // // // 背景边框颜色
      // // colorBorderBg: "red",
      // // 主色浅色背景色
      // colorPrimaryBg: "rgba(132, 133, 141,.2)",
      // // 基础文本色
      // colorTextBase: "#121726",
      // // 边框色
      // colorBorder: "#121726",
      // lineWidth: 2.9,
      // controlOutlineWidth: 0,
      // // placeholder颜色
      // // colorTextQuaternary: "#666",
      // // colorLinkActive:'red'
    },
  },
  form: {
    validateMessages: { required: "该字段不得为空" },
  },
};

/**
 * @name FORM_ACCOUNT_RULES 正则 校验用户账户合法性
 */
export const FORM_ACCOUNT_RULES = [
  { required: true, message: "请输入登录账号" },
  { min: 5, message: "最少5位字符" },
  { max: 15, message: "最多15位字符" },
  { message: "只允许包含数字、字母、下划线", pattern: /^[0-9a-zA-Z_]{1,}$/ },
];

/**
 * @name FORM_ACCOUNT_RULES 正则 校验用户密码合法性
 */
export const FORM_PASSWORD_RULES = [
  { required: true, message: "请输入登录密码" },
  { min: 5, message: "密码不得少于5位字符" },
  { max: 20, message: "密码最多不得超过20位字符" },
  { message: "只允许包含数字、字母、下划线", pattern: /^[0-9a-zA-Z_]{1,}$/ },
];
