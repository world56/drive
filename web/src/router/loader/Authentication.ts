import store from "@/store";
import cookie from "js-cookie";
import { redirect } from "react-router-dom";
import { TOKEN_KEY } from "@/config/request";
import { getUserInfo } from "@/store/saga/actions";

import type { LoaderFunctionArgs } from "@remix-run/router";

let uninstall: () => void;

export default function Authentication(_arg: LoaderFunctionArgs) {
  return new Promise((resolve, _reject) => {
    const token = cookie.get(TOKEN_KEY);
    const { id } = store.getState().user;
    if (token && !id) {
      store.dispatch(getUserInfo());
      uninstall = store.subscribe(
        () => (store.getState().user.id && uninstall()) || resolve(null),
      );
    } else if (!token) {
      resolve(redirect("/login"));
    } else {
      resolve(null);
    }
  });
}
