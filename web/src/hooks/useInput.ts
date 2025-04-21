import { useState, ChangeEvent } from "react";

type TypeBasic = string | number;

/**
 * @name useInput Input输入框
 * @param defaultValue 初始化默认值
 */
export default function useInput<T extends TypeBasic = TypeBasic>(
  defaultValue?: T,
) {
  const [value, setValue] = useState<T | undefined>(defaultValue);

  function onChange(e: ChangeEvent<HTMLInputElement> | T) {
    if (typeof e === "string" || typeof e === "number" || e === undefined) {
      setValue(e);
    } else {
      setValue(e.target.value as T);
    }
  }

  return {
    value,
    onChange,
  };
}
