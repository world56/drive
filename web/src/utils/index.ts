import store from "@/store";
import { message } from "antd";
import { JSEncrypt } from "jsencrypt";
import { getKey } from "@/store/saga/actions";

/**
 * @name isEmpty 判断是否为空值
 */
export function isEmpty(param: unknown): param is boolean {
  if (
    param === undefined ||
    param === null ||
    param === "" ||
    Number.isNaN(param)
  ) {
    return true;
  } else if (Array.isArray(param) && !param.length) {
    return true;
  } else {
    return false;
  }
}

/**
 * @name encryption 加密内容
 */
export async function encryption(text: string | object) {
  let KEY = store.getState().config.KEY;
  if (!KEY) {
    KEY = await new Promise<string>((resolve) => {
      store.dispatch(getKey());
      const unsubscribe = store.subscribe(() => {
        const state = store.getState();
        if (state.config.KEY) {
          resolve(state.config.KEY);
          unsubscribe();
        }
      });
    });
  }
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(KEY);
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
export function stopPropagation(e?: React.MouseEvent<HTMLElement>) {
  e?.nativeEvent.stopImmediatePropagation();
  e?.stopPropagation();
}
