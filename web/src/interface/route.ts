import type React from "react";
import type { RouteProps } from "react-router-dom";
import type RefIcon from "@ant-design/icons/lib/icons/EyeFilled";

export namespace TypeRoute {
  export interface Route extends Omit<RouteProps, "children" | "element"> {
    hide?: boolean;
    title?: string;
    children?: Route[];
    icon?: typeof RefIcon;
    element: React.LazyExoticComponent<React.ComponentType>;
  }
}
