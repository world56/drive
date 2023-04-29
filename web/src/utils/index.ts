import { message } from "antd";
import { JSEncrypt } from "jsencrypt";

export async function encryption(text: string) {
  const publicKey = await (await fetch("")).json();
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(publicKey);
  const code = encrypt.encrypt(text);
  if (code) {
    return code;
  } else {
    message.error("登录错误，请联系管理员");
    return Promise.reject("format error");
  }
}
