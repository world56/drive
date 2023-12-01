import { useState } from "react";

/**
 * @name useInput Input输入框
 * @param defaultValue 初始化默认值
 */
export default function useInput(defaultValue?: string) {
  const [value, setValue] = useState(defaultValue);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.target.value;
    setValue(e.target.value);
  }

  return {
    value,
    onChange,
  };
}
