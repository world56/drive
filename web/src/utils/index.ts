import { message } from "antd";
import { JSEncrypt } from "jsencrypt";
import { getSecretKey } from "@/api/auth";

export function isVoid(param: unknown): param is boolean {
  return (
    param === undefined || param === null || param === "" || Number.isNaN(param)
  );
}

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
