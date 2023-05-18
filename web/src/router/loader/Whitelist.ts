import cookie from "js-cookie";
import { redirect } from "react-router-dom";

import { TOKEN_KEY } from "@/config/user";

export default function WhiteList() {
  return cookie.get(TOKEN_KEY) ? redirect("/") : null;
};
