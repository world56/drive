import { message } from "antd";
import { JSEncrypt } from "jsencrypt";
import { getSecretKey } from "@/api/auth";

/**
 * @name isVoid 判断是否为空值
 */
export function isVoid(param: unknown): param is boolean {
  return (
    param === undefined || param === null || param === "" || Number.isNaN(param)
  );
}

/**
 * @name encryption 加密内容
 */
export async function encryption(text: string | object) {
  const publicKey = await getSecretKey();
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(publicKey);
  const str = JSON.stringify(text);
  const code = encrypt.encrypt(str);
  if (code) {
    return code;
  } else {
    message.error("encryption failed");
    return Promise.reject("format error");
  }
}

/**
 * @name stopPropagation 阻止事件冒泡
 */
export function stopPropagation(e: React.MouseEvent<HTMLDivElement>) {
  e.stopPropagation();
}
