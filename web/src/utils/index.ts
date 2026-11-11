import store from "@/store";
import { message } from "antd";
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

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const b64 = pem
    .replace(/-----BEGIN PUBLIC KEY-----/, "")
    .replace(/-----END PUBLIC KEY-----/, "")
    .replace(/\s+/g, "");
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * @name encryption 加密内容（RSA-OAEP + SHA-256，与后端 DecryptOAEP 对齐）
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

  try {
    const publicKey = await crypto.subtle.importKey(
      "spki",
      pemToArrayBuffer(KEY),
      { name: "RSA-OAEP", hash: "SHA-256" },
      false,
      ["encrypt"]
    );
    const encrypted = await crypto.subtle.encrypt(
      { name: "RSA-OAEP" },
      publicKey,
      new TextEncoder().encode(JSON.stringify(text))
    );
    return arrayBufferToBase64(encrypted);
  } catch {
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
