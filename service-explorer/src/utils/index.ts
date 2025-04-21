/**
 * @name notIsEmpty 验证值不是空值
 */
export function notIsEmpty(value: any) {
  return !['', NaN, undefined, null].includes(value);
}
